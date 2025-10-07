import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getCartNotUser } from "../../store/shop/cart-slice";
import CartHeader from "../../components/shopping/cart/CartHeader";
import CartTableHeader from "../../components/shopping/cart/CartTableHeader";
import CartActions from "../../components/shopping/cart/CartActions";
import CartListDesktop from "../../components/shopping/cart/CartListDesktop";
import CartListMobile from "../../components/shopping/cart/CartListMobile";
import EmptyCart from "../../components/shopping/cart/EmptyCart";
import Loader from "../../components/ui/Loader";

export default function ShoppingCart() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, cartItems, cartItemsNotUser, localCartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState([]);
  
  const currentCart = user ? cartItems : cartItemsNotUser;
  
  useEffect(()=>{
    
  }, [localCartItems])

  useEffect(()=>{
    if(user) 
      dispatch(getCart());
    else 
      dispatch(getCartNotUser({items: localCartItems}))
  }, [user, dispatch, localCartItems])

  if(isLoading){
    return <Loader isLoading={isLoading} />
  }

  if (currentCart.length === 0) {
    return <EmptyCart />;
  }
  
  return (
    <>
      <div className="relative w-full mx-auto md:px-10 lg:px-20 px-6 py-10 mb-20 md:mb-10">
        <CartHeader
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          currentCart={currentCart}
        />

        <CartActions 
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        
        <CartTableHeader />

        <div className="space-y-4 mt-4">
          {currentCart.map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-slate-50 rounded-sm p-2 shadow-sm hover:shadow-lg transition"
            >
              <CartListDesktop
                idx = {idx}
                item={item}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />

              <CartListMobile
                idx = {idx}
                item={item}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}