import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const createNewOrder = createAsyncThunk(
  "orders/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/orders/user`, 
        orderData,
        { withCredentials: true }
      );

      if (response.data.success && response.data.data?.payUrl) {
        window.location.href = response.data.data.payUrl;
      }

      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updatePayment = createAsyncThunk(
  "orders/updatePayment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/orders/updatePayment/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "orders/getAllOrdersByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/orders/user`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateOrderState = createAsyncThunk(
  "orders/updateOrderState",
  async ({ orderId, state }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/orders/userUpdate/${orderId}`,
        { state },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateOrderReview = createAsyncThunk(
  "orders/updateOrderReview",
  async ({ orderId, idxProduct }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/orders/userReview/${orderId}`,
        { idxProduct },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateOrderReturn = createAsyncThunk(
  "orders/updateOrderReturn",
  async ({ orderId, itemId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/orders/userReturn/${orderId}/${itemId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  orderList: [],

  // loading
  isLoading: false,

  // error
  orderError: null,
  orderSuccess: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
     clearOrderError: (state) => {
      state.orderError = null;
    },
    clearOrderSuccess: (state) => {
      state.orderSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createNewOrder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.orderError = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderSuccess = action.payload?.message || "Tạo đơn hàng thành công!";
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderError = action.payload;
      })

      // getAllOrdersByUserId
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.orderError = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data.orders;
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.orderError = action.payload;
      })

      // updateOrderState
      .addCase(updateOrderState.pending, (state) => {
        state.isLoading = true;
        state.orderError = null;
      })
      .addCase(updateOrderState.fulfilled, (state, action) => {
        state.isLoading = false;
        const order = action.payload.data.order;
        state.orderList = state.orderList.map((o) => (o._id === order._id ? order : o));
        state.orderSuccess = action.payload?.message || "Cập nhật trạng thái đơn hàng thành công!";
      })
      .addCase(updateOrderState.rejected, (state, action) => {
        state.isLoading = false;
        state.orderError = action.payload;
      })

      // updateOrderReview
      .addCase(updateOrderReview.pending, (state) => {
        state.isLoading= true;
        state.orderError = null;
      })
      .addCase(updateOrderReview.fulfilled, (state, action) => {
        state.isLoading= false;
        const order = action.payload.data.order;
        state.orderList = state.orderList.map((o) => (o._id === order?._id ? order : o));
        state.orderSuccess = action.payload?.message || "Đánh giá sản phẩm thành công!";
      })
      .addCase(updateOrderReview.rejected, (state, action) => {
        state.isLoading= false;
        state.orderError = action.payload;
      })

      // updateOrderReturn
      .addCase(updateOrderReturn.pending, (state) => {
        state.isLoading= true;
        state.orderError = null;
      })
      .addCase(updateOrderReturn.fulfilled, (state, action) => {
        state.isLoading= false;
        const order = action.payload.data.order;
        state.orderList = state.orderList.map((o) => (o._id === order._id ? order : o));
        state.orderSuccess = action.payload?.message || "Trả sản phẩm thành công!";
      })
      .addCase(updateOrderReturn.rejected, (state, action) => {
        state.isLoading= false;
        state.orderError = action.payload;
      })

      // updatePayment
      .addCase(updatePayment.pending, (state) => {
        state.isLoading = true;
        state.orderError = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data.order;
        const idx = state.orderList.findIndex((o) => o._id === updatedOrder._id);
        if (idx !== -1) state.orderList[idx] = updatedOrder;
        state.orderSuccess = action.payload.message || "Cập nhật thanh toán thành công!";
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.orderError = action.payload;
      });
  },
});

export const { clearOrderError, clearOrderSuccess, } = orderSlice.actions;
export default orderSlice.reducer;
