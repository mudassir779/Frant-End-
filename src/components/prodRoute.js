import { createSlice } from "@reduxjs/toolkit";
import API_URL from "../utils/api";


const prodRoute = createSlice({
    name: "prod",
    initialState: {
        link: API_URL,
    },

    
})

export default prodRoute.reducer

