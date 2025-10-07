import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updatePayment } from "../../store/shop/order-slice";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const resultCode = params.get("resultCode");
  const orderId = params.get("orderId");

  const responseCode = params.get("vnp_ResponseCode");
  // const transactionStatus = params.get("vnp_TransactionStatus");
  const id = params.get("vnp_TxnRef");

  // const isSuccess = responseCode === "00" && transactionStatus === "00";

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(()=>{
    if(resultCode === "0"){
    dispatch(updatePayment(orderId))
    navigate("/account")
  }
  },[dispatch, orderId])

  useEffect(()=>{
    if(responseCode === "00"){
    dispatch(updatePayment(id))
    navigate("/account")
  }
  },[dispatch, id])

  return (
    <div className="p-6 text-center mt-25">
      {(resultCode === "0" || responseCode === "00") ? (
        <h1 className="text-green-600 text-2xl">Thanh toán thành công 🎉</h1>
      ) : (
        <h1 className="text-red-600 text-2xl">Thanh toán thất bại ❌</h1>
      )}
    </div>
  );
}

