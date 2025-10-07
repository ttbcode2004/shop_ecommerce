import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleError = (error, rejectWithValue) => {
  if (error.response) {
    return rejectWithValue(error.response.data?.message || "Server Error");
  }
  return rejectWithValue(error.message || "Network Error");
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, size, color, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/carts/userCart`,
        { productId, size, color, quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async ( _, {rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/carts/userCart`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getCartNotUser = createAsyncThunk(
  "cart/getCartNotUser",
  async ({ items }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/carts/getCartNotUser`, { items });
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/carts/clear`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ cartId, productId, size, color, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/v1/carts/userCart`,
        { cartId, productId, size, color, quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/carts/userDeleteCart/${cartId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

// ---------------------- SLICE ----------------------
const initialState = {
  cartItems: [],
  cartItemsNotUser: [],
  cartToOrderList: [],
  localCartItems: [],
  number: 0,

  // isLoading
  isLoading: false,

  cartError: null,
  cartSuccess: null,
  cartWarn: null,
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    cartToOrder: (state, action) => {
      state.cartToOrderList = action.payload;
    },
    clearCartToOrder: (state) => {
      state.cartToOrderList = [];
    },

    // ===== Local Cart reducers =====
    setLocalCart: (state, action) => {
      state.localCartItems = action.payload;
      state.number = action.payload.reduce((sum, item) => sum + item.quantity, 0);
    },

    addLocalCartItem: (state, action) => {
      const newItem = action.payload;
      const existing = state.localCartItems.find(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existing) {
        const totalQuantity = existing.quantity + newItem.quantity;
        existing.quantity = totalQuantity > newItem.stock ? newItem.stock : totalQuantity;
      } else {
        state.localCartItems.unshift(newItem);
      }

      state.number = state.localCartItems.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("pendingCartItems", JSON.stringify(state.localCartItems));
      state.cartSuccess = "Đã thêm vào giỏ hàng - chưa đăng nhập"
    },

    updateLocalCartItem: (state, action) => {
      const { productId, size, color, quantity, sizes, oldSize, oldColor } =
        action.payload;

      const sizeObj = sizes?.find((s) => s.size === size);
      if (!sizeObj) {
        state.cartWarn = `Size ${size} đã hết`;
        return;
      }
      const colorObj = sizeObj.colors?.find((c) => c.color === color);
      if (!colorObj) {
        state.cartWarn = `Size ${size} đã hết màu đã chọn`;
        return;
      }

      let finalQuantity = quantity > colorObj.quantity ? colorObj.quantity : quantity;

      if (oldSize && oldColor) {
        state.localCartItems = state.localCartItems.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.size === oldSize &&
              item.color === oldColor
            )
        );
      }

      const existing = state.localCartItems.find(
        (item) =>
          item.productId === productId && item.size === size && item.color === color
      );

      if (existing) {
        existing.quantity = finalQuantity;
      } else {
        state.localCartItems.unshift({ productId, size, color, quantity: finalQuantity });
      }

      state.number = state.localCartItems.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("pendingCartItems", JSON.stringify(state.localCartItems));
      state.cartSuccess ="Cập nhật thành công";
    },

    deleteLocalCartItem: (state, action) => {
      const { productId, size, color, toast = true } = action.payload;
      state.localCartItems = state.localCartItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          )
      );
      state.number = state.localCartItems.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("pendingCartItems", JSON.stringify(state.localCartItems));
      if(toast){
        state.cartSuccess = "Xóa sản phẩm thành công";
      }
    },

    clearLocalCart: (state) => {
      state.localCartItems = [];
      state.number = 0;
      localStorage.removeItem("pendingCartItems");
      state.cartSuccess = "Xóa toàn bộ sản phẩm thành công";
    },

    resetCartNumber: (state) => {
      state.number = state.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    },

    clearCartError: (state) => {
      state.cartError = null;
    },
    clearCartSuccess: (state) => {
      state.cartSuccess = null;
    },
    clearCartWarn: (state) => {
      state.cartWarn = null;
    },
  },
  extraReducers: (builder) => {
    const updateNumber = (cartItems) =>
      cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // addToCart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.cartError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.cart) {
          state.cartItems = action.payload.data.cart;
          state.number = updateNumber(state.cartItems);
          state.cartSuccess = action.payload?.message || "Thêm vào giỏ hàng thành công!";
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      })

      // getCart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.cartError = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.cart) {
          state.cartItems = action.payload.data.cart;
          state.number = updateNumber(state.cartItems);
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      })

      // getCartNotUser
      .addCase(getCartNotUser.pending, (state) => {
        state.isLoading = true;
        state.cartError = null;
      })
      .addCase(getCartNotUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItemsNotUser = action.payload.data?.cart || [];
      })
      .addCase(getCartNotUser.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      })

      // updateCart
      .addCase(updateCart.pending, (state) => {
        state.isLoading = true;
        state.cartError = null
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.cart) {
          state.cartItems = action.payload.data.cart;
          state.number = updateNumber(state.cartItems);
          state.cartSuccess = action.payload?.message || "Cập nhật giỏ hàng thành công!";
        }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      })

      // deleteCartItem
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.updatecartError = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data?.cart) {
          state.cartItems = action.payload.data.cart;
          state.number = updateNumber(state.cartItems);
          state.cartSuccess = action.payload?.message || "Xoá sản phẩm khỏi giỏ thành công!";
        }
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      })

      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.cartError = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data?.cart || [];
        state.number = updateNumber(state.cartItems);
        state.cartSuccess = action.payload?.message || "Đã xoá toàn bộ giỏ hàng!";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cartError = action.payload;
      });
  },
});

export const {
  cartToOrder,
  clearCartToOrder,
  setLocalCart,
  addLocalCartItem,
  updateLocalCartItem,
  deleteLocalCartItem,
  clearLocalCart,
  resetCartNumber,
  clearCartError,
  clearCartSuccess,
  clearCartWarn
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
