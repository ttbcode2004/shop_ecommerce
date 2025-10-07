import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {CreditCard, Search,} from "lucide-react";
import { inputSearchAdminClass } from "../../../config";
import Loader from "../../ui/Loader";
import OrderCard from "./OrderCard";
import OrderDetails from "./OrderDetails";
import CreateReview from "./CreateReview";

const ShoppingOrdersHistory = () => {
  const { isLoading, orderList } = useSelector((state) => state.shopOrder);
  const navigate = useNavigate();

  const [ordersHistory, setOrdersHistory] = useState([]);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState({});
  const [idxProduct, setIdxProduct] = useState(0);
  const [orderId, setOrderId] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (orderList?.length) {
      setOrdersHistory(orderList.filter((order) => (order.payment && order.isReceive) || order.status === "cancelled"));
    }
  }, [orderList]);

  const totalOrders = ordersHistory?.reduce((sum, order) => sum + order.products.length, 0) || 0;

  const filteredOrders = useMemo(() => {
    if (!ordersHistory?.length) return [];

    let filtered = ordersHistory.filter((order) => {

      const matchesSearch = searchTerm === "" ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let matchesDate = true;

      switch (dateFilter) {
        case "last7days":
          matchesDate = now - orderDate <= 7 * 24 * 60 * 60 * 1000;
          break;
        case "last30days":
          matchesDate = now - orderDate <= 30 * 24 * 60 * 60 * 1000;
          break;
        case "last3months":
          matchesDate = now - orderDate <= 90 * 24 * 60 * 60 * 1000;
          break;
        case "lastyear":
          matchesDate = now - orderDate <= 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesDate;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.totalPrice - a.totalPrice;
        case "lowest":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [ordersHistory, searchTerm, dateFilter, sortBy]);

  const handleViewDetails = (order) => {
    setIsDetailsOpen(true);
    setSelectedOrder(order)
  };

  const handleReview = (product, idx, orderId) => {
    setIsReviewsOpen(true);
    setSelectedReview(product)
    setIdxProduct(idx)
    setOrderId(orderId)
  };

  if(isLoading) {
      return <Loader isLoading={isLoading}/>
    }

  if (!ordersHistory?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 p-6">
        <CreditCard size={64} className="mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2">Chưa có lịch sử mua hàng</h3>
        <p className="text-center max-w-md">
          Bạn chưa có đơn hàng nào đã thanh toán. Hãy mua sắm và thanh toán để
          xem lịch sử tại đây!
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
    <div className="mb-8">

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-2">
          Lịch sử mua hàng <span className=" text-[18px] text-gray-700">({totalOrders} sản phẩm)</span>
        </h2>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
              className={`${inputSearchAdminClass}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2 h-fit py-2 outline-none border border-gray-300 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-slate-800 text-[16px]"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="last7days">7 ngày qua</option>
              <option value="last30days">30 ngày qua</option>
              <option value="last3months">3 tháng qua</option>
              <option value="lastyear">1 năm qua</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 h-fit py-2 outline-none border border-gray-300 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-slate-800 text-[16px]"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Giá cao nhất</option>
              <option value="lowest">Giá thấp nhất</option>
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
              onReview={handleReview}
    
            />
          ))}

          {/* Load More Button (if needed) */}
          {filteredOrders.length >= 10 && (
            <div className="text-center py-6">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Tải thêm đơn hàng
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-center">
            Không có đơn hàng nào phù hợp với bộ lọc hiện tại. Hãy thử điều
            chỉnh bộ lọc.
          </p>
        </div>
      )}

      {isDetailsOpen && (
        <OrderDetails 
          onClose={() => setIsDetailsOpen(false)} 
          order={selectedOrder}
        />
      )}

      {isReviewsOpen && (
        <CreateReview
          onClose={() => setIsReviewsOpen(false)} 
          product={selectedReview}
          orderId={orderId}
          idxProduct={idxProduct}
        />
      )}
    </div>
  );
};

export default ShoppingOrdersHistory;
