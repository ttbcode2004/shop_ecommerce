import  { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { adminSelectClass, inputSearchAdminClass } from "../../../config";

export default function AdminVoucherFilter({ onFilter, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    discountType: "",
    dateRange: "",
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "",
      discountType: "",
      dateRange: "",
    };
    setFilters(clearedFilters);
    setSearchTerm("");
    onFilter?.(clearedFilters);
    onSearch?.("");
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value) || searchTerm;

  return (
    <div className="flex flex-col items-end lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã voucher hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={inputSearchAdminClass}
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-[16px] font-medium text-gray-900 mb-2">
          Trạng thái
        </label>
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={adminSelectClass}
          >
            <option value="">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="expired">Đã hết hạn</option>
            <option value="disabled">Đã vô hiệu hóa</option>
            <option value="used_up">Đã hết lượt</option>
          </select>

          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
       
        </div>
      </div>

      {/* Discount Type Filter */}
      <div>
        <label className="block text-[16px] font-medium text-gray-900 mb-2">
          Loại giảm giá
        </label>
        <div className="relative">
          <select
            value={filters.discountType}
            onChange={(e) => handleFilterChange("discountType", e.target.value)}
            className={adminSelectClass}
          >
            <option value="">Tất cả</option>
            <option value="percentage">Phần trăm (%)</option>
            <option value="fixed">Số tiền cố định</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-[16px] font-medium text-gray-900 mb-2">
          Thời gian
        </label>
        <div className="relative">
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            className={adminSelectClass}
          >
            <option value="">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_year">Năm này</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="flex gap-2">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-sm border border-red-200 hover:bg-red-100 transition-colors"
          >
            <X size={16} />
            Xóa lọc
          </button>
        )}
      </div>
    </div>
  );
}
