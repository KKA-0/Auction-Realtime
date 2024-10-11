import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios'; // Ensure axios is imported

const initialState = {
  products: {}, // Add products array to the initial state
};

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

function convertArrayToObject(array) {
  return array.reduce((acc, item) => {
      acc[item._id] = { ...item };
      return acc;
  }, {});
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie('token');
      const response = await axios.get(`${import.meta.env.VITE_APP_DOMAIN}/api/product`, {
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

export const addBid = createAsyncThunk(
  'products/addBid',
  async ({ productId, newBid }, { rejectWithValue }) => {
    try {
      const token = getCookie('token');
      const response = await axios.patch(`${import.meta.env.VITE_APP_DOMAIN}/api/product/bid`,
        {
          productId, newBid
        }, {
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
        const result = convertArrayToObject(action.payload);
        state.products = result;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error(action.payload);
      })
      .addCase(addBid.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.products = action.payload.product;
      })
      .addCase(addBid.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
});

export const { addProducts } = productSlice.actions;
export default productSlice.reducer;
