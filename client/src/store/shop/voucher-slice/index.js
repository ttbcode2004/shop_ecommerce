import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getAllVouchers = createAsyncThunk(
  "vouchers/getAllVouchersByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/vouchers/getVouchersByUser`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const applyVoucher = createAsyncThunk(
  "vouchers/applyVoucher",
  async ({code, orderTotal}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/vouchers/applyVoucher`,
        {code, orderTotal},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  voucherList: [],
  // loading
  isLoading: false,

  // error
  voucherError: null,
};


const shoppingVoucherSlice = createSlice({
  name: "shoppingVoucher",
  initialState,
  reducers: {
    resetVoucherState: (state) => {
      state.voucherList = [];
      state.isLoading = false;
      state.voucherError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllVouchers
      .addCase(getAllVouchers.pending, (state) => {
        state.isLoading = true;
        state.voucherError = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.voucherList = action.payload.data || [];
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.isLoading = false;
        state.voucherList = [];
        state.voucherError = action.payload;
      })

      .addCase(applyVoucher.pending, (state) => {
        state.voucherError = null;
      })
      .addCase(applyVoucher.rejected, (state, action) => {
        state.voucherError = action.payload;
      });
  },
});

export const { resetVoucherState } = shoppingVoucherSlice.actions;

export default shoppingVoucherSlice.reducer;
