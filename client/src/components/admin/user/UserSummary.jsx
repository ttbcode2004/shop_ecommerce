import { formatPrice } from '../../../utils/formatPrice'

export default function UserSummary({userList}) {
  return (
    <div>
      {userList && userList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-100 p-2 rounded-sm shadow-sm">
            <div className="text-lg text-gray-900">Tổng người dùng</div>
            <div className="text-2xl font-bold text-gray-900">{userList.length}</div>
          </div>
          <div className="bg-slate-100 p-2 rounded-sm shadow-sm">
            <div className="text-lg text-gray-900">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-blue-600">
              {userList.reduce((sum, user) => sum + (user.ordersCount || 0), 0)}
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-sm shadow-sm">
            <div className="text-lg text-gray-900">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(userList.reduce((sum, user) => sum + (user.totalSpent || 0), 0))}
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-sm shadow-sm">
            <div className="text-lg text-gray-900">Người dùng bị chặn</div>
            <div className="text-2xl font-bold text-red-600">
              {userList.filter(user => !user.isActive).length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
