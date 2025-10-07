import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllAddresses } from "../../store/shop/address-slice";
import PlaceOrderList from "../../components/shopping/placeOrder/PlaceOrderList";
import PlaceOrderAddress from "../../components/shopping/placeOrder/PlaceOrderAddress";
import PlaceOrderPayment from "../../components/shopping/placeOrder/PlaceOrderPayment";
import OrderSummary from "../../components/shopping/placeOrder/OrderSummary";
import Loader from "../../components/ui/Loader";

export default function ShoppingPlaceOrder() {
  const { user } = useSelector((state) => state.auth);
  const {addressList } = useSelector((state) => state.shopAddress);
  const { cartToOrderList } = useSelector((state) => state.shopCart);
  const { isLoading } = useSelector((state) => state.shopOrder);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [guestAddress, setGuestAddress] = useState(null);
  const [isGuestAddressValid, setIsGuestAddressValid] = useState(false);

  const selectedAddress = user ? selectedAddressIndex !== null ? 
    addressList[selectedAddressIndex] : null : guestAddress

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllAddresses(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && addressList?.length > 0) {
      const defaultIndex = addressList.findIndex((addr) => addr.defaultAddress);
      setSelectedAddressIndex(defaultIndex !== -1 ? defaultIndex : 0);
    }
  }, [addressList, user]);

  useEffect(() => {
    if (!cartToOrderList || cartToOrderList.length === 0) {
      navigate("/cart");
    }
  }, [cartToOrderList, navigate]);

  if(isLoading){
    return <Loader isLoading={isLoading}/>
  }

  return (
    <div className="mt-6 md:px-10 lg:px-20 px-6">
      <div className="flex flex-col gap-4">
        <PlaceOrderList />
        
        <div className="flex justify-between flex-col lg:flex-row gap-8 2xl:gap-12 my-6">
          <div className="flex flex-col flex-1 space-y-6 xl:flex-row gap-4 xl:gap-8 2xl:gap-12">
            <PlaceOrderAddress
              selectedAddress = {selectedAddress}
              selectedAddressIndex = {selectedAddressIndex}
              setSelectedAddressIndex = {setSelectedAddressIndex}
              setGuestAddress = {setGuestAddress}
              setIsGuestAddressValid = {setIsGuestAddressValid}
            />
            
            <PlaceOrderPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <OrderSummary 
            selectedAddress={selectedAddress} 
            isGuestAddressValid={isGuestAddressValid} 
            paymentMethod={paymentMethod}

          />
        </div>
      </div>
    </div>
  );
}