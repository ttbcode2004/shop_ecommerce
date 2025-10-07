import { format } from "date-fns";
import { X, Package, Truck, CheckCircle, XCircle, Clock, CreditCard, Banknote } from "lucide-react";
import { formatPrice } from "../../../utils/formatPrice";
import { colorTranslate, statusList } from "../../../config";

const OrderModal = ({ isOpen, onClose, orders, userName }) => {
  if (!isOpen) return null;

  const ordersSort = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "shipping":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const item = statusList.find(i => i.value === status);
    return item ? item.name : status;
  };

  const getStatusColor = (status) => {
    const item = statusList.find(i => i.value === status);
    return item ? `${item.bg} ${item.border} ${item.text}` : "";
  };


  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "momo":
        return "MoMo";
      case "bank":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-400">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Đơn hàng: {userName}
            </h2>
            <p className="text-[16px] text-gray-900 mt-1">
              Tổng cộng: {orders?.length || 0} đơn hàng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {ordersSort && ordersSort?.length > 0 ? (
            <div className="space-y-6">
              {ordersSort?.map((order) => (
                <div
                  key={order._id}
                  className="border border-slate-200 rounded-sm p-4 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-sm text-sm font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <span className="text-[16px] text-gray-900">
                        id: {order._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg text-gray-900">
                        Tổng đơn: {formatPrice(order.totalPrice)}
                      </div>
                      <div className="text-[16px] text-gray-800">
                        {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Sản phẩm ({order.amount})
                    </h4>
                    <div className="space-y-3">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-100 rounded-sm"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-sm border border-slate-300"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-[16px]">
                              {item.name}
                            </h5>
                            <div className="flex items-center gap-4 text-[14px] text-gray-900 mt-1">
                              <span>Size: {item.size}</span>
                              <span>Màu: {colorTranslate[item.color]}</span>
                              <span>SL: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right ">
                            {item.isReturn && <p className="font-medium  text-orange-600">
                              Đã Trả Hàng
                            </p>}
                            <div className="font-medium text-gray-900">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-400">
                    {/* Payment Info */}
                    <div>
                      <h5 className="font-medium text-lg text-gray-900 mb-2">
                        Thông tin thanh toán
                      </h5>
                      <div className="space-y-2 text-[16px]">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === "cod" ? (
                            <Banknote className="w-4 h-4  text-gray-900" />
                          ) : (
                            <CreditCard className="w-4 h-4 text-gray-900" />
                          )}
                          <span className="text-gray-900">
                            {getPaymentMethodText(order.paymentMethod)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-sm text-[14px] font-medium ${
                              order.payment
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </div>
                        {order.paidAt && (
                          <div className="text-[16px] text-gray-900">
                            Thanh toán lúc: {format(new Date(order.paidAt), "dd/MM/yyyy HH:mm")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                      <h5 className="font-medium text-lg text-gray-900 mb-2">
                        Địa chỉ giao hàng
                      </h5>
                      <div className="text-[16px] text-gray-900">
                        <p className="font-medium">{order.address.fullName}</p>
                        <p>{order.address.phone}</p>
                        <p>
                          {order.address.street}, {order.address.commune}, {order.address.city}
                        </p>
                        {order.address.notes && (
                          <p>Ghi chú: {order.address.notes}</p>
                        )}
                        {order.deliveredAt && (
                          <p className="text-green-600">
                            Giao hàng lúc: {format(new Date(order.deliveredAt), "dd/MM/yyyy HH:mm")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500">
                Người dùng này chưa đặt đơn hàng nào
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;