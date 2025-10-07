import { CreditCard, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import vnpay from "../../../assets/vnpay.png";
import momo from "../../../assets/momo.png";

const paymentOptions = [
  { value: "cod", label: "Thanh toán khi nhận hàng" },
  { value: "vnpay", label: "VNPAY", icon: vnpay },
  { value: "momo", label: "MOMO", icon: momo },
];

export default function PlaceOrderPayment({paymentMethod, setPaymentMethod}) {
  const { user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const selectedPaymentOption = paymentOptions.find(
    (o) => o.value === paymentMethod
  );

  const handleSelectPayment = (value) => {
    setPaymentMethod(value);
    setIsPaymentOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPaymentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" max-h-90">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="text-green-600" />
        <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
      </div>
      <div className="relative w-72" ref={dropdownRef}>
        <button
          onClick={() => setIsPaymentOpen(!isPaymentOpen)}
          className="w-full flex items-center justify-between border border-slate-400 px-3 py-2 rounded-sm bg-white shadow-sm"
        >
          <span className="flex items-center gap-2">
            {selectedPaymentOption?.icon && (
              <img src={selectedPaymentOption.icon} alt="" className="h-5" />
            )}
            {selectedPaymentOption?.label}
          </span>
          {user && <ChevronDown className={`w-5 h-5 ${isPaymentOpen ? "rotate-180" : ""}`} />}
        </button>

        {isPaymentOpen && user && (
          <div className="absolute mt-1 w-full bg-white border border-slate-400 rounded-sm shadow-lg overflow-hidden z-10">
            {paymentOptions?.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelectPayment(opt.value)}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer ${
                  opt.value === selectedPaymentOption?.value ? "bg-blue-100" : ""
                }`}
              >
                {opt.icon && <img src={opt.icon} alt="" className="h-5" />}
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}