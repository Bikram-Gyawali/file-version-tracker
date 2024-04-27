import { configureStore, createSlice } from "@reduxjs/toolkit";

// store user details
const initialState = {
  name: "",
  email: "",
  token: "",
  id: "",
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;