import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, } from 'recharts';
import { ShoppingCart, DollarSign, Users, Package, Star, } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFullReport, getOverview, getRevenueByMonth } from '../../../store/admin/dashboard-slice';
import { formatPrice } from '../../../utils/formatPrice';
import StatCard from "./StatCard";
import Loader1 from '../../ui/Loader1';


const IconMap = [ShoppingCart, DollarSign, Users, Package, Star]
const ColorMapStats = ["blue","green","purple","orange","yellow"]

export default function AdminDashboardOverview ({dateRange}) {
  const { isLoadingOverview, overview, revenueByMonth, fullReport } = useSelector(state => state.adminDashboard);
  const dispatch = useDispatch()
  console.log(fullReport);
  
  useEffect(()=>{
    dispatch(getOverview({dateRange}))
    dispatch(getFullReport({dateRange}))
  },[dispatch, dateRange])

  useEffect(()=>{
    dispatch(getRevenueByMonth())
  },[dispatch])

  return (
    <div className="space-y-6 relative">
      {isLoadingOverview && <Loader1 isLoading={isLoadingOverview}/>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {overview?.statCards?.map((stat, idx) => (
          <StatCard 
            key={idx} title={stat.title} value={stat.currentValue} icon={IconMap[idx]} 
            trend={stat.trend} trendValue={stat.trendValue} productValue = {stat.totalValue} color={ColorMapStats[idx]} 
            dateRange={dateRange} currentValue={stat.currentValue} prevValue={stat.prevValue}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value) => [formatPrice(value), "Doanh thu"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Tỷ lệ đánh giá</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overview?.reviewDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ rating, percent, count }) =>
                  `${rating}⭐: ${(percent * 100).toFixed(1)}% (${count})`
                }
              >
                {overview?.reviewDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};