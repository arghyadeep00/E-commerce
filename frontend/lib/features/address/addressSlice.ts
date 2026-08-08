import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

export interface AddressItem {
  _id: string;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: AddressItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/address');
      return response.data as AddressItem[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData: Partial<AddressItem>, { rejectWithValue }) => {
    try {
      const response = await api.post('/address', addressData);
      return response.data as AddressItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ id, addressData }: { id: string, addressData: Partial<AddressItem> }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/address/${id}`, addressData);
      return response.data as AddressItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/address/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/address/default/${id}`);
      return response.data as AddressItem;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressesOnLogout: (state) => {
      state.addresses = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchAddresses.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.isDefault) {
        state.addresses.forEach(a => a.isDefault = false);
      }
      state.addresses.unshift(action.payload);
    });
    builder.addCase(createAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateAddress.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.addresses.forEach(a => a.isDefault = false);
      }
      const index = state.addresses.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(a => a._id !== action.payload);
    });

    // Set Default
    builder.addCase(setDefaultAddress.fulfilled, (state, action) => {
      state.addresses.forEach(a => a.isDefault = false);
      const index = state.addresses.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    });

    // Clear on logout
    builder.addCase('auth/logout/fulfilled', (state) => {
      state.addresses = [];
    });
  },
});

export const { clearAddressesOnLogout } = addressSlice.actions;

export default addressSlice.reducer;
