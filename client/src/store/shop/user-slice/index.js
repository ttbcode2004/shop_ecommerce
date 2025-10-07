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
  "users/getMe",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/getMe/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updatePhotoMe = createAsyncThunk(
  "users/updatePhotoMe",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/users/updatePhoto`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
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

export const updateUserPassword = createAsyncThunk(
  "users/updateUserPassword",
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
  userData: null,

  isLoading: false,
  isLoadingAction: false,

  // error states
  userError: null,
  userSuccess: null,
};

const shoppingUserSlice = createSlice({
  name: "shoppingUser",
  initialState,
  reducers: {
     clearUserError: (state) => {
      state.userError = null;
    },
    clearUserSuccess: (state) => {
      state.userSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMe
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data?.user;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.userData = null;
        state.userError = action.payload;
      })

      // updatePhotoMe
      .addCase(updatePhotoMe.pending, (state) => {
        state.isLoadingAction = true;
        state.userError = null;
      })
      .addCase(updatePhotoMe.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.userData = action.payload.data?.user;
        state.userSuccess = action.payload.message || "Photo updated successfully";
      })
      .addCase(updatePhotoMe.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.userError = action.payload;
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoadingAction = true;
        state.userError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.userData = action.payload.data?.user;
        state.userSuccess = action.payload.message || "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.userError = action.payload;
      })

      // updateUserPassword
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoadingAction = true;
        state.userError = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        state.userData = action.payload.user;
        state.userSuccess = action.payload.message || "Password updated successfully";
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.userError = action.payload;
      });
  },
});

export const { clearUserError, clearUserSuccess } = shoppingUserSlice.actions;

export default shoppingUserSlice.reducer;
