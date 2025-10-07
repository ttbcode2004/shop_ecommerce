import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, clearError, clearSuccess } from "./store/auth-slice";

import AuthLayout from "./components/auth/AuthLayout";
import CheckAuth from "./components/common/CheckAuth";

import UnauthPage from "./pages/unauth-page";
import NotFound from "./pages/not-found";

import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import AuthForgot from "./pages/auth/AuthForgot";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVouchers from "./pages/admin/AdminVouchers";
import AdminDelivers from "./pages/admin/AdminDelivers";
import AdminAccount from "./pages/admin/AdminAccount";

import ShoppingLayout from "./components/shopping/ShoppingLayout";
import ShoppingHome from "./pages/shopping/ShoppingHome";
import ShoppingAbout from "./pages/shopping/ShoppingAbout";
import ShoppingProducts from "./pages/shopping/ShoppingProducts";
import ShoppingProductDetails from "./pages/shopping/ShoppingProductDetails";
import ShoppingCart from "./pages/shopping/ShoppingCart";
import ShoppingAccount from "./pages/shopping/ShoppingAccount";
import ShoppingWishlist from "./pages/shopping/ShoppingWishlist";
import ShoppingPlaceOrder from "./pages/shopping/ShoppingPlaceOrder";

import ResetPassword from "./components/shopping/user/ResetPassword";

import PrivateRoute from "./components/common/PrivateRoute";

import PaymentSuccess from "./components/ui/PaymentSuccess";
import useToastMessages from "./components/ui/useToastMessages";

import Loader1 from "./components/ui/Loader1";

export default function App() {
  const { user, isAuthenticated, isLoading, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  useToastMessages({error, success}, {clearError, clearSuccess})

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col bg-white relative">
      {isLoading && <Loader1 isLoading={isLoading}/>}
      <ToastContainer />
      <Routes>
        <Route path="/auth" 
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot" element={<AuthForgot />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="delivers" element={<AdminDelivers />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>

        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
            }
        >
          <Route index element={<ShoppingHome />} />
          <Route
            path="/cart"
            element={<ShoppingCart />}
          />
          <Route
            path="/placeOrder"
            element={<ShoppingPlaceOrder />}
          />
          
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <ShoppingAccount />
              </PrivateRoute>
            }
          />

          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/wishlist"
            element={<ShoppingWishlist />}
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="about" element={<ShoppingAbout />} />

          <Route path="products/:slug" element={<ShoppingProductDetails />} />
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="/:slug" element={<ShoppingProducts />} />
          
        </Route>
   
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
