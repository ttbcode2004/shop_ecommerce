import { TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice } from "../../../utils/formatPrice";
import { formatDatePrev } from "../../../utils/handleDatePrev";

export default function StatCard({title, value, icon: Icon, trend, trendValue, color = "blue", dateRange, currentValue, productValue, prevValue,}) {
  const headerDatePrev = formatDatePrev(dateRange)

  return (
    <div className="bg-white rounded-sm p-4 shadow-sm border border-slate-200">
      <div className="flex justify-between  ">
        <p className="text-[17px] font-medium text-gray-800">{title}</p>

        {trend && (
          <div
            className={` flex items-center mt-1 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="ml-1 text-sm font-medium">{trendValue}</span>
          </div>
        )}

      </div>

      <div className="flex items-center justify-between">
        <div className="">
          <p className="text-2xl mb-1 font-semibold text-gray-900">
            {title === "Doanh thu" ? formatPrice(value) : title==="Sản phẩm" ? productValue : currentValue}
          </p>
          {
            dateRange && title !== "Sản phẩm" && title !== "Đang xử lý" && <p className="text-gray-900 text-[16px]">
               {headerDatePrev}: {title === "Doanh thu" ? formatPrice(prevValue) : prevValue}
            </p>
          }
        </div>
        <div
          className={`p-2 rounded-full ${
              color === "blue" ? "bg-blue-50"
              : color === "green" ? "bg-green-50"
              : color === "purple" ? "bg-purple-50"
              : color === "orange" ? "bg-orange-50"
              : color === "yellow" ? "bg-yellow-50"
              : color === "red" ? "bg-red-50"
              : "bg-gray-50"
          }`}
        >
          <Icon
            className={`${
              color === "blue" ? "text-blue-600"
                : color === "green" ? "text-green-600"
                : color === "purple" ? "text-purple-600"
                : color === "orange" ? "text-orange-600"
                : color === "yellow" ? "text-yellow-600"
                : color === "red" ? "text-red-600"
                : "text-gray-600"
            }`}
            size={24}
          />
        </div>
      </div>
    </div>
  );
}
