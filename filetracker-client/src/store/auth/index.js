import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../userSlice";

const reducer = combineReducers({
    user: userSlice,
})

export default reducer