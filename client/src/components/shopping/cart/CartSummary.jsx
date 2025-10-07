import { useSelector } from "react-redux";
import { formatPrice } from "../../../utils/formatPrice";

export default function CartSummary({ selectedItems, totalPrice, onCheckout }) {
  const { user } = useSelector((state) => state.auth);
  
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            Đã chọn: {selectedItems.length} sản phẩm
          </span>
          <span className="text-lg font-bold text-red-600">
            {formatPrice(totalPrice)}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
        >
          {user ? "Đặt hàng" : "Đăng nhập để đặt hàng"}
        </button>
      </div>
      
      {!user && (
        <p className="text-xs text-amber-600 mt-2">
          * Đăng nhập để lưu giỏ hàng và đặt hàng
        </p>
      )}
    </div>
  );
}