import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVouchers } from "../../../store/shop/voucher-slice";
import { formatPrice } from "../../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import Loader from "../../ui/Loader";

export default function ShoppingVoucher() {
  const { voucherList, isLoading } = useSelector((state) => state.shopVoucher);
  const dispatch = useDispatch();
  const navigate = useNavigate()
 
  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]); 
  
  if(isLoading){
    return <Loader isLoading={isLoading}/>
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Danh sách Voucher <span className="text-gray-700">({voucherList.total})</span></h2>

      {voucherList.vouchers?.length === 0 && <p>Không có voucher nào.</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {voucherList?.vouchers?.map((voucher) => (
          <div
            key={voucher._id}
            className="border space-y-1 font-medium border-slate-200 rounded-sm p-3 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center ">
              <span className="font-bold text-lg">{voucher.code}</span>
              <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-sm font-medium">
                -{voucher.discountType === "percentage"
                  ? `${voucher.discountValue}%`
                  : `${formatPrice(voucher.discountValue)}`}
              </span>
            </div>

            <p className="text-gray-900">{voucher.description}</p>

            <p className="text-[16px] text-gray-800">
              Giảm tối đa: <span className="text-orange-500">{formatPrice(voucher.maxDiscountAmount)}</span>
            </p>
            <p className="text-[16px] text-gray-800">
              Đơn tối thiểu: <span className="text-orange-500">{formatPrice(voucher.minOrderValue)}</span>
            </p>
            
            <div className="flex justify-between items-center mt-[-6px]">
                <p className="text-sm text-gray-800">
                    Hạn:{" "}
                    {new Date(voucher.startDate).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                </p>
                <button 
                onClick={()=>{navigate("/")}}
                className="px-2 py-1 rounded-sm bg-orange-700 text-white hover:bg-orange-800 transition-colors">
                    Mua Ngay
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
