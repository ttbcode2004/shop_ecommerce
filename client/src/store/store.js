import { configureStore } from "@reduxjs/toolkit"

import authSlice from "./auth-slice"

import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminSubOrderSlice from "./admin/subOrder-slice";
import adminUserSlice from "./admin/user-slice";
import adminAccountSlice from "./admin/account-slice";
import adminVoucherSlice from "./admin/voucher-slice";
import adminDeliverSlice from "./admin/deliver-slice";
import adminDashboardSlice from "./admin/dashboard-slice";

import shopProductsSlice from "./shop/products-slice"
import shopCartSlice from "./shop/cart-slice"
import shopWishlistSlice from "./shop/wishlist-slice"
import shopUserSlice from "./shop/user-slice"
import shopAddressSlice from "./shop/address-slice"
import shopOrderSlice from "./shop/order-slice"
import shopSubOrderSlice from "./shop/subOrder-slice"
import shopVoucherSlice from "./shop/voucher-slice"
import shopReviewSlice from "./shop/review-slice"
import shopDeliverSlice from "./shop/deliver-slice"


const store = configureStore({
    reducer: {
        auth: authSlice,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        adminSubOrder: adminSubOrderSlice,
        adminUser: adminUserSlice,
        adminAccount: adminAccountSlice,
        adminVoucher: adminVoucherSlice,
        adminDeliver: adminDeliverSlice,
        adminDashboard: adminDashboardSlice,

        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopWishlist: shopWishlistSlice,
        shopVoucher: shopVoucherSlice,

        shopUser: shopUserSlice,
        shopAddress: shopAddressSlice,
        
        shopOrder: shopOrderSlice,
        shopSubOrder: shopSubOrderSlice,
        shopReview: shopReviewSlice,
        shopDeliver: shopDeliverSlice,

    }
})

export default store