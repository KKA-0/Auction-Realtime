import { createSlice, createAsyncThunk, current  } from '@reduxjs/toolkit'

const initialState = {
    
}

const productSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        addProducts: (state, action) => {
           state.Products = action.payload
        }, 
    }
})



export const { addProducts } = productSlice.actions
export default productSlice.reducer