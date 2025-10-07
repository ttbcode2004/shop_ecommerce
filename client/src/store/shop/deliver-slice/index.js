import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getDelivers = createAsyncThunk(
  "delivers/getDelivers",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/delivers/getAllDelivers`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoading: false,
  deliverList: [],

  deliverError: null,
};

const deliverSlice = createSlice({
  name: "deliverSlice",
  initialState,
  reducers: {
    clearDeliverError: (state) => {
      state.deliverError = null;
    },

  },
  extraReducers: (builder) => {
    builder
        .addCase(getDelivers.pending, (state) => {
            state.isLoading = true;
            state.deliverError = null;
        })
        .addCase(getDelivers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.deliverList = action.payload?.data?.delivers || [];
        })
        .addCase(getDelivers.rejected, (state, action) => {
            state.isLoading = false;
            state.deliverList = [];
            state.deliverError = action.payload;
        });
    },

});

export const { clearDeliverError } = deliverSlice.actions;

export default deliverSlice.reducer;