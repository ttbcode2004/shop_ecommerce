import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import StatCard from '../StatCard';
import { Tag, Calendar, TrendingUp } from 'lucide-react';
import { getVouchersOverview } from '../../../../store/admin/dashboard-slice';
import { formatPrice } from '../../../../utils/formatPrice';

const iconMap = [
  { icon: Tag, color: "blue" },
  { icon: Calendar, color: "orange" },
  { icon: TrendingUp, color: "green" },
  { icon: TrendingUp, color: "purple" },
];

export default function VouchersTab() {
  const dispatch = useDispatch();
  const { isLoadingVouchersOverview, vouchersOverview } = useSelector((state) => state.adminDashboard);
  console.log(vouchersOverview);
  
  useEffect(() => {
    dispatch(getVouchersOverview());
  }, [dispatch]);

  if (isLoadingVouchersOverview || !vouchersOverview) {
    return <div>Loading...</div>;
  }

  // Chuẩn hóa dữ liệu cho chart
  const data = vouchersOverview.activeVouchers?.map(v => ({
    ...v,
    remaining: v.limit > 0 ? Math.max(v.limit - v.used, 0) : null,
    usedPercent: v.limit > 0 ? ((v.used / v.limit) * 100).toFixed(0) : null,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {vouchersOverview.statCards?.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            icon={iconMap[idx].icon}
            color={iconMap[idx].color}
            currentValue={stat.total}
          />
        ))}
      </div>

   
      <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Thống kê sử dụng Voucher</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis />
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend />

            {/* Thanh Đã sử dụng */}
            <Bar
              dataKey="used"
              stackId="a"
              name="Đã sử dụng"
              fill="#3B82F6"
            >
              <LabelList
                dataKey="usedPercent"
                position="top"
                formatter={(val) => (val !== null ? `${val}%` : "–")}
              />
            </Bar>

            {/* Thanh Còn lại (chỉ cho voucher có giới hạn) */}
            {data.some(v => v.remaining !== null) && (
              <Bar
                dataKey="remaining"
                stackId="a"
                name="Còn lại"
                fill="#9097a4"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold">Danh sách Voucher đang hoạt động</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Mã Voucher</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Giảm</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Tối đa</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Sử dụng</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Hết hạn</th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-[16px]">
              {vouchersOverview.activeVouchers?.map((voucher, index) => {
                const daysLeft = Math.ceil((new Date(voucher.expiry) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-medium text-gray-900 text-[16px]">{voucher.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`px-2 py-1 text-[14px] w-fit rounded-sm ${
                        voucher.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {voucher.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-orange-700">
                      <p>{voucher.type === 'percentage' ? `${voucher.value}%` : formatPrice(voucher.value)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-orange-700">
                      <p>{formatPrice(voucher.maxValue)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{voucher.used}/{voucher.limit}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(voucher.expiry).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <div className="w-16 bg-slate-500 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                voucher.usedPercent >= 90 ? 'bg-red-600' : 
                                voucher.usedPercent >= 70 ? 'bg-yellow-500' : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(voucher.usedPercent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-800">
                            {voucher.usedPercent.toFixed(0)}%
                          </span>
                        </div>
                        <span className={`text-sm ${
                          daysLeft <= 3 ? 'text-red-600' : 
                          daysLeft <= 7 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



 