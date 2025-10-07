import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId } from "../../../store/shop/order-slice";
import { Search, Filter, Package } from "lucide-react";
import { inputSearchAdminClass } from "../../../config";
import Loader from "../../ui/Loader";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";

const getStatusOptions = () => [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "processing", label: "Chờ xử lý" },
  { value: "order placed", label: "Đã đặt" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
];

const ShoppingOrders = () => {
  const {isLoading, orderList } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [orders, setOrders] = useState([]);
  
  const totalOrders = orders?.reduce((sum, order) => sum + order.products.length, 0) || 0;
  
  const filteredOrders = useMemo(() => {
    if (!orders?.length) return [];

    let filtered = orders.filter((order) => {
      const matchesSearch = searchTerm === "" || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderCode?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      const matchesPayment = paymentFilter === "all" || 
        (paymentFilter === "paid" && order.payment) ||
        (paymentFilter === "unpaid" && !order.payment);

      return matchesSearch && matchesStatus && matchesPayment;
    });
    return filtered;
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const handleViewDetails = (order) => {
    setIsDetailsOpen(true);
    setSelectedOrder(order)
  };

  useEffect(() => {
    dispatch(getAllOrdersByUserId());
  }, [dispatch]);
  
  useEffect(() => {
    if (orderList?.length) {
      setOrders(orderList.filter((order) => !order.isReceive && (order.status !== "cancelled")));
    }
  }, [orderList]);
  

  if(isLoading) {
    return <Loader isLoading={isLoading}/>
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-900 ">
        <Package size={64} className="mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
        <p className="text-center max-w-md">
          Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm những sản phẩm yêu thích!
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className=" w-full mb-8">
      <div className="mb-2">
        <h2 className="text-[20px] font-semibold text-gray-900">
          Đơn hàng của tôi <span className="text-[18px] text-gray-700">({totalOrders} sản phẩm)</span>
        </h2>
      </div>

      <div className="py-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
              className= {`${inputSearchAdminClass}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 outline-none border border-gray-300 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-slate-800 text-[16px]"
            >
              {getStatusOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="p-2 outline-none border border-gray-300 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-slate-800 text-[16px]"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Filter size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-center">
            Không có đơn hàng nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc.
          </p>
        </div>
      )}

      {isDetailsOpen && (
        <OrderDetails 
          onClose={() => setIsDetailsOpen(false)} 
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default ShoppingOrders;