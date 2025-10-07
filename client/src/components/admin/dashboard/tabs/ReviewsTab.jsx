import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, } from "recharts";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsOverview } from "../../../../store/admin/dashboard-slice";
import StatCard from "../StatCard";
import Loader1 from "../../../ui/Loader1";

const colors = ["yellow", "green", "blue", "red"];
const colorReviews = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6B7280"];

export default function ReviewsTab({ dateRange }) {
  const { isLoadingReviewsOverview, reviewsOverview } = useSelector((state) => state.adminDashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReviewsOverview({ dateRange }));
  }, [dispatch, dateRange]);

  return (
    <div className="space-y-6 relative">
      {isLoadingReviewsOverview && <Loader1 isLoading={isLoadingReviewsOverview} />}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reviewsOverview?.distribution?.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            icon={Star}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={colors[idx]}
            dateRange={dateRange}
            currentValue={stat.count}
            prevValue={stat.prevCount}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Phân bố điểm đánh giá</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewsOverview.summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Tỷ lệ đánh giá</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reviewsOverview.summary}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ rating, percent }) =>
                  `${rating} ⭐: ${percent.toFixed(1)}%`
                }
              >
                {reviewsOverview.summary?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorReviews[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Chi tiết đánh giá</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Sao
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Phần trăm
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Tiến độ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviewsOverview.summary?.map((review, idx) => {
                return (
                  <tr key={review.rating}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">{review.rating}</span>
                        <Star
                          className="ml-1 text-yellow-400"
                          size={16}
                          fill="currentColor"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">
                      {review.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">
                      {review.percent.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${review.percent}%`,
                            backgroundColor: colorReviews[idx],
                          }}
                        ></div>
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
