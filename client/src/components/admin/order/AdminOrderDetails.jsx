import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { X } from "lucide-react";
import {colorTranslate, statusList} from "../../../config"
import { formatPrice } from "../../../utils/formatPrice";

export default function AdminOrderDetails({isUser, onClose, order }) {
  if (!order) {
    return <></>;
  }
  
  // Hàm export PDF
  const handleExportPDF = async () => {
    const element = document.getElementById("order-details-pdf");

    if (!element) return;

    // Chuyển toàn bộ màu oklch về rgb
    element.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const val = style[prop];
        if (val.includes("oklch")) {
          el.style[prop] = "#000"; // hoặc đổi sang màu mặc định
        }
      });
    });

    const canvas = await html2canvas(element, { scale: 2,useCORS: true  });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    // console.log( element);
    

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order-${order._id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6 py-4">
      <div className="bg-white border border-gray-300 rounded-sm overflow-hidden shadow-lg w-full max-w-6xl max-h-[94vh] flex flex-col">
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Chi tiết đơn hàng 
          </h2>

          <div className="flex gap-4">
            <button
              onClick={handleExportPDF}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Xuất PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nội dung cần export PDF */}
        <div
          id="order-details-pdf"
          className="px-6 py-4 overflow-y-auto text-sm"
        >
          {/* User Info */}
          <div className="flex gap-6 lg:gap-12 font-medium">
            
            <div className="text-[14px] lg:text-lg">
              <h2 className="font-semibold text-sm lg:text-xl ">
                Thông tin người đặt
              </h2>
              <p>
                Mã đơn: {order._id}
              </p>
              {isUser && <>
              <p>
                Tên: {order.user?.name}
              </p>
              <p>
                Email: {order.user?.email}
              </p>
              <p>
                SĐT: {order.user?.phone}
              </p>
              </>}
            </div>

            <div className="text-[14px] lg:text-lg">
              <h2 className="font-semibold text-sm lg:text-xl ">Địa chỉ giao hàng</h2>
              <p>Tên người nhận: {order.address?.fullName}</p>
              <p>Sđt người nhận: {order.address?.phone}</p>
              <p>
                Địa chỉ: {order.address.street}, {order.address?.commune}, {order.address.city}
              </p >
              {order.address.notes && (
                <p>
                  Ghi chú: {order.address?.notes}
                </p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="mt-2">
            <h2 className="font-semibold text-lg mb-1">Sản phẩm</h2>
            <div className="flex gap-10 text-[16px] flex-wrap">
              {order.products.map((p, idx) => (
                <div key={idx} className="flex items-center py-3">
                  <img
                    src={p.image}
                    alt={p.product?.name || p.name}
                    className="w-16 h-22 object-cover rounded mr-2"
                  />
                  <div className="flex-1 text-gray-900">
                    <p className="font-medium">{p.product?.name || p.name}</p>
                    <p>
                      Size: {p.size} | Màu: {colorTranslate[p.color] ?? p.color}
                    </p>
                    <p>Số lượng: {p.quantity}</p>
                     <p className="font-semibold text-[17px]">Giá: {(formatPrice(p.price))}</p>
                  </div>
                 
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-8 mt-2">
            <div className="font-medium text-[16px]">
              <h2 className="font-semibold text-lg mb-1">Tổng kết</h2>
              <p>Tổng số lượng: {order.amount}</p>
              <p className="font-semibold text-[18px]">Tổng tiền: {formatPrice(order.totalPrice)}</p>
            </div>

            {/* Status */}
            <div className="font-medium text-[16px]">
              <h2 className="font-semibold text-lg mb-1">
                Trạng thái & Thanh toán
              </h2>
              <div className="flex gap-6 items-start">
                <div>
                  <p>Trạng thái: {statusList.find((s) => s.value === order.status)?.name || order.status}</p>
                  <p>Thanh toán: {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                </div>
                <div>
                  <p>Phương thức: {order.paymentMethod}</p>
                  <p>Ngày đặt: {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
                  {order.status === "delivered" && <p>Ngày giao: {format(new Date(order.deliveredAt), "dd/MM/yyyy HH:mm")}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
