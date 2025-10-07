import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getAllOrders = createAsyncThunk(
  "/order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/orders/admin/getAllOrders`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/orders/admin/upadteStatus/${orderId}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoadingOrders: false,
  isUpdatingOrder: false,

  orderList: [],
  orderDetails: null,

  errorOrders: null,
};

// ---------------------- SLICE ----------------------
const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.errorOrders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.errorOrders = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orderList = action.payload.data.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.orderList = [];
        state.errorOrders = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdatingOrder = true;
        state.errorOrders = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdatingOrder = false;
        const updatedOrder = action.payload.data.order;
        const idx = state.orderList.findIndex(o => o._id === updatedOrder._id);
        if (idx !== -1) state.orderList[idx] = updatedOrder;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdatingOrder = false;
        state.errorOrders = action.payload;
      });
  },
});

export const {clearOrderErrors } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
