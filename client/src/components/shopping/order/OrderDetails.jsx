import { useRef } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { getColorName, getStatusColor, getStatusText } from "../../../config";
import { formatPrice } from "../../../utils/formatPrice";

export default function OrderDetails({ onClose, order }) {
  const overlayRef = useRef();
  
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:px-10 lg:px-20 px-6"
    >
      <div className="relative w-full max-h-[90vh] bg-white shadow-2xl rounded-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] p-6">

        <div className="flex items-center justify-between border-b border-slate-400 pb-3 mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            Chi tiết đơn hàng #{order.orderCode || order._id}
          </h1>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={22} />
          </button>
        </div>


        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          <div className="bg-slate-50 p-4 rounded-sm shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
            <p className="text-gray-900">
              <span className="font-medium">Ngày đặt:</span>{" "}
              {format(new Date(order?.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Trạng thái:</span>{" "}
              <span className={`px-2 py-0.5 rounded-sm text-sm font-semibold ${
                  getStatusColor(order?.status)
                }`}
              >
                {getStatusText(order.status)}
              </span>
            </p>
            <p className="text-gray-900 font-medium"> Tổng số lượng: {order.amount}</p>
            <p className="text-gray-900">
              <span className="font-medium">Phương thức thanh toán:</span>{" "}
              <span className="text-blue-600 font-medium">
                {order.paymentMethod.toUpperCase()}
              </span>
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Thanh toán:</span>{" "}
              {order.payment ? (
                <span className="text-green-600 font-semibold">Đã Thanh Toán</span>
              ) : (
                <span className="text-red-600 font-semibold">Chưa Thanh Toán</span>
              )}
            </p>
            <p className="text-gray-900 text-xl font-semibold mt-2">
              Tổng tiền: {formatPrice(order.totalPrice)}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-sm shadow-sm text-gray-900 font-medium">
            <h2 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h2>
            <p>Người nhận: {order.address.fullName}</p>
            <p>SĐT:{order.address.phone}</p>
            <p>Địa chỉ: {order.address.street}, {order.address.commune}, {order.address.city}</p>
            {order.address.notes && (
              <p>Ghi chú: {order.address.notes} </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm shadow-sm ">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.products.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-sm p-4 shadow-sm hover:shadow-md transition font-medium text-gray-800"
              >
                <p>{item.name} </p>
                {/* <p>ID: {item.product}</p> */}
                <div className="flex gap-3 mt-2">
                  <img
                    className="w-24 h-24 object-cover rounded-md"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="text-[16px] font-medium text-gray-800">
                    <p>Size: {item.size}</p>
                    <p className="">Màu: {getColorName(item.color)?.name || item.color}
                    </p>
                    <p>Số lượng: {item.quantity}</p>
                    <p className="text-gray-900 font-semibold">{formatPrice(item.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
