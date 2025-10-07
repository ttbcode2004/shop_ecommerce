import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { formatPrice } from "../../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { cartToOrder } from "../../../store/shop/cart-slice";

export default function CartHeader({ selectedItems, setSelectedItems, currentCart }) {
  const { user } = useSelector((state) => state.auth);
  const { number } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const totalPrice = useMemo(() => { 
    return ( selectedItems.reduce( (sum, item) => sum + (item.product.finalPrice || item.finalPrice) * item.quantity, 
    0 ) || 0 ); 
  }, [selectedItems]);
  
  const toggleSelectAll = () => {
    if (selectedItems.length === currentCart.length) {
      setSelectedItems([]);
    } else {
      // Lọc bỏ các sản phẩm bị khóa (isActive === false)
      const activeItems = currentCart.filter(item => item?.product.isActive !== false);

      if (!user) {
        setSelectedItems(activeItems.map((item, idx) => ({ ...item, idx })));
      } else {
        setSelectedItems([...activeItems]);
      }
    }
  };


  const checkout = () => {
    if (selectedItems.length < 1) {
      toast.warn("Vui lòng chọn sản phẩm");
      return;
    }
    dispatch(cartToOrder(selectedItems));
    navigate("/placeOrder");
  };

  return (
    <div className="flex items-center rounded-sm bg-white shadow-sm md:py-4 gap-4 sm:gap-2 md:gap-8 px-4 sm:px-6 py-4">
      <div className="space-y-1.5">
        <h2 className="md:text-xl text-[18px] md:text-[22px] font-bold">
          🛒 Giỏ hàng{" "}
          <span className="font-semibold text-gray-700 text-[14px] sm:text-[16px]">
            ({number})
          </span>
        </h2>
        {!user && (
          <p className="text-[12px] md:text-sm text-amber-600">
            * Đăng nhập để nhận voucher
          </p>
        )}
        <button
          className="sm:hidden px-2 sm:px-4 text-xs bg-red-500 text-white py-2 md:py-3 rounded-sm font-semibold hover:bg-red-600 transition"
          onClick={checkout}
        >
          ĐẶT HÀNG ({formatPrice(totalPrice)} ₫)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center ml-8 md:ml-0">
        <p className="text-sm sm:text-[14px] md:text-[16px] underline underline-offset-4">
          Đã chọn: {selectedItems.length}
        </p>
        <button
          onClick={toggleSelectAll}
          className="text-xs sm:text-[14px] md:text-[16px] shadow-2xl py-1 bg-red-100 rounded-sm hover:bg-red-200 px-2 transition"
        >
          {selectedItems.length === currentCart.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
      </div>
      
      <button
        className="hidden sm:block px-2 text-sm bg-red-500 text-white py-2 md:py-3 rounded-sm font-semibold hover:bg-red-600 transition"
        onClick={checkout}
      >
        ĐẶT HÀNG ({formatPrice(totalPrice)})
      </button>
    </div>
  );
}