import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const addProduct = createAsyncThunk(
  "adminProducts/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/products/admin/addProduct`,
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, 
        }
      );
      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "adminProducts/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/products/admin/getAllProducts`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/products/admin/${id}`,
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" } 
        }
      );
      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const updateFlashsaleProducts = createAsyncThunk(
  "adminProducts/updateFlashsaleProducts",
  async ({ productIds, flashSaleData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/products/admin/updateFlashsaleProducts`,
        { productIds, flashSaleData },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/v1/products/admin/${id}`,
        { withCredentials: true }
      );

      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

export const blockProduct = createAsyncThunk(
  "adminProducts/blockProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/products/admin/${id}`,
        {},
        { withCredentials: true }
      );

      return response.data;
    } catch (err) {
      return handleError(err, rejectWithValue);
    }
  }
);

const initialState = {
  isLoadingProducts: false,
  isLoadingActionProduct: false,

  productList: [],
  sidebarOpen: false,

  errorProducts: null,
  successActionProduct: null,
};

// ---------------------- SLICE ----------------------
const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    updateSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    clearProductErrors: (state) => {
      state.errorProducts = null;

    },
    clearProductSuccess: (state) => {
      state.successActionProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL PRODUCTS
      .addCase(getAllProducts.pending, (state) => {
        state.isLoadingProducts = true;
        state.errorProducts = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.productList = action.payload.data;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoadingProducts = false;
        state.productList = [];
        state.errorProducts = action.payload;
      })

      // ADD PRODUCT
      .addCase(addProduct.pending, (state) => {
        state.isLoadingActionProduct = true;
        state.errorProducts = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoadingActionProduct = false;
        if (action.payload?.data){
          state.productList = [action.payload.data, ...state.productList];
          state.successActionProduct =  action.payload.message || "Đã thêm sản phẩm thành công"
        }
          
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoadingActionProduct = false;
        state.errorProducts = action.payload;
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.isLoadingActionProduct = true;
        state.errorProducts = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoadingActionProduct = false;
        const updated = action.payload.data;
        state.productList = state.productList.map((p) =>
          p._id === updated._id ? updated : p
        );
        state.successActionProduct =  action.payload.message || "Cập nhật sản phẩm thành công"
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoadingActionProduct = false;
        state.errorProducts = action.payload;
      })

      // UPDATE FLASHSALE
      .addCase(updateFlashsaleProducts.pending, (state) => {
        state.isLoadingActionProduct = true;
        state.errorProducts = null;
      })
      .addCase(updateFlashsaleProducts.fulfilled, (state, action) => {
        state.isLoadingActionProduct = false;
        state.productList = action.payload.data?.products || state.productList;
        state.successActionProduct =  action.payload.message || "Cập nhật flashsale thành công"
      })
      .addCase(updateFlashsaleProducts.rejected, (state, action) => {
        state.isLoadingActionProduct = false;
        state.errorProducts = action.payload;
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.isLoadingActionProduct = true;
        state.errorProducts = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoadingActionProduct = false;
        state.successActionProduct =  action.payload.message || "Xóa sản phẩm thành công"
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoadingActionProduct = false;
        state.errorProducts = action.payload;
      })

      // BLOCK PRODUCT
      .addCase(blockProduct.pending, (state) => {
        state.isLoadingActionProduct = true;
        state.errorProducts = null;
      })
      .addCase(blockProduct.fulfilled, (state, action) => {
        state.successActionProduct =  action.payload.message || "Xóa sản phẩm thành công"
        const product = action.payload.data;
        state.productList = state.productList.map((p) =>
          p._id === product._id ? product : p
        );
        state.isLoadingActionProduct = false;
      })
      .addCase(blockProduct.rejected, (state, action) => {
        state.isLoadingActionProduct = false;
        state.errorProducts = action.payload;
      });
  },
});

export const { updateSidebarOpen, clearProductErrors, clearProductSuccess } =
  AdminProductsSlice.actions;
export default AdminProductsSlice.reducer;
