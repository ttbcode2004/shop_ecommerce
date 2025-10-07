import { useState } from "react";
import { useDispatch } from "react-redux";
import { Eye, UserX, UserCheck, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { adminHeaderUser } from "../../../config";
import { formatPrice } from "../../../utils/formatPrice";
import userPhoto from "../../../assets/user.png"
import OrderModal from "./OrderModal";
import CartModal from "./CartModal";
import { deleteUser, unblockUser } from "../../../store/admin/user-slice";
import Loader1 from "../../ui/Loader1";
import CreateUserModal from "./CreateUserModal";

export default function AdminUserList({ userList, isLoadingUsersAction, isOpenCreateUser, onCloseCreateUser }) {
  const dispatch = useDispatch()
  const [isOpenOrder, setIsOpenOrder] = useState(false)
  const [ordersData, setOrdersData] = useState([])
  const [cartsData, setCartsData] = useState([])
  const [userName, setUserName] = useState([])
  const [isOpenCart, setIsOpenCart] = useState(false)

  const handleBlockUser = (id, isActive) => {
    if(isActive){
      dispatch(deleteUser(id))
    }else{
      dispatch(unblockUser(id))
    }
  };

  const handleViewOrder = (orders, userName) => {
    setOrdersData(orders)
    setUserName(userName)
    setIsOpenOrder(true)
  };

  const handleViewCart = (carts, userName) => {
    setCartsData(carts)
    setUserName(userName)
    setIsOpenCart(true)
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
      {isLoadingUsersAction && <Loader1 isLoading={isLoadingUsersAction}/>}
      {userList && userList.length > 0 ? (
        <div className="overflow-x-auto min-h-[550px]">
          <table className="min-w-full ">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                {adminHeaderUser.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-[13px] font-bold text-gray-900 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200 text-gray-900">
              {userList.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50 transition-colors duration-200"
                >
                  {/* Tên */}
                  <td className="px-4 py-3 text-sm lg:text-base font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photo || userPhoto}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = userPhoto;
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-[17px] truncate max-w-[120px]">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-500">ID: {user._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>

                  {/* SĐT */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-[18px]">{user.phone || "—"}</p>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    <p className=" truncate max-w-[180px] text-[17px]">
                      {user.email}
                    </p>
                  </td>

                  {/* Ngày tạo tài khoản */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p>
                      {format(new Date(user.createdAt), "dd/MM/yyyy")}, {format(new Date(user.createdAt), "HH:mm")}
                    </p>
                  </td>

                  {/* Đã đặt */}
                  <td className="px-4 py-3 text-sm lg:text-base">
                    <button
                      onClick={() => handleViewOrder(user.orders, user.name)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-sm text-[14px] font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      title="Xem đơn hàng"
                    >
                      <ShoppingCart size={14} />
                      {user.ordersCount || 0} đơn
                    </button>
                  </td>

                  {/* Tổng chi tiêu */}
                  <td className="px-4 py-3 text-sm lg:text-[18px] font-semibold text-green-700 whitespace-nowrap">
                    {user.totalSpent ? formatPrice(user.totalSpent) : "0 ₫"}
                  </td>

                  {/* Giỏ hàng */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewCart(user.cart, user.name)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-sm text-[14px] font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                      title="Xem giỏ hàng"
                    >
                      <ShoppingCart size={14} />
                      {user.cartCount || 0}
                    </button>
                  </td>

                  {/* Actions - Chặn */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleBlockUser(user._id, user.isActive)}
                        className={`p-2 rounded-sm transition-colors ${
                          !user.isActive
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                        title={!user.isActive ? "Bỏ chặn người dùng" : "Chặn người dùng"}
                      >
                        {!user.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>

                      {/* <button
                        onClick={() => handleViewUserDetails(user._id)}
                        className="p-2 rounded-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Xem chi tiết người dùng"
                      >
                        <Eye size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có người dùng nào
              </h3>
              <p className="text-gray-500">
                Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại
              </p>
            </div>
          </div>
        </div>
      )}

      {isOpenOrder && <OrderModal isOpen={isOpenOrder} onClose={()=>setIsOpenOrder(false)} orders={ordersData} userName={userName}/>}
      {isOpenCart && <CartModal isOpen={isOpenCart} onClose={()=>setIsOpenCart(false)} cart={cartsData} userName={userName}/>}
      {isOpenCreateUser && <CreateUserModal isOpen={isOpenCreateUser} onClose={onCloseCreateUser}/>}
      
    </div>
  );
}