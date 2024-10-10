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
           state.user = action.payload
        }, 
    }
})



export const { addUser } = userSlice.actions
export default userSlice.reducer