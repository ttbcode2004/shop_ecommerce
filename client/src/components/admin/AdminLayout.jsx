import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { clearDashboardErrors } from "../../store/admin/dashboard-slice";
import { clearProductErrors, clearProductSuccess } from "../../store/admin/products-slice";
import { clearOrderErrors } from "../../store/admin/order-slice";
import { clearSubOrderErrors } from "../../store/admin/subOrder-slice";
import { clearUserErrors, clearUserSuccess } from "../../store/admin/user-slice";
import { clearVoucherErrors, clearVoucherSuccess } from "../../store/admin/voucher-slice";
import { toast } from "react-toastify";
import AdminSidebar from "./AdminSidebar";
import ScrollToTop from "../ui/ScrollToTop";
import { clearDeliverErrors, clearDeliverSuccess } from "../../store/admin/deliver-slice";
import { clearAccountErrors, clearAccountSuccess } from "../../store/admin/account-slice";

export default function AdminLayout() {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const { dashboardError} = useSelector((state) => state.adminDashboard);

  const { errorProducts, successActionProduct} = useSelector((state) => state.adminProducts);
  const { errorOrders} = useSelector((state) => state.adminOrder);
  const { errorSubOrders} = useSelector((state) => state.adminSubOrder);
  const { errorUsers, successUsers} = useSelector((state) => state.adminUser);
  const { errorVouchers, successVouchers} = useSelector((state) => state.adminVoucher);
  const { errorDelivers, successDelivers} = useSelector((state) => state.adminDeliver);
  const { errorAccount, successAccount} = useSelector((state) => state.adminAccount);

  const messages = [
    {type: "error", value: dashboardError, clear: clearDashboardErrors},

    {type: "error", value: errorProducts , clear: clearProductErrors},
    {type: "success", value: successActionProduct, clear: clearProductSuccess},

    {type: "error", value: errorOrders, clear: clearOrderErrors},
    {type: "error", value: errorSubOrders, clear: clearSubOrderErrors},

    {type: "error", value: errorUsers, clear: clearUserErrors},
    {type: "success", value: successUsers, clear: clearUserSuccess},
    
    {type: "error", value: errorVouchers, clear: clearVoucherErrors},
    {type: "success", value: successVouchers, clear: clearVoucherSuccess},
    
    {type: "error", value: errorDelivers, clear: clearDeliverErrors},
    {type: "success", value: successDelivers, clear: clearDeliverSuccess},
    
    {type: "error", value: errorAccount, clear: clearAccountErrors},
    {type: "success", value: successAccount, clear: clearAccountSuccess},

  ]

  const activeMessages = messages.filter(m => m.value);
  
    useEffect(() => {
      activeMessages.forEach(msg => {
        toast[msg.type](msg.value);
        dispatch(msg.clear());
      });
    }, [activeMessages, dispatch]);

  return (
    <div className="flex min-h-screen w-full relative bg-white">
      <AdminSidebar />

      <main className={`flex-1 flex p-4 md:px-6 ${sidebarOpen ? "lg:ml-60":""}`}>
        <ScrollToTop /> 
        <Outlet />
      </main>
    </div>
  );
}
