import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createVoucher } from '../../../store/admin/voucher-slice';
import { X, Calendar, Percent, DollarSign } from 'lucide-react';
import { inputCheckboxClass } from '../../../config';

export default function CreateVoucherModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.adminVoucher);
  
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderValue: '',
    startDate: '',
    endDate: '',
    usageLimit: 1,
    perUserLimit: 1,
    isActive: true
  });

  const [errors, setErrors] = useState({});

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
    
    try {
      await dispatch(createVoucher(submitData)).unwrap();
      onClose();
      resetForm();
    } catch (error) {
      console.log(error);
      
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      maxDiscountAmount: '',
      minOrderValue: '',
      startDate: '',
      endDate: '',
      usageLimit: 1,
      perUserLimit: 1,
      isActive: true
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-400">
          <h2 className="text-xl font-semibold text-gray-900">Tạo Voucher Mới</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-900 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã Voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border outline-none rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.code ? 'border-red-500' : 'border-slate-500'
                }`}
                placeholder="VD: SALE20"
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full outline-none px-3 py-2 border border-slate-500 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent"
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full outline-none px-3 py-2 border border-slate-500 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent"
              placeholder="Mô tả về voucher này..."
            />
          </div>

          {/* Discount Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  {formData.discountType === 'percentage' ? (
                    <Percent size={16} className="text-green-600" />
                  ) : (
                    <DollarSign size={16} className="text-blue-600" />
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
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.discountValue ? 'border-red-500' : 'border-slate-500'
                }`}
                placeholder={formData.discountType === 'percentage' ? '10' : '50000'}
              />
              {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền giảm tối đa
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.maxDiscountAmount}
                onChange={(e) => handleInputChange('maxDiscountAmount', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.maxDiscountAmount ? 'border-red-500' : 'border-slate-500'
                }`}
                placeholder="100000"
              />
              {errors.maxDiscountAmount && <p className="text-red-500 text-sm mt-1">{errors.maxDiscountAmount}</p>}
            </div>
          </div>

          {/* Order Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.minOrderValue}
              onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
              className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                errors.minOrderValue ? 'border-red-500' : 'border-slate-500'
              }`}
              placeholder="0"
            />
            {errors.minOrderValue && <p className="text-red-500 text-sm mt-1">{errors.minOrderValue}</p>}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-slate-500'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Ngày kết thúc <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-slate-500'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới hạn tổng số lần sử dụng
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                className={`w-full outline-none px-3 py-2 border rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent ${
                  errors.usageLimit ? 'border-red-500' : 'border-slate-500'
                }`}
                placeholder="0 = Không giới hạn"
              />
              {errors.usageLimit && <p className="text-red-500 text-sm mt-1">{errors.usageLimit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới hạn mỗi người dùng
              </label>
              <input
                type="number"
                min="1"
                value={formData.perUserLimit}
                onChange={(e) => handleInputChange('perUserLimit', e.target.value)}
                className="w-full outline-none px-3 py-2 border border-slate-500 rounded-sm focus:ring-1 focus:ring-slate-800 focus:border-transparent"
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
            <label htmlFor="isActive" className="text-[16px] font-medium text-gray-700">
              Kích hoạt voucher ngay
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-900 bg-slate-100 rounded-sm hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo Voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}