import { useState, useEffect } from "react";

export default function AddressNotUser({ onAddressChange, initialAddress = {} }) {
  const [formData, setFormData] = useState({
    fullName: initialAddress.fullName || "",
    phone: initialAddress.phone || "",
    street: initialAddress.street || "",
    commune: initialAddress.commune || "",
    city: initialAddress.city || "",
    notes: initialAddress.notes || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Tên phải có ít nhất 3 ký tự";
    }
    
    if (!/^0[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0";
    }
    
    if (!formData.street || formData.street.trim().length < 5) {
      newErrors.street = "Vui lòng nhập địa chỉ chi tiết (ít nhất 5 ký tự)";
    }
    
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = "Vui lòng nhập Tỉnh/Thành phố";
    }
    
    if (!formData.commune || formData.commune.trim().length < 2) {
      newErrors.commune = "Vui lòng nhập Quận/Huyện/Xã";
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validate();
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [formData]);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({
        address: formData,
        isValid: isValid && Object.keys(validate()).length === 0
      });
    }
  }, [formData, isValid, onAddressChange]);

  const inputClassName = (fieldName) => 
    `w-full border border-slate-500 rounded-sm p-2 focus:outline-none focus:ring-1 transition-colors ${
      errors[fieldName] 
        ? "border-red-500 focus:ring-red-200" 
        : "border-slate-800 focus:ring-slate-800 focus:border-slate-800"
    }`;

  return (
    <div className="space-y-4 ">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          placeholder="Nhập họ và tên đầy đủ"
          value={formData.fullName}
          onChange={handleChange}
          className={inputClassName('fullName')}
        />
      </div>

      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="0123456789"
          value={formData.phone}
          onChange={handleChange}
          className={inputClassName('phone')}
          maxLength="10"
        />
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ chi tiết <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="street"
          placeholder="Số nhà, tên đường"
          value={formData.street}
          onChange={handleChange}
          className={inputClassName('street')}
        />
      </div>

      {/* Tỉnh/Thành phố và Quận/Huyện */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            placeholder="Ví dụ: Hồ Chí Minh"
            value={formData.city}
            onChange={handleChange}
            className={inputClassName('city')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quận/Huyện/Xã <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="commune"
            placeholder="Ví dụ: Quận 1"
            value={formData.commune}
            onChange={handleChange}
            className={inputClassName('commune')}
          />
        </div>
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          name="notes"
          placeholder="Ghi chú thêm về địa chỉ (tùy chọn)"
          value={formData.notes}
          onChange={handleChange}
          rows="2"
          className="w-full border border-slate-500 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 resize-none"
        />
      </div>

      {/* Validation status indicator */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600 font-medium">
            Vui lòng kiểm tra lại thông tin:
          </p>
          <ul className="text-sm text-red-500 mt-1 list-disc list-inside">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {isValid && Object.keys(errors).length === 0 && formData.fullName && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-600 font-medium">
            ✓ Thông tin địa chỉ hợp lệ
          </p>
        </div>
      )}
    </div>
  );
}