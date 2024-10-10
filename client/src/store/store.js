import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./../features/user.slice"
import productSlice from "./../features/product.slice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        products: productSlice
    },
})