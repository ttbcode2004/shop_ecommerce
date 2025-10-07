import { useState } from "react";
import { adminHeaderOrder, adminHeaderSubOrder } from "../../../config";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "../../../utils/formatPrice";
import AdminOrderDetails from "./AdminOrderDetails";
import SelectedStatusUpdate from "./SelectedStatusUpdate";

export default function AdminOrderList({isUser, orderList}) {
  const [showDetails, setShowDetails] = useState(false)
  const [orderDetails, setOrderDetails] = useState({})
  
  const handleShowDetails = (order) => {
    setOrderDetails(order);
    setShowDetails(true)
  }
  
  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
      {orderList.length > 0 && (
        <div className="overflow-x-auto min-h-[550px]">
          <table className="min-w-full ">
            <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              {(isUser ? adminHeaderOrder : adminHeaderSubOrder).map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

            <tbody className="bg-white divide-y divide-slate-200 text-gray-900">
              {orderList.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-sm lg:text-base font-medium text-gray-900 max-w-[160px] truncate">
                    {order._id || "—"}
                  </td>

                  {isUser && <td className="px-4 py-3 text-sm lg:text-base font-semibold max-w-[150px] truncate">
                    {order.user.name ?? 0} 
                  </td>}

                  {/* Giá */}
                  <td className="px-4 py-3 text-[18px] font-semibold text-red-600 whitespace-nowrap">
                    {order.totalPrice ? `${formatPrice(order.totalPrice)}` : "—"}
                  </td>

                  <td className="px-4 py-3 text-sm lg:text-base font-medium text-gray-700 max-w-[90px]">
                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                  </td>

                  <td className="px-4 py-3 text-sm lg:text-base font-medium">
                    {order.paymentMethod}
                  </td>

                  <td className="px-4 py-3 text-sm lg:text-base max-w-[24px] font-medium">
                    <SelectedStatusUpdate isUser={isUser} seletedDefault={order.status} orderId={order._id}/>
                  </td>

                  <td className="px-4 py-3 flex gap-4 items-center">
                    <button
                      onClick={() => handleShowDetails(order)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      title="Chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetails && <AdminOrderDetails isUser={isUser} onClose = {() => setOrderDetails(false)} order={orderDetails} />}
    </div>
  )
}
