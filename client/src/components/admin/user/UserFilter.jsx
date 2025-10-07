import { ChevronDown, Search } from "lucide-react";
import { inputSearchAdminClass, adminSelectClass } from "../../../config";

export default function UserFilter({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full flex-row gap-4 items-center">
      <div className="relative items-center flex w-full">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Tìm theo tên khách hàng, email hoặc số điện thoại..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className={inputSearchAdminClass}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className={adminSelectClass}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
             <option value="7days">7 ngày gần đây</option>
            <option value="1month">1 tháng gần đây</option>
            <option value="muchSpent">Chi tiêu nhiều nhất</option>
            <option value="lessSpent">Chi tiêu ít nhất</option>
            <option value="muchOrders">Đặt hàng nhiều nhất</option>
            <option value="lessOrders">Đặt hàng ít nhất</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}