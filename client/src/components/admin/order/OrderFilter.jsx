import { ChevronDown, Search } from "lucide-react";
import { adminSelectClass, statusList, inputSearchAdminClass } from "../../../config";

export default function OrderFilter({ filters, setFilters }) {
 
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div className="">
      <div className="flex w-full flex-row gap-4 items-center">
        <div className="relative items-center flex w-full ">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng hoặc gmail khách hàng..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className= {inputSearchAdminClass}
          />
        </div>
        <div className="flex gap-2 ">
          <div className="relative">
            <select
                value={filters.status || "all"}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    e.target.value
                  )
                }
              className={adminSelectClass}
            >
              <option value="all">Tất cả</option>
              {statusList.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

               <div className="relative">
            <select
                value={filters.payment}
                onChange={(e) => handleFilterChange("payment", e.target.value)}
              className={adminSelectClass}
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
              className={adminSelectClass}
            >
              <option value="all">Tất cả PT</option>
              <option value="cod">COD</option>
              <option value="momo">MOMO</option>
              <option value="vnpay">VNPAY</option>

            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
                value={filters.sortDate}
                onChange={(e) => handleFilterChange("sortDate", e.target.value)}
              className={adminSelectClass}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="today">Hôm nay</option>
              <option value="3days">3 ngày</option>
              <option value="7days">7 ngày</option>
              <option value="1month">1 tháng</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div> 
        </div>
      </div>
    </div>
  );
}
