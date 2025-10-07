import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getAllSubOrders = createAsyncThunk(
  "adminSubOrders/getAllSubOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/subOrders/admin/getAllSubOrders`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateSubOrderStatus = createAsyncThunk(
  "adminSubOrders/updateSubOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/subOrders/admin/upadteStatus/${orderId}`,
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
  isLoadingSubOrders: false,
  isUpdatingSubOrder: false,

  subOrderList: [],

  errorSubOrders: null,
};

// ---------------------- SLICE ----------------------
const adminSubOrderSlice = createSlice({
  name: "adminSubOrders",
  initialState,
  reducers: {
    clearSubOrderErrors: (state) => {
      state.errorSubOrders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL SUBORDERS
      .addCase(getAllSubOrders.pending, (state) => {
        state.isLoadingSubOrders = true;
        state.errorSubOrders = null;
      })
      .addCase(getAllSubOrders.fulfilled, (state, action) => {
        state.isLoadingSubOrders = false;
        state.subOrderList = action.payload.data.subOrders;
      })
      .addCase(getAllSubOrders.rejected, (state, action) => {
        state.isLoadingSubOrders = false;
        state.subOrderList = [];
        state.errorSubOrders = action.payload;
      })

      // UPDATE SUBORDER STATUS
      .addCase(updateSubOrderStatus.pending, (state) => {
        state.isUpdatingSubOrder = true;
        state.errorSubOrders = null;
      })
      .addCase(updateSubOrderStatus.fulfilled, (state, action) => {
        state.isUpdatingSubOrder = false;
        const updatedSubOrder = action.payload.data.subOrder;
        const index = state.subOrderList.findIndex(o => o._id === updatedSubOrder._id);
        if (index !== -1) state.subOrderList[index].status = updatedSubOrder.status;
      })
      .addCase(updateSubOrderStatus.rejected, (state, action) => {
        state.isUpdatingSubOrder = false;
        state.errorSubOrders = action.payload;
      });
  },
});

export const { clearSubOrderErrors } = adminSubOrderSlice.actions;
export default adminSubOrderSlice.reducer;
