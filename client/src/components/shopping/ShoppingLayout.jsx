import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserError, clearUserSuccess, getMe } from "../../store/shop/user-slice";
import { addToCart, getCart, setLocalCart, getCartNotUser, clearCartError, clearCartSuccess, clearCartWarn } from "../../store/shop/cart-slice";
import { clearWishlistError, clearWishlistSuccess, clearWishlistWarn, getWishlist } from "../../store/shop/wishlist-slice";
import { clearAddressError, clearAddressSuccess } from "../../store/shop/address-slice";
import { clearOrderError, clearOrderSuccess } from "../../store/shop/order-slice";
import { clearSubOrderError, clearSubOrderSuccess } from "../../store/shop/subOrder-slice";
import { clearReviewError, clearReviewSuccess } from "../../store/shop/review-slice";
import { clearProductError } from "../../store/shop/products-slice";
import { clearDeliverError } from "../../store/shop/deliver-slice";
import { toast } from "react-toastify";
import ShoppingHeader from "./ShoppingHeader";
import SubHeader from "../ui/SubHeader";
import ScrollToTop from "../ui/ScrollToTop";

export default function ShoppingLayout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { productError} = useSelector((state) => state.shopProducts);
  const { wishlistError, wishlistSuccess, wishlistWarn } = useSelector((state) => state.shopWishlist);
  const { cartError, cartSuccess, cartWarn } = useSelector((state) => state.shopCart);
  const { addressError, addressSuccess } = useSelector((state) => state.shopAddress);
  const { orderError, orderSuccess } = useSelector((state) => state.shopOrder);
  const { subOrderError, subOrderSuccess } = useSelector((state) => state.shopSubOrder);
  const { reviewError, reviewSuccess } = useSelector((state) => state.shopReview);
  const { userError, userSuccess } = useSelector((state) => state.shopUser);
  
  const { deliverError } = useSelector((state) => state.shopDeliver);

  const messages = [
    { type: "error", value: wishlistError, clear: clearWishlistError },
    { type: "success", value: wishlistSuccess, clear: clearWishlistSuccess },
    { type: "warn", value: wishlistWarn, clear: clearWishlistWarn },

    { type: "error", value: cartError, clear: clearCartError },
    { type: "success", value: cartSuccess, clear: clearCartSuccess },
    { type: "warn", value: cartWarn, clear: clearCartWarn },

    { type: "error", value: addressError, clear: clearAddressError },
    { type: "success", value: addressSuccess, clear: clearAddressSuccess },

    { type: "error", value: orderError, clear: clearOrderError },
    { type: "success", value: orderSuccess, clear: clearOrderSuccess },

    { type: "error", value: subOrderError, clear: clearSubOrderError },
    { type: "success", value: subOrderSuccess, clear: clearSubOrderSuccess },

    { type: "error", value: productError, clear: clearProductError },
    
    { type: "error", value: reviewError, clear: clearReviewError },
    { type: "success", value: reviewSuccess, clear: clearReviewSuccess },
    
    { type: "error", value: userError, clear: clearUserError },
    { type: "success", value: userSuccess, clear: clearUserSuccess },
    
    { type: "error", value: productError, clear: clearProductError },
    { type: "error", value: deliverError, clear: clearDeliverError },
  ];

  const activeMessages = messages.filter(m => m.value);

  useEffect(() => {
    activeMessages.forEach(msg => {
      toast[msg.type](msg.value);

      dispatch(msg.clear());
    });
  }, [activeMessages, dispatch]);


  useEffect(() => {
    if (user && isAuthenticated) {
      dispatch(getMe(user.id));

      dispatch(getCart());
      dispatch(getWishlist());

      const pendingCart = JSON.parse(localStorage.getItem("pendingCartItems")) || [];
      
      if (pendingCart.length > 0) {
        pendingCart.forEach((item) => {
          dispatch(addToCart({ 
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity
          }));
        });
        localStorage.removeItem("pendingCartItems");
      }
    } else {
      const pendingCart = JSON.parse(localStorage.getItem("pendingCartItems")) || [];
      
      dispatch(setLocalCart(pendingCart));
      dispatch(getCartNotUser({items: pendingCart}))
    }
  }, [user, isAuthenticated, dispatch]);

  return (
    <div className="flex flex-col bg-white ">
      <ShoppingHeader />
      <SubHeader/>
      <main className="flex flex-col w-full justify-between min-h-screen relative">
        <ScrollToTop /> 
        <Outlet />
      </main>
    </div>
  );
}