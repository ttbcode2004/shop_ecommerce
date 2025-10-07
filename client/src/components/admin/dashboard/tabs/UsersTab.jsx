import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, Star, TrendingUp, User, Ban } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewUsersByMonth, getTopUsers, getUsersOverview } from '../../../../store/admin/dashboard-slice';
import { formatPrice } from '../../../../utils/formatPrice';
import StatCard from '../StatCard';
import Loader1 from '../../../ui/Loader1';

const IconMap = [
  {icon: Users, color: "blue"},
  {icon: Star, color: "purple"},
  {icon: TrendingUp, color: "orange"},
  {icon: Ban, color: "red"},
]

const UsersTab = ({ dateRange }) => {
  const { isLoadingUsersOverview, usersOverview, newUsersByMonth, topUsers } = useSelector((state) => state.adminDashboard);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getUsersOverview({ dateRange }));
  }, [dispatch, dateRange]);

  useEffect(() => {
    dispatch(getNewUsersByMonth());
    dispatch(getTopUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <Loader1 isLoading={isLoadingUsersOverview} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {usersOverview?.statCards?.map((stat, idx)=>(
          <StatCard 
            key={idx} title={stat.title}
            icon={IconMap[idx].icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={IconMap[idx].color}
            dateRange={dateRange}
            currentValue={stat.currentValue}
            prevValue={stat.prevValue}/>
        ))}
      </div>


      <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4">Khách hàng mới theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={newUsersByMonth || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Khách hàng mới" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers Table */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Top khách hàng VIP</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Khách hàng</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Tổng chi tiêu</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Số đơn hàng</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Trung bình/đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topUsers?.map((customer, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[16px] font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] font-semibold text-green-600">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-blue-900">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-orange-800">
                    {formatPrice(customer.averageSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;