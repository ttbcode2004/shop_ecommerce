import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from "recharts";
import { ShoppingCart, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersOverview, getOrdersRevenueByMonth, } from "../../../../store/admin/dashboard-slice";
import { formatPrice } from "../../../../utils/formatPrice";
import { formatDatePrev } from "../../../../utils/handleDatePrev";
import StatCard from "../StatCard";
import Loader1 from "../../../ui/Loader1";

const IconMap = [
  { val: 0, icon: ShoppingCart, color: "blue" },
  { val: 1, icon: CheckCircle, color: "green" },
  { val: 6, icon: Clock, color: "orange" },
  { val: 7, icon: TrendingUp, color: "purple" },
];

const colorDetails = ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"];

const OrdersTab = ({ dateRange }) => {
  const { isLoadingOrdersOverview, ordersOverview, ordersRevenueByMonth } = useSelector((state) => state.adminDashboard);
  const dispatch = useDispatch();

  const headerDatePrev = formatDatePrev(dateRange);

  useEffect(() => {
    dispatch(getOrdersOverview({ dateRange }));
  }, [dispatch, dateRange]);

  useEffect(() => {
    dispatch(getOrdersRevenueByMonth());
  }, [dispatch]);


  return (
    <div className="space-y-6 relative">
      {isLoadingOrdersOverview && <Loader1 isLoading={isLoadingOrdersOverview} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {ordersOverview?.statCards?.map((stat, idx) => {
          if (idx === 0 || idx === 1 || idx === 6 || idx === 7) {
            const icon = IconMap.find((item) => item.val === idx);
            return (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.currentValue}
                icon={icon.icon}
                trend={stat.trend}
                trendValue={stat.trendValue}
                productValue={stat.totalValue}
                color={icon.color}
                dateRange={dateRange}
                currentValue={stat.currentValue}
                prevValue={stat.prevValue}
              />
            );
          }
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">
            Đơn hàng & Doanh thu theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersRevenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Doanh thu (VND)") return formatPrice(value);
                  return value;
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#3B82F6"
                name="Doanh thu (VND)"
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                fill="#10B981"
                name="Số đơn hàng"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">
            Doanh thu theo phương thức thanh toán
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ordersOverview.paymentMethodData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="revenue"
                nameKey="method" // thêm dòng này để label/tooltip hiểu là tên phương thức
                label={({ name, percent, payload }) =>
                  `${name}: ${(percent * 100).toFixed(1)}% (${
                    payload.count
                  } đơn)`
                }
              >
                {ordersOverview?.paymentMethodData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#3B82F6", "#10B981", "#F59E0B"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${formatPrice(value)} (${props.payload.count} đơn)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Table */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">
            Chi tiết trạng thái đơn hàng
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase">
                  Xu hướng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ordersOverview.statCards?.map((status, index) => {
                if (index >= 1 && index <= 5) {
                  return (
                    <tr key={index}>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3`}
                            style={{
                              backgroundColor: `${colorDetails[index - 1]}`,
                            }}
                          ></div>
                          {status.title}
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-[16px] text-gray-900">
                        {status.currentValue}
                      </td>

                      <td className="px-6 py-2 whitespace-nowrap text-[16px]">
                        <p
                          className={
                            status.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {status.trend === "up" ? "↗️" : "↘️"}
                          <span className="ml-1">
                            {status.trendValue} ({status.diff})
                          </span>
                        </p>
                        <p className="text-gray-700">
                          {headerDatePrev}:
                          <span className="ml-1">{status.prevValue}</span>
                        </p>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
