import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/reviews/addReview`,
        formData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
     return handleError(error, rejectWithValue);
    }
  }
);

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/reviews/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

const initialState = {
  isLoading: false,
  reviewsList: [],
  reviewError: null,
  reviewSuccess: null,
};

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.reviewError = null;
    },
    clearReviewSuccess: (state) => {
      state.reviewSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // addReview
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.reviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // nếu API trả về review mới, push vào mảng hiện tại
        if (action.payload?.data) {
          state.reviews = [...state.reviews, action.payload.data];
        }
        state.reviewSuccess = action.payload.message || "Đã đánh giá sản phẩm";
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.reviewError = action.payload;
      })

      // getReviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.reviewError = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload?.data || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.reviewError = action.payload;
      });
  },
});

export const { clearReviewError, clearReviewSuccess } = reviewSlice.actions;

export default reviewSlice.reducer;
