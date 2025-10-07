import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 12,
        sort = "-createdAt",
        category,
        people,
        minPrice,
        maxPrice,
        rating,
        flashSale,
        search,
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      queryParams.append("sort", sort);

      if (category) queryParams.append("category", category);
      if (people) queryParams.append("people", people);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (rating) queryParams.append("rating", rating);
      if (flashSale) queryParams.append("flashSale", flashSale);
      if (search) queryParams.append("search", search);

      const response = await axios.get(
        `${API_URL}/api/v1/products?${queryParams}`
      );

      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getFlashSaleProducts = createAsyncThunk(
  "products/getFlashSaleProducts",
  async ({ limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/flashsale?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getShirtProducts = createAsyncThunk(
  "products/getShirtProducts",
  async ({ limit = 10, sort = "-sold" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/getProductsByCategory/ao?limit=${limit}&sort=${sort}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getPantProducts = createAsyncThunk(
  "products/getPantProducts",
  async ({ limit = 10, sort = "-sold" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/getProductsByCategory/quan?limit=${limit}&sort=${sort}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/getFeatured?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  "products/getProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/getProductBySlug/${slug}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  "products/getRelatedProducts",
  async ({ slug, limit =  4}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/getRelatedProducts/${slug}/${limit}`
      );
      
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const fetchCategoriesWithCounts = createAsyncThunk(
  "products/fetchCategoriesWithCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/categories/counts`
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ---------------------- SLICE ----------------------
const initialState = {
  products: [],
  flashSaleProducts: [],
  shirtProducts: [],
  pantProducts: [],
  productDetails: null,
  featuredProducts: [],
  relatedProducts: [],
  categories: [],
  categoryInfo: null,

  currentPage: 1,
  totalPages: 1,
  total: 0,

  filters: {
    category: [],
    people: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    bestSeller: false,
    flashSale: false,
    search: "",
    sort: "-createdAt",
  },

  isLoading: false,
  flashSaleLoading: false,
  shirtsLoading: false,
  pantLoading: false,
  featuredLoading: false,
  productDetailsLoading: false,
  relatedLoading: false,
  categoriesLoading: false,

  productError: null,
};

const productSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        search: state.filters.search || "",
      };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentPage: (state) => {
      state.currentPage = 1;
      state.totalPages = 1;
      state.total = 0;
    },
    clearCurrentProduct: (state) => {
      state.productError = null;
    },
    clearProductError: (state) => {
      state.productError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllProducts
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.productError = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productError = action.payload;
      })

      // getFlashSaleProducts
      .addCase(getFlashSaleProducts.pending, (state) => {
        state.flashSaleLoading = true;
        state.productError = null;
      })
      .addCase(getFlashSaleProducts.fulfilled, (state, action) => {
        state.flashSaleLoading = false;
        state.flashSaleProducts = action.payload.data;
      })
      .addCase(getFlashSaleProducts.rejected, (state, action) => {
        state.flashSaleLoading = false;
        state.productError = action.payload;
      })

      // getShirtProducts
      .addCase(getShirtProducts.pending, (state) => {
        state.shirtsLoading = true;
        state.productError = null;
      })
      .addCase(getShirtProducts.fulfilled, (state, action) => {
        state.shirtsLoading = false;
        state.shirtProducts = action.payload.data;
      })
      .addCase(getShirtProducts.rejected, (state, action) => {
        state.shirtsLoading = false;
        state.productError = action.payload;
      })

      // getPantProducts
      .addCase(getPantProducts.pending, (state) => {
        state.pantLoading = true;
        state.productError = null;
      })
      .addCase(getPantProducts.fulfilled, (state, action) => {
        state.pantLoading = false;
        state.pantProducts = action.payload.data;
      })
      .addCase(getPantProducts.rejected, (state, action) => {
        state.pantLoading = false;
        state.productError = action.payload;
      })

      // getFeaturedProducts
      .addCase(getFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.productError = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload.data;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.productError = action.payload;
      })

      // getProductBySlug
      .addCase(getProductBySlug.pending, (state) => {
        state.productDetailsLoading = true;
        state.productError = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.productDetailsLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.productDetailsLoading = false;
        state.productError = action.payload;
      })

      // fetchRelatedProducts
      .addCase(getRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
        state.productError= null;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedProducts = action.payload.data;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;
        state.productError= action.payload;
      })

      // fetchCategoriesWithCounts
      .addCase(fetchCategoriesWithCounts.pending, (state) => {
        state.categoriesLoading = true;
        state.productError = null;
      })
      .addCase(fetchCategoriesWithCounts.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data.categories;
      })
      .addCase(fetchCategoriesWithCounts.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.productError = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentProduct,
  clearProductError,
  clearCurrentPage,
} = productSlice.actions;

export default productSlice.reducer;
