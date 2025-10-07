import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../store/admin/order-slice";
import { getAllSubOrders } from "../../store/admin/subOrder-slice";
import OrderHeader from "../../components/admin/order/OrderHeader";
import OrderFilter from "../../components/admin/order/OrderFilter";
import AdminOrderList from "../../components/admin/order/AdminOrderList";
import Loader from "../../components/ui/Loader";
import Loader1 from "../../components/ui/Loader1";

export default function AdminOrders() {
  const { isLoadingOrders, isUpdatingOrder, orderList } = useSelector((state) => state.adminOrder);
  const { isLoadingSubOrders, isUpdatingSubOrder, subOrderList } = useSelector((state) => state.adminSubOrder);
  const dispatch = useDispatch();
  const [isUser, setIsUser] = useState(true)

  const isLoading = isLoadingOrders || isLoadingSubOrders || false;
  const isLoadingAction = isUpdatingOrder || isUpdatingSubOrder || false;
  
  const currentList = isUser ? orderList : subOrderList
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    payment: "all",
    paymentMethod: "all",
    sortDate: "newest",
  });

  const filteredOrders = [...(currentList || [])]
    .filter((order) => {
      // 1. Tìm kiếm theo tên hoặc email
      const searchText = filters.search.toLowerCase();

      const matchSearch =
        order.user?.name?.toLowerCase().includes(searchText) ||
        order.user?.email?.toLowerCase().includes(searchText) ||
        order._id?.toLowerCase().includes(searchText);

      // 2. Lọc theo trạng thái (status)
      const matchStatus =
        filters.status === "all" || order.status === filters.status;
      // console.log(matchStatus);

      // 3. Lọc theo trạng thái thanh toán (payment: true/false/all)
      const matchPayment =
        filters.payment === "all" ||
        (filters.payment === "paid" && order.payment === true) ||
        (filters.payment === "unpaid" && order.payment === false);

      // 4. Lọc theo phương thức thanh toán (paymentMethod: vnpay, momo, home, all)
      const matchPaymentMethod =
        filters.paymentMethod === "all" ||
        order.paymentMethod === filters.paymentMethod;

      // 5. Lọc theo khoảng thời gian
      let matchDate = true;
      if (filters.sortDate === "today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // 00:00:00 hôm nay

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); // 23:59:59 hôm nay

        matchDate =
          new Date(order.createdAt) >= startOfToday &&
          new Date(order.createdAt) <= endOfToday;
      }
      if (filters.sortDate === "3days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3);
        matchDate = new Date(order.createdAt) >= sevenDaysAgo;
      }
      if (filters.sortDate === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchDate = new Date(order.createdAt) >= sevenDaysAgo;
      }
      if (filters.sortDate === "1month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        matchDate = new Date(order.createdAt) >= oneMonthAgo;
      }

      return (
        matchSearch &&
        matchStatus &&
        matchPayment &&
        matchPaymentMethod &&
        matchDate
      );
    })
    .sort((a, b) => {
      if (filters.sortDate === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (filters.sortDate === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  useEffect(() => {
    if (!orderList || orderList.length === 0) {
      dispatch(getAllOrders());
    }
  }, [dispatch, orderList]);

  useEffect(() => {
    if (!subOrderList || subOrderList.length === 0) {
      dispatch(getAllSubOrders());
    }
  }, [dispatch, subOrderList]);

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="flex flex-col gap-4 w-full px-2 relative">
      {isLoadingAction && <Loader1 isLoading={isLoadingAction} />}

      <OrderHeader isUser={isUser} setIsUser={setIsUser} orderList={filteredOrders}/>
      <OrderFilter
        filters={filters}
        setFilters={setFilters}
        
      />
      {filteredOrders.length > 0 ? (
        <AdminOrderList isUser={isUser} orderList={filteredOrders} />
      ) : (
        <p>Không có đơn hàng nào</p>
      )}
    </div>
  );
}
