import { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { updateVoucher } from '../../../store/admin/voucher-slice';
import { X, Calendar, Percent} from 'lucide-react';
import { inputCheckboxClass } from '../../../config';

export default function EditVoucherModal({ isOpen, onClose, voucher }) {

  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    perUserLimit: 1,
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // Populate form data when voucher changes
  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code || '',
        description: voucher.description || '',
        discountType: voucher.discountType || 'percentage',
        discountValue: voucher.discountValue || '',
        maxDiscountAmount: voucher.maxDiscountAmount || '',
        minOrderValue: voucher.minOrderValue || '',
        startDate: voucher.startDate ? new Date(voucher.startDate).toISOString().slice(0, 16) : '',
        endDate: voucher.endDate ? new Date(voucher.endDate).toISOString().slice(0, 16) : '',
        usageLimit: voucher.usageLimit || '',
        perUserLimit: voucher.perUserLimit || 1,
        isActive: voucher.isActive !== undefined ? voucher.isActive : true
      });
    }
  }, [voucher]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Mã voucher là bắt buộc';
    }
    
    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Giá trị giảm giá phải lớn hơn 0';
    }
    
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Phần trăm giảm giá không được vượt quá 100%';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    
    if (formData.minOrderValue && formData.minOrderValue < 0) {
      newErrors.minOrderValue = 'Giá trị đơn hàng tối thiểu không được âm';
    }

    if (formData.maxDiscountAmount && formData.maxDiscountAmount <= 0) {
      newErrors.maxDiscountAmount = 'Số tiền giảm tối đa phải lớn hơn 0';
    }

    if (formData.usageLimit && formData.usageLimit <= 0) {
      newErrors.usageLimit = 'Giới hạn sử dụng phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      discountValue: Number(formData.discountValue),
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0,
      perUserLimit: Number(formData.perUserLimit)
    };

    
    dispatch(updateVoucher({ id: voucher._id, data: submitData }));
    onClose();
  
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !voucher) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-400">
          <h2 className="text-xl font-semibold text-gray-900">Chỉnh Sửa Voucher</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh)] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                Mã Voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="VD: SALE20"
              />
              {errors.code && <p className="text-red-500 text-[16px] mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full outline-none px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full outline-none px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              placeholder="Mô tả về voucher này..."
            />
          </div>

          {/* Discount Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  {formData.discountType === 'percentage' ? (
                    <Percent size={16} className="text-green-600" />
                  ) : (
                    <p className="text-blue-600" >VND</p>
                  )}
                  Giá trị giảm giá <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="number"
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
                step={formData.discountType === 'percentage' ? '0.1' : '1000'}
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.discountValue ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
              />
              {errors.discountValue && <p className="text-red-500 text-[16px] mt-1">{errors.discountValue}</p>}
            </div>

            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                Số tiền giảm tối đa
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.maxDiscountAmount}
                onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.maxDiscountAmount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100000"
              />
              {errors.maxDiscountAmount && <p className="text-red-500 text-[16px] mt-1">{errors.maxDiscountAmount}</p>}
            </div>
          </div>

          {/* Order Settings */}
          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-2">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.minOrderValue}
              onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
              className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                errors.minOrderValue ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.minOrderValue && <p className="text-red-500 text-[16px] mt-1">{errors.minOrderValue}</p>}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-[16px] mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Ngày kết thúc <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-[16px] mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                Giới hạn tổng số lần sử dụng
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent ${
                  errors.usageLimit ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0 = Không giới hạn"
              />
              {errors.usageLimit && <p className="text-red-500 text-[16px] mt-1">{errors.usageLimit}</p>}
            </div>

            <div>
              <label className="block text-[16px] font-medium text-gray-900 mb-2">
                Giới hạn mỗi người dùng
              </label>
              <input
                type="number"
                min="1"
                value={formData.perUserLimit}
                onChange={(e) => handleInputChange('perUserLimit', e.target.value)}
                className="w-full outline-none px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className={inputCheckboxClass}
            />
            <label htmlFor="isActive" className="text-[16px] font-medium text-gray-900">
              Voucher đang hoạt động
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-900 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"

              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cập Nhật Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}