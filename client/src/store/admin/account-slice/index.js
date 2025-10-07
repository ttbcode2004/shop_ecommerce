import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getMe = createAsyncThunk(
  "admin/getMe",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/getMe/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateAccountProfile = createAsyncThunk(
  "admin/updatAdminProfile",
  async ({ name, email, phone }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/users/updateUserProfile`,
        { name, email, phone },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateAccountPassword = createAsyncThunk(
  "admin/updateAdminPassword",
  async ({ passwordCurrent, password }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/users/updateUserPassword`,
        { passwordCurrent, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  accountData: null,

  isLoading: false,
  isLoadingAction: false,

  // error states
  errorAccount: null,
  successAccount: null,
};

const adminAccountSlice = createSlice({
  name: "adminAccount",
  initialState,
  reducers: {
     clearAccountErrors: (state) => {
      state.errorAccount = null;
    },
    clearAccountSuccess: (state) => {
      state.successAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMe
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.errorAccount = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountData = action.payload.data?.user;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.accountData = null;
        state.errorAccount = action.payload;
      })

      // updateaccountProfile
      .addCase(updateAccountProfile.pending, (state) => {
        state.isLoadingAction = true;
        state.errorAccount = null;
      })
      .addCase(updateAccountProfile.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.accountData = action.payload.data?.user;
        state.successAccount = action.payload.message || "Profile updated successfully";
      })
      .addCase(updateAccountProfile.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.errorAccount = action.payload;
      })

      // updateAccountPassword
      .addCase(updateAccountPassword.pending, (state) => {
        state.isLoadingAction = true;
        state.errorAccount = null;
      })
      .addCase(updateAccountPassword.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.accountData = action.payload.user;
        state.successAccount = action.payload.message || "Password updated successfully";
      })
      .addCase(updateAccountPassword.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.errorAccount = action.payload;
      });
  },
});

export const { clearAccountErrors, clearAccountSuccess } = adminAccountSlice.actions;

export default adminAccountSlice.reducer;
