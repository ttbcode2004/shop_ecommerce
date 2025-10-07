import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const addNewAddress = createAsyncThunk(
  "addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/address`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;

    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getAllAddresses = createAsyncThunk(
  "addresses/getAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/address`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const editAddress = createAsyncThunk(
  "addresses/editAddress",
  async ({ index, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/address/${index}`,
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateDefaultAddress = createAsyncThunk(
  "addresses/updateDefaultAddress",
  async ({ index }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/address/${index}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async ({index }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/address/${index}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ---------------------- SLICE ----------------------
const initialState = {
  addressList: [],

  isLoading: false,

  addressError: null,
  addressSuccess: null,

};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.addressError = null;
    },
    clearAddressSuccess: (state) => {
      state.addressSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addNewAddress
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.addressError = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data.addresses || [];
        state.addressSuccess = action.payload.message || "Thêm địa chỉ thành công!";
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.addressError = action.payload;
      })

      // getAllAddresses
      .addCase(getAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.addressError = null;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data.addresses || [];
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.addressList = [];
        state.addressError = action.payload;
      })

      // editAddress
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        state.addressError = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data.addresses || [];
        state.addressSuccess = action.payload.message || "Cập nhật địa chỉ thành công!";
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.addressError = action.payload;
      })

      // updateDefaultAddress
      .addCase(updateDefaultAddress.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(updateDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data.addresses || [];
        state.addressSuccess = action.payload.message || "Đặt địa chỉ mặc định thành công!";
      })
      .addCase(updateDefaultAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload;
      })

      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.addressError = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data.addresses || [];
        state.addressSuccess = action.payload.message || "Xóa địa chỉ thành công!";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.addressError = action.payload;
      });
  },
});

export const { clearAddressError, clearAddressSuccess, } = addressSlice.actions;
export default addressSlice.reducer;
