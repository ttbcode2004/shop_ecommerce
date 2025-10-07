import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/wishlists/getWishlist`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const addWishlist = createAsyncThunk(
  "wishlist/addWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/wishlists/addWishlist`,
        { productId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  "wishlist/deleteWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/wishlists/deleteWishlist/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const clearWishlistUser = createAsyncThunk(
  "wishlist/clearWishlistUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/wishlists/clearWishlist`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// =================== LOCAL STORAGE HELPERS ===================
const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem("localWishlist", JSON.stringify(items));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
};

const loadFromLocalStorage = () => {
  try {
    const items = localStorage.getItem("localWishlist");
    return items ? JSON.parse(items) : [];
  } catch (err) {
    console.error("Error loading from localStorage:", err);
    return [];
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem("localWishlist");
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
};

const initialState = {
  wishlistItems: [],
  localWishlistItems: loadFromLocalStorage(),
  numberWishlist: loadFromLocalStorage().length,

  // loading
  loadingWishlist: false,

  wishlistSuccess: null,
  wishlistWarn: null,
  wishlistError: null,
};


// =================== SLICE ===================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ===== LOCAL ACTIONS =====
    addToLocalWishlist: (state, action) => {
      const newItem = action.payload;
      const existing = state.localWishlistItems.find(
        (item) => item.productId === newItem.productId
      );

      if (!existing) {
        state.localWishlistItems = [newItem, ...state.localWishlistItems];
        state.numberWishlist = state.localWishlistItems.length;
        saveToLocalStorage(state.localWishlistItems);
        state.wishlistSuccess = "Đã thêm vào yêu thích";
      } else {
        wishlistWarn = "Sản phẩm đã có trong yêu thích"
      }
    },

    removeFromLocalWishlist: (state, action) => {
      const { productId } = action.payload;
      const initialLength = state.localWishlistItems.length;

      state.localWishlistItems = state.localWishlistItems.filter(
        (item) => item.productId !== productId
      );

      if (state.localWishlistItems.length < initialLength) {
        state.numberWishlist = state.localWishlistItems.length;
        saveToLocalStorage(state.localWishlistItems);
        state.wishlistSuccess = "Đã xoá khỏi yêu thích";
      } else {
        state.wishlistError = "Không tìm thấy sản phẩm trong yêu thích";
      }
    },

    clearLocalWishlist: (state) => {
      state.localWishlistItems = [];
      state.numberWishlist = 0;
      clearLocalStorage();
      state.wishlistSuccess = "Đã xoá tất cả khỏi yêu thích";
    },

    resetWishlistState: (state) => {
      state.wishlistItems = [];
      state.numberWishlist = 0;
      state.loadingWishlist = false;
    },

    clearWishlistError: (state) => {
      state.wishlistError = null;
    },
    clearWishlistSuccess: (state) => {
      state.wishlistSuccess = null;
    },
    clearWishlistWarn: (state) => {
      state.wishlistWarn = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ===== GET WISHLIST =====
      .addCase(getWishlist.pending, (state) => {
        state.loadingWishlist = true;
        state.wishlistError = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loadingWishlist = false;
        if (action.payload?.success) {
          state.wishlistItems = action.payload.data?.wishlist || [];
          state.numberWishlist = state.wishlistItems.length;
        } else {
          state.wishlistError = action.payload?.message || "Lỗi wishlist";
        }
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loadingWishlist = false;
        state.wishlistError = action.payload;
      })

      // ===== ADD WISHLIST =====
      .addCase(addWishlist.pending, (state) => {
        state.loadingWishlist = true;
        state.wishlistError = null;
      })
      .addCase(addWishlist.fulfilled, (state, action) => {
        state.loadingWishlist = false;
        if (action.payload?.success) {
          state.wishlistItems = action.payload.data?.wishlist || [];
          state.numberWishlist = state.wishlistItems.length;
          state.wishlistSuccess = action.payload.message || "Đã thêm vào yêu thích";
        } else {
          state.wishlistError = action.payload?.message || "Lỗi thêm vào wishlist";
        }
      })
      .addCase(addWishlist.rejected, (state, action) => {
        state.loadingWishlist = false;
        state.wishlistError = action.payload;
      })

      // ===== DELETE WISHLIST =====
      .addCase(deleteWishlist.pending, (state) => {
        state.loadingWishlist = true;
        state.wishlistError = null;
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.loadingWishlist = false;
        if (action.payload?.success) {
          state.wishlistItems = action.payload.data?.wishlist || [];
          state.numberWishlist = state.wishlistItems.length;
          state.wishlistSuccess = action.payload.message || "Đã xoá khỏi yêu thích";
        } else {
          state.wishlistError = action.payload?.message || "Lỗi xóa sản phẩm wishlist";
        }
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.loadingWishlist = false;
        state.wishlistError = action.payload;
      })

      // ===== CLEAR WISHLIST =====
      .addCase(clearWishlistUser.pending, (state) => {
        state.loadingWishlist = true;
        state.wishlistError = null;
      })
      .addCase(clearWishlistUser.fulfilled, (state, action) => {
        state.loadingWishlist = false;
        if (action.payload?.success) {
          state.wishlistItems = action.payload.data?.wishlist || [];
          state.numberWishlist = state.wishlistItems.length;
          state.wishlistSuccess = action.payload.message || "Đã xoá toàn bộ yêu thích";
        } else {
          state.wishlistError = action.payload?.message || "Lỗi xóa toàn bộ wishlist";
        }
      })
      .addCase(clearWishlistUser.rejected, (state, action) => {
        state.loadingWishlist = false;
        state.wishlistError = action.payload;
      });
  },
});

// =================== EXPORT ===================
export const {
  addToLocalWishlist,
  removeFromLocalWishlist,
  clearLocalWishlist,
  resetWishlistState,
  clearWishlistError,
  clearWishlistSuccess,
  clearWishlistWarn
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
