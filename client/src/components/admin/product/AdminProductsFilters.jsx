import { useState } from "react";
import { ChevronDown, Search, Filter, X } from "lucide-react";
import { categoryList, peopleList, adminSelectClass, inputSearchAdminClass } from "../../../config";

export default function AdminProductsFilters({ filters, onFilterChange }) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const resetFilters = () => {
    onFilterChange("search", "");
    onFilterChange("category", []);
    onFilterChange("people", []);
    onFilterChange("sort", "newest");
    onFilterChange("priceRange", "all");
    onFilterChange("flashSale", "all");
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.category.length > 0 ||
      filters.people.length > 0 ||
      filters.priceRange !== "all" ||
      filters.flashSale !== "all"
    );
  };

  return (
    <div className="py-2 px-4 mt-2">
      <div className="flex gap-4 item-">
        <div className="relative mb-4 min-w-90">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className={inputSearchAdminClass}
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
                   hover:text-gray-900 hover:bg-slate-100 rounded-sm transition-colors"
          >
            <Filter size={16} />
            Bộ lọc nâng cao
            <ChevronDown
              size={16}
              className={`transition-transform ${
                showAdvancedFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 
                     hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
            >
              <X size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="flex h-fit gap-4">
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange("sort", e.target.value)}
              className={adminSelectClass}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ Nhất</option>
              <option value="priceAsc">Giá thấp đến cao</option>
              <option value="priceDesc">Giá cao đến thấp</option>
              <option value="soldDesc">Bán nhiều nhất</option>
              <option value="soldAsc">Bán ít nhất</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.priceRange}
              onChange={(e) => onFilterChange("priceRange", e.target.value)}
              className={adminSelectClass}
            >
              <option value="all">Tất cả giá</option>
              <option value="below100">Dưới 100k</option>
              <option value="100to500">100k - 500k</option>
              <option value="500to1000">500k - 1 triệu</option>
              <option value="above1000">Trên 1 triệu</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className=" py-2 border-t border-gray-200">
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Danh mục
              </label>
              <div className="relative">
                <select
                  value={filters.category[0] || "all"}
                  onChange={(e) =>
                    onFilterChange(
                      "category",
                      e.target.value === "all" ? [] : [e.target.value]
                    )
                  }
                  className={adminSelectClass}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categoryList.map((c) => (
                    <option key={c.slug} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Đối tượng
              </label>
              <div className="relative">
                <select
                  value={filters.people[0] || "all"}
                  onChange={(e) =>
                    onFilterChange(
                      "people",
                      e.target.value === "all" ? [] : [e.target.value]
                    )
                  }
                  className={adminSelectClass}
                >
                  <option value="all">Tất cả đối tượng</option>
                  {peopleList.map((p) => (
                    <option key={p.slug} value={p.value}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                Flash Sale
              </label>
              <div className="relative">
                <select
                  value={filters.flashSale}
                  onChange={(e) => onFilterChange("flashSale", e.target.value)}
                  className={adminSelectClass}
                >
                  <option value="all">Tất cả</option>
                  <option value="only">Chỉ Flash Sale</option>
                  <option value="none">Không Flash Sale</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
