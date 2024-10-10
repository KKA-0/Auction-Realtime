import { createSlice, createAsyncThunk, current  } from '@reduxjs/toolkit'

const initialState = {
    userId: "",
    username: "",
    email: ""
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        addUser: (state, action) => {
           state.userId = action.payload.userId,
           state.username = action.payload.username,
           state.email = action.payload.email
        },
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer