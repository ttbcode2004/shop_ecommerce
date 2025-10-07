import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const API_URL = `${backendUrl}/api/v1/delivers`;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

// Get All
export const getAllDelivers = createAsyncThunk(
  "deliver/getAllDelivers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/getAllDelivers`, { withCredentials: true });
      return res.data; // { data, message? }
      
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Create
export const createDeliver = createAsyncThunk(
  "deliver/createDeliver",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/adminDeliver`, formData, { withCredentials: true });
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Update
export const updateDeliver = createAsyncThunk(
  "deliver/updateDeliver",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/adminDeliver/${id}`, formData, { withCredentials: true });
      return res.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// Delete
export const deleteDeliver = createAsyncThunk(
  "deliver/deleteDeliver",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API_URL}/adminDeliver/${id}`, { withCredentials: true });
      return { id, message: res.data?.message };
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoadingDelivers: false,
  isLoadingActions: false,
  total: 0,
  deliverList: [],

  errorDelivers: null,
  successDelivers: null,
};

const deliverSlice = createSlice({
  name: "deliver",
  initialState,
  reducers: {
    clearDeliverErrors: (state) => {
      state.errorDelivers = null;
    },
    clearDeliverSuccess: (state) => {
      state.successDelivers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllDelivers
      .addCase(getAllDelivers.pending, (state) => {
        state.isLoadingDelivers = true;
      })
      .addCase(getAllDelivers.fulfilled, (state, action) => {
        state.isLoadingDelivers = false;
        state.deliverList = action.payload.data?.delivers || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(getAllDelivers.rejected, (state, action) => {
        state.isLoadingDelivers = false;
        state.errorDelivers = action.payload;
      })

      // createDeliver
      .addCase(createDeliver.pending, (state) => {
        state.isLoadingActions = true;
        state.errorDelivers = null;
      })
      .addCase(createDeliver.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        if (action.payload?.data) state.deliverList.unshift(action.payload.data);
        state.successDelivers = action.payload?.message || "Tạo phí vận chuyển thành công";
      })
      .addCase(createDeliver.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorDelivers = action.payload;
      })

      // updateDeliver
      .addCase(updateDeliver.pending, (state) => {
        state.isLoadingActions = true;
        state.errorDelivers = null;
      })
      .addCase(updateDeliver.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        const idx = state.deliverList.findIndex((v) => v._id === action.payload.data._id);
        if (idx !== -1) state.deliverList[idx] = action.payload.data;
        state.successDelivers = action.payload.message || "Cập nhật phí vận chuyển thành công";
      })
      .addCase(updateDeliver.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorDelivers = action.payload;
      })

      // deleteDeliver
      .addCase(deleteDeliver.pending, (state) => {
        state.isLoadingActions = true;
        state.errorDelivers = null;
      })
      .addCase(deleteDeliver.fulfilled, (state, action) => {
        state.isLoadingActions = false;
        state.deliverList = state.deliverList.filter((v) => v._id !== action.payload.id);
        state.successDelivers = action.payload.message || "Xóa phí vận chuyển thành công";
      })
      .addCase(deleteDeliver.rejected, (state, action) => {
        state.isLoadingActions = false;
        state.errorDelivers = action.payload;
      });
  },
});

export const { clearDeliverErrors, clearDeliverSuccess } = deliverSlice.actions;
export default deliverSlice.reducer;
