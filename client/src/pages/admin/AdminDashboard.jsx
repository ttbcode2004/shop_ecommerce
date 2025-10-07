import { useState, useCallback, useMemo } from 'react';
import AdminDashboardHeader from '../../components/admin/dashboard/AdminDashboardHeader';
import AdminDashboardOverview from '../../components/admin/dashboard/AdminDashboardOverview';
import OrdersTab from '../../components/admin/dashboard/tabs/OrdersTab';
import ProductsTab from '../../components/admin/dashboard/tabs/ProductsTab';
import UsersTab from '../../components/admin/dashboard/tabs/UsersTab';
import ReviewsTab from '../../components/admin/dashboard/tabs/ReviewsTab';
import VouchersTab from '../../components/admin/dashboard/tabs/VouchersTab';
import AdminReport from '../../components/admin/dashboard/AdminReport';

const DASHBOARD_TABS = {
  OVERVIEW: 'overview',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  USERS: 'users',
  REVIEWS: 'reviews',
  VOUCHERS: 'vouchers',
  REPORT: 'report',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.OVERVIEW);

   const [dateRange, setDateRange] = useState({
    year: new Date().getFullYear(),
    month:"",
    day:"",
    date: "",
    currentSelect: "select",
  });

  const handleDateChange = (selected, newSelected) =>{
    setDateRange({...selected, currentSelect: newSelected})
  }

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case DASHBOARD_TABS.OVERVIEW:
        return <AdminDashboardOverview dateRange={dateRange} />;
      case DASHBOARD_TABS.ORDERS:
        return <OrdersTab dateRange={dateRange} />;
      case DASHBOARD_TABS.PRODUCTS:
        return <ProductsTab/>;
      case DASHBOARD_TABS.USERS:
        return <UsersTab dateRange={dateRange}/>;
      case DASHBOARD_TABS.REVIEWS:
        return <ReviewsTab dateRange={dateRange}/>;
      case DASHBOARD_TABS.VOUCHERS:
        return <VouchersTab/>;
      case DASHBOARD_TABS.REPORT:
        return <AdminReport dateRange={dateRange}/>;
      default:
        return <AdminDashboardOverview dateRange={dateRange} />;
    }
  }, [activeTab, dateRange]);


  return (
    <div className="min-h-screen w-full px-4">
      <div className="">
        <AdminDashboardHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          dateRange={dateRange}
          onChange={handleDateChange}
        />
        

          <div className="">
            {tabContent}
          </div>
   
      </div>
    </div>
  );
}

