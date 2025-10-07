import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};


export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/users/admin/getAllUsers`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendUrl}/api/v1/users/admin/deleteUser/${id}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const unblockUser = createAsyncThunk(
  "adminUsers/unblockUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendUrl}/api/v1/users/admin/unblockUser/${id}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const createUser = createAsyncThunk(
  "/adminUsers/createUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/users/register`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoadingUsers: false,
  isLoadingUsersAction: false,

  userList: [],
  errorUsers: null,
  successUsers: null,
};

// ---------------------- SLICE ----------------------
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.errorUsers = null;
    },
    clearUserSuccess: (state) => {
      state.successUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.userList = action.payload.data.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.userList = [];
        state.errorUsers = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.isLoadingUsersAction = true;
        state.errorUsers = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoadingUsersAction = false;
        const user = action.payload.data.user;
        state.userList = state.userList.map(item => item._id === user._id ? {...item, isActive:user.isActive} : item);
        state.successUsers = action.payload?.message || "Chặn thành công"
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoadingUsersAction = false;
        state.userList = [];
        state.errorUsers = action.payload;
      })

      .addCase(unblockUser.pending, (state) => {
        state.isLoadingUsersAction = true;
        state.errorUsers = null;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.isLoadingUsersAction = false;
        const user = action.payload.data.user;
        state.userList = state.userList.map(item => item._id === user._id ? {...item, isActive:user.isActive} : item);
        state.successUsers = action.payload?.message || "Mở khóa thành công"
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.isLoadingUsersAction = false;
        state.userList = [];
        state.errorUsers = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.isLoadingUsersAction = true;
        state.errorUsers = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoadingUsersAction = false;
        state.successUsers = action.payload?.message || "Tạo tài khoản thành công"
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoadingUsersAction = false;
        state.errorUsers = action.payload;
      });
  },
});


export const {clearUserErrors, clearUserSuccess } = adminUserSlice.actions;
export default adminUserSlice.reducer;
