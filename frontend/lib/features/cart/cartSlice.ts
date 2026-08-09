import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

export interface CartItem {
  _id: string;
  productId: string;
  variantId?: string;
  color?: string;
  storage?: string;
  ram?: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
  isLoading: boolean;
  error: string | null;
}

const loadState = () => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = localStorage.getItem('cart');
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    }
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: CartState) => {
  try {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      };
      localStorage.setItem('cart', JSON.stringify(stateToSave));
    }
  } catch (err) {
    // ignore
  }
};

const savedState = loadState() || {};

const initialState: CartState = {
  cartItems: [],
  shippingAddress: savedState.shippingAddress || {},
  paymentMethod: savedState.paymentMethod || 'PayPal',
  isLoading: false,
  error: null,
};

// Helper to map DB cart item to Redux cart item
const mapDBCart = (data: any[]): CartItem[] => {
  return data.map((item) => {
    // sometimes populate might fail if product is deleted
    const prod = item.product || {};
    
    // Check if variant matches to override price and image
    const variant = item.variantId && prod.variants 
      ? prod.variants.find((v: any) => v._id === item.variantId) 
      : null;
      
    return {
      _id: item._id, // use cart item _id as primary unique id
      productId: prod._id,
      variantId: item.variantId,
      color: item.color,
      storage: item.storage,
      ram: item.ram,
      name: prod.name || 'Unknown Product',
      image: (variant && variant.images && variant.images.length > 0) ? variant.images[0] : (prod.thumbnail || 'https://placehold.co/400x400/png?text=Product'),
      price: variant?.price || prod.price || 0,
      countInStock: variant?.stock || prod.stock || 10,
      qty: item.quantity,
    };
  });
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, variantId, color, storage, ram, quantity }: { productId: string; variantId?: string; color?: string; storage?: string; ram?: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, variantId, color, storage, ram, quantity });
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQtyAsync = createAsyncThunk(
  'cart/updateCartQtyAsync',
  async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/${cartItemId}`, { quantity });
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart/clear');
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Keep these synchronous for local storage
    saveShippingAddress: (state, action: PayloadAction<any>) => {
      state.shippingAddress = action.payload;
      saveState(state);
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      saveState(state);
    },
    clearCartOnLogout: (state) => {
      state.cartItems = [];
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.isLoading = true;
      state.error = null;
    };
    
    const handleFulfilled = (state: CartState, action: PayloadAction<CartItem[]>) => {
      state.isLoading = false;
      state.cartItems = action.payload;
    };
    
    const handleRejected = (state: CartState, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };

    builder.addCase(fetchCart.pending, handlePending);
    builder.addCase(fetchCart.fulfilled, handleFulfilled);
    builder.addCase(fetchCart.rejected, handleRejected);

    builder.addCase(addToCartAsync.pending, handlePending);
    builder.addCase(addToCartAsync.fulfilled, handleFulfilled);
    builder.addCase(addToCartAsync.rejected, handleRejected);

    builder.addCase(updateCartQtyAsync.pending, handlePending);
    builder.addCase(updateCartQtyAsync.fulfilled, handleFulfilled);
    builder.addCase(updateCartQtyAsync.rejected, handleRejected);

    builder.addCase(removeFromCartAsync.pending, handlePending);
    builder.addCase(removeFromCartAsync.fulfilled, handleFulfilled);
    builder.addCase(removeFromCartAsync.rejected, handleRejected);

    builder.addCase(clearCartAsync.pending, handlePending);
    builder.addCase(clearCartAsync.fulfilled, handleFulfilled);
    builder.addCase(clearCartAsync.rejected, handleRejected);
    
    // Clear cart on logout
    builder.addCase('auth/logout/fulfilled', (state) => {
      state.cartItems = [];
    });
  },
});

export const { saveShippingAddress, savePaymentMethod, clearCartOnLogout } = cartSlice.actions;

export default cartSlice.reducer;
