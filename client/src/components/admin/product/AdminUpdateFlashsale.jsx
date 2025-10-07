import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFlashsaleProducts } from "../../../store/admin/products-slice";
import { toast } from "react-toastify";

export default function AdminUpdateFlashsale({selectedProductFlashsale,setSelectedProductFlashsale,onBack}) {
  const dispatch = useDispatch()
  const [flashSale, setFlashSale] = useState({
    startDate: null,
    endDate: null,
    discountPercent: 0,
  });

 const handleUpdateFlashSale = () => {
  if (!selectedProductFlashsale.length) {
    toast.warn("Bạn chưa chọn sản phẩm nào");
    return;
  }

  const { startDate, endDate } = flashSale;

  if (!startDate || new Date(startDate) > new Date(endDate)) {
    toast.warn("Vui lòng chọn ngày bắt đầu hợp lệ");
    return;
  }

  if (!endDate || new Date(endDate) < new Date()) {
    toast.warn("Vui lòng chọn ngày kết thúc hợp lệ");
    return;
  }

  if(flashSale.discountPercent <=0 || flashSale.discountPercent >= 100 ){
    toast.warn("Vui lòng chọn giảm giá hợp lệ");
    return;
  }

  dispatch(
    updateFlashsaleProducts({
      productIds: selectedProductFlashsale,
      flashSaleData: flashSale, // {isActive, discountPercent, startDate, endDate}
    })
);
setSelectedProductFlashsale([])
onBack()

};

  return (
    <div className="flex flex-col mt-6 gap-6 sm:ml-20">
      <div>
        <label className="block mb-1">Giảm giá (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={flashSale.discountPercent || ""} 
          onChange={(e) =>
            setFlashSale((prev) => ({
              ...prev,
              discountPercent: Number(e.target.value),
            }))
          }
          className="w-fit border rounded p-2"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block mb-1">Ngày bắt đầu</label>
          <input
            type="datetime-local"
            value={flashSale.startDate ? flashSale.startDate.slice(0, 16) : ""}
            onChange={(e) =>
              setFlashSale((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Ngày kết thúc</label>
          <input
            type="datetime-local"
            value={flashSale.endDate ? flashSale.endDate.slice(0, 16) : ""}
            onChange={(e) =>
              setFlashSale((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
                onClick={handleUpdateFlashSale}
                className="mt-6 w-fit px-4 py-2 bg-green-600 text-white 
                           hover:bg-green-700 rounded-sm transition-colors font-medium"
                >
                  Cập nhật FLASHSALE 
                </button>
    </div>
  );
}
