import { useSelector } from "react-redux";
import { Download } from "lucide-react";
import DateSelector from "./DateSelector";

const TabButton = ({ id, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 rounded-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-800 bg-white hover:text-gray-900 hover:bg-slate-100 hover:shadow-sm border border-slate-300"
    }`}
  >
    {label}
  </button>
);

export default function AdminDashboardHeader({ activeTab, setActiveTab, dateRange, onChange}) {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  
  let headerDate = null;

  if (dateRange.currentSelect === "select") {
  if (dateRange.day) {
    headerDate = `Trong ngày ${dateRange.day}/${dateRange.month}/${dateRange.year}`;
  } else if (dateRange.month) {
    headerDate = `Trong tháng ${dateRange.month}/${dateRange.year}`;
  } else {
    headerDate = `Trong năm ${dateRange.year}`;
  }
  } else if (dateRange.currentSelect === "inputDate") {
    headerDate = `Trong ngày ${dateRange.date}`;
  }

  const DASHBOARD_TABS = {
    OVERVIEW: 'overview',
    ORDERS: 'orders',
    PRODUCTS: 'products',
    USERS: 'users',
    REVIEWS: 'reviews',
    VOUCHERS: 'vouchers',
    REPORT: 'report',
  };

  const handleExport = () => {
    console.log("Exporting dashboard data...");
  };

  return (
    <div className="border-b bg-white border-gray-200 sticky top-0 z-10 mb-6">
      <div className="">
        <div className={`flex items-center justify-between mb-6  ${!sidebarOpen ? "ml-20" : ""}`}>
          <h1 className="text-2xl font-bold text-gray-900">
            DASHBOARD
            <p className="text-[18px] font-medium text-gray-700">{headerDate}</p>
          </h1>

          <DateSelector dateRange={dateRange} onChange={onChange}/>
         
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          <TabButton
            id={DASHBOARD_TABS.OVERVIEW}
            label="Tổng quan"
            active={activeTab === DASHBOARD_TABS.OVERVIEW}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.ORDERS}
            label="Đơn hàng"
            active={activeTab === DASHBOARD_TABS.ORDERS}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.PRODUCTS}
            label="Sản phẩm"
            active={activeTab === DASHBOARD_TABS.PRODUCTS}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.USERS}
            label="Khách hàng"
            active={activeTab === DASHBOARD_TABS.USERS}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.REVIEWS}
            label="Đánh giá"
            active={activeTab === DASHBOARD_TABS.REVIEWS}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.VOUCHERS}
            label="Voucher"
            active={activeTab === DASHBOARD_TABS.VOUCHERS}
            onClick={setActiveTab}
          />
          <TabButton
            id={DASHBOARD_TABS.REPORT}
            label="Xuất báo cáo"

            active={activeTab === DASHBOARD_TABS.REPORT}
            onClick={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}
