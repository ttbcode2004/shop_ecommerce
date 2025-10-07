import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { colorTranslate } from "../../../config";
import { formatPrice } from "../../../utils/formatPrice";

export default function PlaceOrderList() {
  const { user } = useSelector((state) => state.auth);
  const { cartToOrderList } = useSelector((state) => state.shopCart);
  
  if (!cartToOrderList || cartToOrderList.length === 0) {
    return (
      <div className="bg-white shadow rounded-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="text-orange-500" />
          <h2 className="text-lg font-semibold">Sản phẩm</h2>
        </div>
        <p className="text-gray-500 text-center py-8">Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-orange-500" />
          <h2 className="text-lg font-semibold">Sản phẩm</h2>
        </div>
        {!user && <Link to="/auth/login" className="text-orange-600 hover:underline underline-offset-4">hãy đăng nhập để nhận voucher</Link>}
      </div>
      {!user && <p className="text-gray-900 mb-3 text-lg font-base">Nhân viên sẽ xác nhận qua số điện thoại hoặc email</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {cartToOrderList.map((item, idx) => (
          <li
            key={idx}
            className="flex gap-2 hover:shadow-lg transition-all shadow-sm bg-slate-50 rounded-sm"
          >
            <div className="cursor-pointer group">
              <img
                src={item.image || item?.product?.images?.[0]}
                alt={item.name || item.product?.name}
                className="w-24 h-22 object-cover rounded-lg transform group-hover:scale-105 transition duration-300 shadow"
              />
            </div>
            <div>
              <p className="font-medium max-w-[220px] line-clamp-1">
                {item.name || item.product?.name}
              </p>
              <p className="font-semibold text-sm md:text-[14px] text-gray-700">
                {item.size && `${item.size}`}
                {item.color && `, ${colorTranslate[item.color?.toLowerCase()] || item.color}`}
              </p>
              <p className="text-sm font-semibold text-gray-700">
                x{item.quantity || 1}
              </p>
              <p className="font-semibold text-red-600">
                {formatPrice((item.product?.finalPrice || item.finalPrice) * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}