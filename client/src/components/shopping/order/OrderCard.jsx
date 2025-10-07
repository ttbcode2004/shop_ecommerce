import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import {updateOrderReturn, updateOrderState } from "../../../store/shop/order-slice";
import { colorTranslate, getStatusColor, getStatusText } from "../../../config";
import { Calendar, CreditCard, Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { formatPrice } from "../../../utils/formatPrice";
import { toSlug } from "../../../utils/toSlug";

const OrderCard = ({order, onViewDetails, onReview}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  const isShowReturn = (() => {
    if (!order.deliveredAt) return false;

    const deliveredDate = new Date(order.deliveredAt);
    const now = new Date();

    // Tính số mili giây đã trôi qua
    const diffMs = now - deliveredDate;
    // Đổi ra số ngày
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays <= 7; // trong vòng 7 ngày thì true
  })();

  const handleReturn = (itemId)=> {
    dispatch(updateOrderReturn({ orderId: order._id, itemId }))
  }

  const handleUpdateState = (state) => {
    dispatch(updateOrderState({ orderId: order._id, state }));
  };

  return (
    <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-2">
        <div className="flex items-start text-[17px] justify-between">
          <div className="flex flex-col lg:flex-row lg:gap-4">
            <div className="flex items-center gap-1 text-[16px] text-gray-800">
              <Calendar size={16} />
              <span>{order.status === "delivered" ? "Ngày giao:":"Ngày đặt:"}</span>
              <span>{format(new Date(order.status === "delivered" ? order.deliveredAt : order.createdAt), "dd/MM/yyyy HH:mm", {locale: vi,})}</span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-[16px] text-gray-900">Tổng tiền:</p>
              <p className="font-medium text-[18px] text-gray-900">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-end flex-col lg:flex-row lg:gap-4">
            <p
              className={`px-3 py-1 text-sm font-medium rounded-sm border 
                ${getStatusColor(order.status)}`}
            >
              {getStatusText(order.status)}
            </p>

            <div className="flex items-center gap-2">
              <CreditCard size={16} />
              <span className="text-[17px]">
                {order.payment ? (
                  <span className="text-green-600 font-medium">
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="text-orange-600 font-medium">
                    Chưa thanh toán
                  </span>
                )}
                <span className="text-gray-900 ml-1">({order.paymentMethod})</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="p-2">
        <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {order.products.map((item, idx) => (
            <div 
              key={idx} 
              className="flex gap-4 pr-2 h-fit bg-slate-50 rounded-sm shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => navigate(`/products/${toSlug(item.name) || item.product}`)}
            >
              <img
                className="w-18 h-18 object-cover rounded-sm"
                src={item.image}
                alt={item.color}
              />
              <div className="flex flex-col w-full">
                <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                <div className="flex justify-between flex-row items-end">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <span className="capitalize">{item.size}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {colorTranslate[item.color] || item.color}
                      </span>
                      <span>•</span>
                      <span>x{item.quantity}</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mb-1 mt-1">
                  {isShowReturn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReturn(item._id);
                      }}
                      className="flex items-center gap-1 h-7 px-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                      {item.isReturn ? "Đã trả hàng" : "Trả hàng"}
                    </button>
                  )}
                  {order.isReceive && !item.isReview && !item.isReturn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReview && onReview(item, idx, order._id);
                      }}
                      className="flex items-center gap-1 h-7 px-2 bg-yellow-500 text-white rounded-sm hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      <Star size={16} />
                      Đánh giá
                    </button>
                  )}

                  {order.isReceive && !item.isReturn && (
                    <button
                      className="flex items-center gap-1 h-7 px-2 bg-slate-500 text-white rounded-sm hover:bg-slate-600 transition-colors text-sm font-medium"
                    >
                      Mua lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-900">{order.products.length} sản phẩm</p>

          <div className="flex gap-3">

            <button
              onClick={() => onViewDetails && onViewDetails(order)}
              className="px-2 py-1 border border-slate-400 text-gray-800 rounded-sm hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              Xem chi tiết
            </button>

            {order.status === "processing" && (
              <button 
                onClick={()=> handleUpdateState("cancelled")}
                className="px-2 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Hủy đơn
              </button>
            )}

            {order.status === "delivered" && !order.isReceive && (
              <button 
                onClick={()=> handleUpdateState("received")}
                className="px-2 py-1 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors text-sm font-medium">
                Đã nhận hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
