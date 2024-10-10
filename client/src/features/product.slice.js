import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios'; // Ensure axios is imported

const initialState = {
  products: [], // Add products array to the initial state
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie('token');
      const response = await axios.get('http://localhost:3000/api/product', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const { addProducts } = productSlice.actions;
export default productSlice.reducer;
