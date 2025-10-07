import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, ShoppingCart, Users, Package, DollarSign,Star,Truck,CreditCard,Tag,AlertCircle,CheckCircle} from 'lucide-react';
import { getFullReport } from '../../../store/admin/dashboard-slice';
import Loader from '../../ui/Loader';
import { formatPrice } from '../../../utils/formatPrice';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { statusList } from '../../../config';

const handleExportPDF = async () => {
  const element = document.getElementById("admin-report-pdf");
  if (!element) return;

  // Chuyển các màu oklch thành rgb (nếu có)
  element.querySelectorAll("*").forEach((el) => {
    const style = window.getComputedStyle(el);
    ["color", "backgroundColor", "borderColor"].forEach((prop) => {
      const val = style[prop];
      if (val.includes("oklch")) el.style[prop] = "#000";
    });
  });

  // Chụp lại toàn bộ vùng nội dung
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Trang đầu
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Các trang tiếp theo
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`bao-cao-${new Date().toLocaleDateString('vi-VN')}.pdf`);
};


export default function AdminReport ({ dateRange }) {
  const dispatch = useDispatch();
  const { fullReport, isLoadingFullReport } = useSelector(state => state.adminDashboard);

  useEffect(() => {
    dispatch(getFullReport({ dateRange }));
  }, [dispatch, dateRange]);

  if (isLoadingFullReport) {
    return <Loader isLoading={isLoadingFullReport} />;
  }
  
  if (!fullReport) return null;

  const { summary, orders, products, customers, payment, reviews, vouchers } = fullReport;
  console.log(orders);
  
  // Format number
  const formatNumber = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };
  
  // Stat Card Component
    const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
     const colorClasses = {
       blue: " text-blue-600",
       green: "text-green-600",
       purple: " text-purple-600",
       orange: " text-orange-600",
       red: " text-red-600"
     };
 
     return (
       <div className="bg-white rounded-sm border border-slate-200 shadow-md p-6 hover:shadow-lg transition-shadow">
         <div className="flex items-center justify-between">
           <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
             <Icon className={`${colorClasses[color]}`} size={24} />
             <p className="text-xl text-gray-900 font-medium">{title}</p>
           </div>
             <p className="text-2xl font-bold text-gray-900">{value}</p>
             {trend && trendValue !== undefined && trendValue !== null && (
               <div className="flex items-center gap-1 mt-2">
                 {trendValue > 0 ? (
                   <TrendingUp size={16} className="text-green-600" />
                 ) : trendValue < 0 ? (
                   <TrendingDown size={16} className="text-red-600" />
                 ) : null}
                 <span className={`text-sm ${trendValue > 0 ? 'text-green-600' : trendValue < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                   {Math.abs(trendValue).toFixed(1)}%
                 </span>
                 <span className="text-xs text-gray-500 ml-1">so với kỳ trước</span>
               </div>
             )}
           </div>
           
         </div>
       </div>
     );
   };

  return (
    <div className='relative'>
        <button
              onClick={handleExportPDF}
              className="absolute right-4 top-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-sm hover:bg-blue-700"
            >
              Xuất PDF
            </button>
        <div
            id="admin-report-pdf"
            className="min-h-screen "
        >
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Báo Cáo Tổng Quan</h1>
            {fullReport.dateRange && (
                <p className="text-lg text-gray-900">
                Từ {new Date(fullReport.dateRange.current.start).toLocaleDateString('vi-VN')} 
                {' đến '}
                {new Date(fullReport.dateRange.current.end).toLocaleDateString('vi-VN')}
                </p>
            )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng Doanh Thu"
                    value={formatPrice(summary?.revenue?.totalRevenue || 0)}
                    icon={DollarSign}
                    trend={summary?.growth?.revenue !== undefined}
                    trendValue={summary?.growth?.revenue}
                    color="green"
                />
                <StatCard
                    title="Tổng Đơn Hàng"
                    value={formatNumber(summary?.revenue?.totalOrders || 0)}
                    icon={ShoppingCart}
                    trend={summary?.growth?.orders !== undefined}
                    trendValue={summary?.growth?.orders}
                    color="blue"
                />
                <StatCard
                    title="Khách Hàng Mới"
                    value={formatNumber(summary?.customers?.newUsers || 0)}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="Sản Phẩm Đã Bán"
                    value={formatNumber(summary?.revenue?.totalProducts || 0)}
                    icon={Package}
                    color="orange"
                />
            </div>

            {/* Revenue Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-sm shadow-md p-6 border border-slate-200">
                <div className="mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-green-600" />
                    <h3 className='text-xl font-semibold'>Chi Tiết Doanh Thu</h3>
                </div>
                <div className="space-y-1 text-lg">
                    <div className="flex justify-between ">
                        <span className="text-gray-900">Giá trị đơn TB:</span>
                        <span className="font-semibold text-2xl">{formatPrice(summary?.revenue?.avgOrderValue)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-900">Đơn đã thanh toán:</span>
                        <span className="font-semibold text-2xl">{formatNumber(summary?.revenue?.paidOrders)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-900">Doanh thu đã thu:</span>
                        <span className="font-semibold text-green-600 text-2xl">
                        {formatPrice(summary?.revenue?.paidRevenue)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border border-slate-200">
                <div className="mb-4 flex items-center gap-2">
                    <Users size={20} className="text-purple-600" />
                    <h3 className='text-xl font-semibold'>Thống Kê Khách Hàng</h3>
                </div>
                <div className="space-y-1 text-lg">
                    <div className="flex justify-between">
                        <span className="text-gray-900">Tổng khách hàng:</span>
                        <span className="font-semibold text-2xl">{formatNumber(summary?.customers?.totalUsers)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-900">Khách hàng mới:</span>
                        <span className="font-semibold text-green-600 text-2xl">
                        {formatNumber(summary?.customers?.newUsers)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-900">Khách hàng active:</span>
                        <span className="font-semibold text-blue-600 text-2xl">
                        {formatNumber(summary?.customers?.activeUsers)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border border-slate-200">
                <div className="mb-4 flex items-center gap-2">
                    <Truck size={20} className="text-blue-600" />
                    <h3 className='text-xl font-semibold'>Tỷ Lệ Hoàn Thành</h3>
                </div>
                {orders?.completionRate && (
                <div className="space-y-1 text-lg">
                    <div className="flex justify-between">
                        <span className="text-gray-900">Đã giao:</span>
                        <span className="font-semibold text-green-600 text-xl">
                            {orders.completionRate.deliveryRate?.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-900">Đã hủy:</span>
                    <span className="font-semibold text-red-600  text-2xl">
                        {orders.completionRate.cancellationRate?.toFixed(1)}%
                    </span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-900">Đang xử lý:</span>
                    <span className="font-semibold  text-2xl">
                        {formatNumber(orders.completionRate.processing)}
                    </span>
                    </div>
                </div>
                )}
            </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-blue-600" />
                    Đơn Hàng Theo Trạng Thái
                </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {orders?.byStatus?.map((status) => (
                <div key={status._id} className="border rounded-sm border-slate-500 p-4 text-center">
                    <p className={`text-xl text-gray-900 mb-1 capitalize ${statusList.find(item => item.value === status._id).text}`}>{statusList.find(item => item.value === status._id).name}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(status.count)}</p>
                    <p className="text-2xl text-gray-900 font-medium mt-1">{formatPrice(status.totalRevenue)}</p>
                </div>
                ))}
            </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package size={20} className="text-orange-600" />
                Top 10 Sản Phẩm Bán Chạy
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="hover:bg-gray-100 border-b border-slate-500">
                    <tr>
                    <th className="px-4 py-3 text-left text-lg font-semibold text-gray-900">STT</th>
                    <th className="px-4 py-3 text-left text-lg font-semibold text-gray-900">Sản phẩm</th>
                    <th className="px-4 py-3 text-left text-lg font-semibold text-gray-900">Danh mục</th>
                    <th className="px-4 py-3 text-right text-lg font-semibold text-gray-900">Đã bán</th>
                    <th className="px-4 py-3 text-right text-lg font-semibold text-gray-900">Doanh thu</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products?.topSelling?.slice(0, 10).map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                {product.image && (
                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                                )}
                                <span className="text-[16px] font-medium">{product.name}</span>
                            </div>
                        </td>
                        <td className="px-4 py-3 text-[16px] font-medium text-gray-900">{product.category}</td>
                        <td className="px-4 py-3 text-[17px] font-medium text-right">
                        {formatNumber(product.totalQuantity)}
                        </td>
                        <td className="px-4 py-3 text-[18px] font-medium text-right text-green-600">
                        {formatPrice(product.totalRevenue)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Revenue by Category */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-16">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Tag size={20} className="text-purple-600" />
                    Doanh Thu Theo Danh Mục
                </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.byCategory?.map((cat) => (
                <div key={cat._id} className="border border-slate-500 rounded-sm p-4">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2 capitalize">{cat._id}</h4>
                    <div className="space-y-1 text-lg">
                    <p className="text-gray-900">
                        Doanh thu: <span className="font-semibold text-green-600">{formatPrice(cat.totalRevenue)}</span>
                    </p>
                    <p className="text-gray-900">
                        Đã bán: <span className="font-semibold">{formatNumber(cat.totalQuantity)}</span>
                    </p>
                    <p className="text-gray-900">
                        Đơn hàng: <span className="font-semibold">{formatNumber(cat.orderCount)}</span>
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                Top 10 Khách Hàng VIP
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="text-2xl hover:bg-gray-100 border-b border-slate-500">
                    <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Liên hệ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Đơn hàng</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Tổng chi tiêu</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-lg">
                    {customers?.top?.map((customer, index) => (
                    <tr key={customer.userId} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{customer.name}</td>
                        <td className="px-4 py-3 text-gray-900">
                        <div>{customer.email}</div>
                        <div className="">{customer.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-right">{formatNumber(customer.orderCount)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {formatPrice(customer.totalSpent)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Payment Methods & Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-sm shadow-md p-6 border border-slate-500 ">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <CreditCard size={20} className="text-green-600" />
                        Phương Thức Thanh Toán
                    </h3>
                    <div className="space-y-1 text-lg">
                    {payment?.methods?.map((method) => (
                        <div key={method._id} className="flex items-center justify-between p-3 rounded-sm ">
                        <div>
                            <p className="font-medium capitalize">{method._id}</p>
                            <p className="text-[16px] text-gray-900">
                            {formatNumber(method.count)} đơn • {formatNumber(method.paidCount)} đã thanh toán
                            </p>
                        </div>
                        <p className="font-semibold text-green-600">{formatPrice(method.totalRevenue)}</p>
                        </div>
                    ))}
                    </div>
                </div>

            <div className="bg-white rounded-sm shadow-md p-6 border border-slate-500">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    Đánh Giá Sản Phẩm
                </h3>
                <div className="space-y-3 text-lg">
                <div className="flex items-center justify-between">
                    <span className="text-gray-900">Tổng đánh giá:</span>
                    <span className="font-semibold">{formatNumber(reviews?.totalReviews)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-900">Đánh giá trung bình:</span>
                    <span className="font-semibold text-yellow-500 flex items-center gap-1">
                    {reviews?.avgRating?.toFixed(1)} <Star size={16} fill="currentColor" />
                    </span>
                </div>
                <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews?.[`rating${star}`] || 0;
                    const percentage = reviews?.totalReviews > 0 ? (count / reviews.totalReviews * 100).toFixed(1) : 0;
                    return (
                        <div key={star} className="flex items-center gap-2">
                        <span className="text-sm w-12">{star} sao</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
            </div>

            {/* Inventory Warning */}
            {products?.inventory?.lowStock?.length > 0 && (
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 border border-slate-500">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-600" />
                Cảnh Báo Tồn Kho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.inventory.lowStock.slice(0, 6).map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                    <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">
                        Còn {item.stock}
                    </span>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Vouchers */}
            {vouchers?.length > 0 && (
            <div className="bg-white rounded-sm shadow-md p-6 border border-slate-500">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Tag size={20} className="text-pink-600" />
                Voucher Đang Áp Dụng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vouchers.map((voucher) => (
                    <div key={voucher._id} className="border border-pink-200 rounded-sm p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-pink-600">{voucher.code}</h4>
                        {voucher.isActive && (
                        <CheckCircle size={16} className="text-green-600" />
                        )}
                    </div>
                    <p className="text-lg text-gray-900 mb-2">{voucher.description}</p>
                    <div className="text-lg">
                        <p className="text-gray-900">
                        Đã dùng: <span className="font-semibold">{formatNumber(voucher.usedCount)}</span>
                        {voucher.usageLimit > 0 && ` / ${formatNumber(voucher.usageLimit)}`}
                        </p>
                        {voucher.usageLimit > 0 && (
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div 
                            className="bg-pink-600 h-2 rounded-full"
                            style={{ width: `${voucher.usageRate}%` }}
                            ></div>
                        </div>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
    </div>
  );
};