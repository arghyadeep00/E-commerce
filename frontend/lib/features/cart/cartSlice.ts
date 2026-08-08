import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

export interface CartItem {
  _id: string;
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

const initialState: CartState = loadState() || {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'PayPal',
  isLoading: false,
  error: null,
};

// Helper to map DB cart item to Redux cart item
const mapDBCart = (data: any[]): CartItem[] => {
  return data.map((item) => {
    // sometimes populate might fail if product is deleted
    const prod = item.product || {};
    return {
      _id: prod._id || item._id, // fallback
      name: prod.name || 'Unknown Product',
      image: prod.thumbnail || 'https://placehold.co/400x400/png?text=Product',
      price: prod.price || 0,
      countInStock: prod.stock || 10,
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
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartQtyAsync = createAsyncThunk(
  'cart/updateCartQtyAsync',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cart/${productId}`, { quantity });
      return mapDBCart(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    clearCartOnLogout: (state) => {
      state.cartItems = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    });
  },
});

export const { saveShippingAddress, savePaymentMethod, clearCartOnLogout } = cartSlice.actions;

export default cartSlice.reducer;
