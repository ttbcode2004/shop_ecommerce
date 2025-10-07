import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ---------------------- HANDLE ERROR ----------------------
const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

// ---------------------- UTILS ----------------------
const getDateRange = (dateRange) => {
  let finalYear = "";
  let finalMonth = "";
  let finalDay = "";
  let finalDate = "";

  if (dateRange.currentSelect === "select") {
    finalYear = dateRange.year;
    finalMonth = dateRange.month;
    finalDay = dateRange.day;
  } else if (dateRange.currentSelect === "inputDate") {
    let parts;
    if (dateRange.date.includes("-")) {
      parts = dateRange.date.split("-");
    } else if (dateRange.date.includes("/")) {
      parts = dateRange.date.split("/");
    }
    const [day, month, year] = parts;
    finalDate = `${year}-${month}-${day}`;
  }

  return { finalYear, finalMonth, finalDay, finalDate };
};

// ---------------------- THUNKS ----------------------
export const getOverview = createAsyncThunk(
  "/dashboard/getOverview",
  async ({ dateRange } = {}, { rejectWithValue }) => {
    try {
      const { finalYear, finalMonth, finalDay, finalDate } =
        getDateRange(dateRange);
      const params = new URLSearchParams();
      if (finalYear) params.append("year", finalYear);
      if (finalMonth) params.append("month", finalMonth);
      if (finalDay) params.append("day", finalDay);
      if (finalDate) params.append("date", finalDate);

      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/overview?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getOrdersOverview = createAsyncThunk(
  "/dashboard/getOrdersOverview",
  async ({ dateRange } = {}, { rejectWithValue }) => {
    try {
      const { finalYear, finalMonth, finalDay, finalDate } =
        getDateRange(dateRange);
      const params = new URLSearchParams();
      if (finalYear) params.append("year", finalYear);
      if (finalMonth) params.append("month", finalMonth);
      if (finalDay) params.append("day", finalDay);
      if (finalDate) params.append("date", finalDate);

      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/ordersOverview?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getProductsOverview = createAsyncThunk(
  "/dashboard/getProductsOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/productsOverview`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getProductsData = createAsyncThunk(
  "/dashboard/getProductsData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/productsData`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getTopSellingProducts = createAsyncThunk(
  "/dashboard/getTopSellingProducts",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/topSellingProducts?limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getUsersOverview = createAsyncThunk(
  "/dashboard/getUsersOverview",
  async ({ dateRange } = {}, { rejectWithValue }) => {
    try {
      const { finalYear, finalMonth, finalDay, finalDate } =
        getDateRange(dateRange);
      const params = new URLSearchParams();
      if (finalYear) params.append("year", finalYear);
      if (finalMonth) params.append("month", finalMonth);
      if (finalDay) params.append("day", finalDay);
      if (finalDate) params.append("date", finalDate);

      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/usersOverview?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getNewUsersByMonth = createAsyncThunk(
  "/dashboard/getNewUsersByMonth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/newUsersByMonth`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getTopUsers = createAsyncThunk(
  "/dashboard/getTopUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/dashboard/topUsers`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getReviewsOverview = createAsyncThunk(
  "/dashboard/getReviewsOverview",
  async ({ dateRange } = {}, { rejectWithValue }) => {
    try {
      const { finalYear, finalMonth, finalDay, finalDate } =
        getDateRange(dateRange);
      const params = new URLSearchParams();
      if (finalYear) params.append("year", finalYear);
      if (finalMonth) params.append("month", finalMonth);
      if (finalDay) params.append("day", finalDay);
      if (finalDate) params.append("date", finalDate);

      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/reviewsOverview?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getVouchersOverview = createAsyncThunk(
  "/dashboard/getVouchersOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/vouchersOverview`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getRevenueByMonth = createAsyncThunk(
  "/dashboard/getRevenueByMonth",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/revenueByMonth?year=${year}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getOrdersRevenueByMonth = createAsyncThunk(
  "/dashboard/getOrdersRevenueByMonth",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/ordersRevenueByMonth?year=${year}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getFullReport = createAsyncThunk(
  "/dashboard/getFullReport",
  async ({ dateRange } = {}, { rejectWithValue }) => {
    try {
      const { finalYear, finalMonth, finalDay, finalDate } =
        getDateRange(dateRange);
      const params = new URLSearchParams();
      if (finalYear) params.append("year", finalYear);
      if (finalMonth) params.append("month", finalMonth);
      if (finalDay) params.append("day", finalDay);
      if (finalDate) params.append("date", finalDate);

      const response = await axios.get(
        `${backendUrl}/api/v1/dashboard/getFullReport?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);


const initialState = {
  // Loading states
  isLoadingOverview: false,
  isLoadingOrdersOverview: false,
  isLoadingProductsOverview: false,
  isLoadingUsersOverview: false,
  isLoadingReviewsOverview: false,
  isLoadingVouchersOverview: false,
  isLoadingFullReport: false,

  // Error states
  dashboardError: null,

  // Data
  overview: [],
  ordersOverview: [],
  productsOverview: [],
  productsData: [],
  topSellingproducts: [],
  usersOverview: [],
  newUsersByMonth: [],
  topUsers: [],
  reviewsOverview: [],
  vouchersOverview: [],
  revenueByMonth: [],
  ordersRevenueByMonth: [],
  fullReport: [],
};

// ---------------------- SLICE ----------------------
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.dashboardError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(getOverview.pending, (state) => {
        state.isLoadingOverview = true;
        state.dashboardError = null;
      })
      .addCase(getOverview.fulfilled, (state, action) => {
        state.isLoadingOverview = false;
        state.overview = action.payload;
      })
      .addCase(getOverview.rejected, (state, action) => {
        state.isLoadingOverview = false;
        state.dashboardError = action.payload;
      })
      .addCase(getRevenueByMonth.fulfilled, (state, action) => {
        state.isLoadingOverview = false;
        state.revenueByMonth = action.payload.revenueData;
      })
      .addCase(getRevenueByMonth.rejected, (state, action) => {
        state.isLoadingOverview = false;
        state.dashboardError = action.payload;
      })

      // Orders
      .addCase(getOrdersOverview.pending, (state) => {
        state.isLoadingOrdersOverview = true;
        state.dashboardError = null;
      })
      .addCase(getOrdersOverview.fulfilled, (state, action) => {
        state.isLoadingOrdersOverview = false;
        state.ordersOverview = action.payload;
      })
      .addCase(getOrdersOverview.rejected, (state, action) => {
        state.isLoadingOrdersOverview = false;
        state.dashboardError = action.payload;
      })
      .addCase(getOrdersRevenueByMonth.fulfilled, (state, action) => {
        state.isLoadingOrdersOverview = false;
        state.ordersRevenueByMonth = action.payload.revenueData;
      })
      .addCase(getOrdersRevenueByMonth.rejected, (state, action) => {
        state.isLoadingOrdersOverview = false;
        state.dashboardError = action.payload;
      })

      // Products
      .addCase(getProductsOverview.pending, (state) => {
        state.isLoadingProductsOverview = true;
        state.dashboardError = null;
      })
      .addCase(getProductsOverview.fulfilled, (state, action) => {
        state.isLoadingProductsOverview = false;
        state.productsOverview = action.payload;
      })
      .addCase(getProductsOverview.rejected, (state, action) => {
        state.isLoadingProductsOverview = false;
        state.dashboardError = action.payload;
      })
      .addCase(getProductsData.fulfilled, (state, action) => {
        state.isLoadingProductsOverview = false;
        state.productsData = action.payload;
      })
      .addCase(getTopSellingProducts.fulfilled, (state, action) => {
        state.isLoadingProductsOverview = false;
        state.topSellingproducts = action.payload;
      })

      // Users
      .addCase(getUsersOverview.pending, (state) => {
        state.isLoadingUsersOverview = true;
        state.dashboardError = null;
      })
      .addCase(getUsersOverview.fulfilled, (state, action) => {
        state.isLoadingUsersOverview = false;
        state.usersOverview = action.payload;
      })
      .addCase(getUsersOverview.rejected, (state, action) => {
        state.isLoadingUsersOverview = false;
        state.dashboardError = action.payload;
      })
      .addCase(getNewUsersByMonth.fulfilled, (state, action) => {
        state.isLoadingUsersOverview = false;
        state.newUsersByMonth = action.payload;
      })
      .addCase(getTopUsers.fulfilled, (state, action) => {
        state.isLoadingUsersOverview = false;
        state.topUsers = action.payload;
      })

      // Reviews
      .addCase(getReviewsOverview.pending, (state) => {
        state.isLoadingReviewsOverview = true;
        state.dashboardError = null;
      })
      .addCase(getReviewsOverview.fulfilled, (state, action) => {
        state.isLoadingReviewsOverview = false;
        state.reviewsOverview = action.payload;
      })
      .addCase(getReviewsOverview.rejected, (state, action) => {
        state.isLoadingReviewsOverview = false;
        state.dashboardError = action.payload;
      })

      // Vouchers
      .addCase(getVouchersOverview.pending, (state) => {
        state.isLoadingVouchersOverview = true;
        state.dashboardError = null;
      })
      .addCase(getVouchersOverview.fulfilled, (state, action) => {
        state.isLoadingVouchersOverview = false;
        state.vouchersOverview = action.payload;
      })
      .addCase(getVouchersOverview.rejected, (state, action) => {
        state.isLoadingVouchersOverview = false;
        state.dashboardError = action.payload;
      })

      // Full Report
      .addCase(getFullReport.pending, (state) => {
        state.isLoadingFullReport = true;
        state.dashboardError = null;
      })
      .addCase(getFullReport.fulfilled, (state, action) => {
        state.isLoadingFullReport = false;
        state.fullReport = action.payload;
      })
      .addCase(getFullReport.rejected, (state, action) => {
        state.isLoadingFullReport = false;
        state.dashboardError = action.payload;
      });
  },
});

export const { clearDashboardErrors } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
