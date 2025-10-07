import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const createNewSubOrder = createAsyncThunk(
  "subOrder/createNewSubOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/subOrders/createSubOrder`,
        orderData,
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

  // error states
  subOrderError: null,
  subOrderSuccess: null,
};

const shoppingSubOrderSlice = createSlice({
  name: "shoppingSubOrder",
  initialState,
  reducers: {
    clearSubOrderError: (state) => {
      state.subOrderError = null;
    },
    clearSubOrderSuccess: (state) => {
      state.subOrderSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createNewSubOrder
      .addCase(createNewSubOrder.pending, (state) => {
        state.isLoading = true;
        state.subOrderError = null;
      })
      .addCase(createNewSubOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subOrderSuccess = action.payload.message || "Đặt hàng thành công"
      })
      .addCase(createNewSubOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.subOrderError = action.payload;
      });
  },
});

export const { clearSubOrderError, clearSubOrderSuccess } = shoppingSubOrderSlice.actions;

export default shoppingSubOrderSlice.reducer;
