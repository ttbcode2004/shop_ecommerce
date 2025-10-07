import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, editAddress } from "../../store/shop/address-slice";
import { X } from "lucide-react";
import { inputCheckboxClass } from "../../config";

const classInput = "w-full p-2 border border-slate-700 rounded-sm focus:outline-none focus:ring-1"

export default function AddAddress({setAddress, setIndexUpdate = null, address = {}, index = null, onClose}) {
  const { isLoading } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  const overlayRef = useRef();

  const [formData, setFormData] = useState({
    fullName: address.fullName || "",
    phone: address.phone || "",
    street: address.street || "",
    commune: address.commune || "",
    city: address.city || "",
    notes: address.notes || "",
    defaultAddress: address.defaultAddress || false,
  });

  const [errors, setErrors] = useState({});

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "Tên phải có ít nhất 3 ký tự";
    }
    if (
      !/^[0-9]{10,10}$/.test(formData.phone) ||
      !formData.phone.startsWith("0")
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.street || formData.street.length < 5) {
      newErrors.street = "Vui lòng nhập địa chỉ chi tiết";
    }
    if (!formData.city) {
      newErrors.city = "Vui lòng nhập Tỉnh/Thành phố";
    }
    if (!formData.commune) {
      newErrors.commune = "Vui lòng nhập Quận/Huyện/Xã";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if(setIndexUpdate || setAddress){
      setIndexUpdate(null);
      setAddress({});
    }
    
    if (index != null) {
      if (Object.keys(validationErrors).length === 0) {
        const result = await dispatch(editAddress({ index, formData }));
        if (result.meta.requestStatus === "fulfilled") {
          setFormData({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            commune: "",
            notes: "",
            defaultAddress: false,
          });
          onClose();
        } 
      }
    } else {
      if (Object.keys(validationErrors).length === 0) {
        const result = await dispatch(addNewAddress(formData));
        if (result.meta.requestStatus === "fulfilled") {
          setFormData({
            fullName: "",
            phone: "",
            street: "",
            city: "",
            commune: "",
            notes: "",
            defaultAddress: false,
          });
          onClose();
        } 
      }
    }
  };

  return (
    <div ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-sm ">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {index !== null ? "Cập nhật địa chỉ" : "Thêm mới địa chỉ"}
          </h2>
          <button
            onClick={() => {
              setIndexUpdate ? setIndexUpdate(null) : null, setAddress ? setAddress({}) : null, onClose();
            }}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[90vh] overflow-y-auto px-6 pb-6">
          <div>
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              className={`${classInput} ${errors.fullName ? "border-red-500" : "focus:ring-slate-800"}`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className={`${classInput} ${errors.phone ? "border-red-500" : "focus:ring-slate-800"}`}
            />
            {errors.phone && (<p className="text-sm text-red-500 mt-1">{errors.phone}</p>)}
          </div>

          <div>
            <label>Địa chỉ (số nhà, đường)</label>
            <input
              type="text"
              name="street"
              placeholder="Địa chỉ (số nhà, đường)"
              value={formData.street}
              onChange={handleChange}
              className={`${classInput} ${errors.street ? "border-red-500" : "focus:ring-slate-800" }`}
            />
            {errors.street && (<p className="text-sm text-red-500 mt-1">{errors.street}</p>)}
          </div>

          {/* City + Commune */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Tỉnh / Thành phố</label>
              <input
                type="text"
                name="city"
                placeholder="Tỉnh / Thành phố"
                value={formData.city}
                onChange={handleChange}
                className={`${classInput} ${errors.city ? "border-red-500" : "focus:ring-slate-800"}`}
              />
              {errors.city && (<p className="text-sm text-red-500 mt-1">{errors.city}</p>)}
            </div>
            <div>
              <label>Quận / Huyện / Xã</label>
              <input
                type="text"
                name="commune"
                placeholder="Quận / Huyện / Xã"
                value={formData.commune}
                onChange={handleChange}
                className={`${classInput} ${errors.commune ? "border-red-500" : "focus:ring-slate-800"}`}
              />
              {errors.commune && (<p className="text-sm text-red-500 mt-1">{errors.commune}</p>)}
            </div>
          </div>

          <div>
            <label>Ghi chú (không bắt buộc)</label>
            <input
              type="text"
              name="notes"
              placeholder="Ghi chú (không bắt buộc)"
              value={formData.notes}
              onChange={handleChange}
              className={`${classInput} focus:ring-slate-800`}
            />
          </div>

          <div className="flex items-center space-x-2 ">
            <input
              type="checkbox"
              name="defaultAddress"
              checked={formData.defaultAddress}
              onChange={handleChange}
              className={inputCheckboxClass}
            />
            <label htmlFor="defaulAddress" className="text-[16px] gray-900">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-sm transition"
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </form>
      </div>
    </div>
  );
}
