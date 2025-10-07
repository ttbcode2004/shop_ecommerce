import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getAllVouchers = createAsyncThunk(
  "adminVouchers/getAllVouchers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/vouchers/getVouchers`,
        { withCredentials: true }
      );
      
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const createVoucher = createAsyncThunk(
  "adminVouchers/createVoucher",
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/vouchers/adminVoucher`, 
        voucherData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "adminVouchers/updateVoucher",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendUrl}/api/v1/vouchers/adminVoucher/${id}`, 
        data,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
     return handleError(error, rejectWithValue);
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "adminVouchers/deleteVoucher",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/vouchers/adminVoucher/${id}`,
        { withCredentials: true }
      );

      return id;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoadingVouchers: false,
  isLoadingActions: false,

  total: 0,
  voucherList: [],
  selectedVoucher: null,

  errorVouchers: null,
  successVouchers: null,
};

// ---------------------- SLICE ----------------------
const adminVoucherSlice = createSlice({
  name: "adminVouchers",
  initialState,
  reducers: {
    clearVoucherErrors: (state) => {
      state.errorVouchers = null;
    },
    clearVoucherSuccess: (state) => {
      state.successVouchers = null;
    },
    setSelectedVoucher: (state, action) => {
      state.selectedVoucher = action.payload;
    },
    clearSelectedVoucher: (state) => {
      state.selectedVoucher = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all vouchers
      .addCase(getAllVouchers.pending, (state) => {
        state.isLoadingVouchers = true;
        state.errorVouchers = null;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
        state.isLoadingVouchers = false;
        state.voucherList = action.payload.data?.vouchers || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.isLoadingVouchers = false;
        state.voucherList = [];
        state.errorVouchers = action.payload;
      })
      // Create voucher
      .addCase(createVoucher.pending, (state) => {
        state.isLoadingActions = true;
        state.errorVouchers = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        if (action.payload?.data) state.voucherList.unshift(action.payload.data);
        state.successVouchers =  action.payload.message || "Tạo voucher thành công"
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorVouchers = action.payload;
      })
      // Update voucher
      .addCase(updateVoucher.pending, (state) => {
        state.isLoadingActions = true;
        state.errorVouchers = null;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        const index = state.voucherList.findIndex(v => v._id === action.payload.data._id);
        if (index !== -1) state.voucherList[index] = action.payload.data;
        state.successVouchers =  action.payload.message || "Cập nhật voucher thhàn công"
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorVouchers = action.payload;
      })
      // Delete voucher
      .addCase(deleteVoucher.pending, (state) => {
        state.isLoadingActions = true;
        state.errorVouchers = null;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        state.voucherList = state.voucherList.filter(v => v._id !== action.payload);
        state.successVouchers =  action.payload.message || "Xóa voucher thành công"
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorVouchers = action.payload;
      });
  },
});

export const { clearVoucherErrors, clearVoucherSuccess, setSelectedVoucher, clearSelectedVoucher } = adminVoucherSlice.actions;
export default adminVoucherSlice.reducer;
