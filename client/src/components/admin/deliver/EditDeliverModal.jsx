import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliver } from '../../../store/admin/deliver-slice';
import { X, DollarSign, FileText } from 'lucide-react';

export default function EditDeliverModal({ isOpen, onClose, deliver }) {
  const dispatch = useDispatch();
  const { isLoadingActions } = useSelector(state => state.adminDeliver);

  const [formData, setFormData] = useState({
    deliverFee: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deliver) {
      setFormData({
        deliverFee: deliver.deliverFee || '',
        description: deliver.description || '',
      });
    }
  }, [deliver]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.deliverFee || Number(formData.deliverFee) <= 0) {
      newErrors.deliverFee = 'Phí vận chuyển phải lớn hơn 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      deliverFee: Number(formData.deliverFee),
      description: formData.description.trim(),
    };

    try {
      await dispatch(updateDeliver({ id: deliver._id, formData: payload })).unwrap();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-400">
          <h2 className="text-lg font-semibold text-gray-900">Chỉnh sửa phí vận chuyển</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-900 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" />
                Phí vận chuyển <span className="text-red-500">*</span>
              </div>
            </label>
            <input
              type="number"
              min="1"
              value={formData.deliverFee}
              onChange={(e) => handleInputChange('deliverFee', e.target.value)}
              className={`w-full px-3 py-2 border rounded-sm outline-none focus:ring-1 focus:ring-slate-800 ${
                errors.deliverFee ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập phí vận chuyển"
            />
            {errors.deliverFee && <p className="text-red-500 text-sm mt-1">{errors.deliverFee}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Mô tả <span className="text-red-500">*</span>
              </div>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-sm outline-none focus:ring-1 focus:ring-slate-800 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập mô tả về phí vận chuyển..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-900 bg-slate-100 rounded-sm hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoadingActions}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoadingActions ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
