import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVoucher, setSelectedVoucher } from '../../../store/admin/voucher-slice';
import { Edit2, Trash2, Copy, Calendar, Users, Percent, } from 'lucide-react';
import { format } from "date-fns";
import { formatPrice } from '../../../utils/formatPrice';
import { adminHeaderVoucher } from '../../../config';
import EditVoucherModal from './EditVoucherModal';
import DeleteConfirmModal from '../../ui/DeleteConfirmModal';
import Loader1 from '../../ui/Loader1';

export default function AdminVoucherList({ voucherList}) {
  const { isLoadingActions } = useSelector((state) => state.adminVoucher);
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucherState] = useState(null);

  const getVoucherStatus = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    
    if (!voucher.isActive) return { text: 'Chưa kích hoạt', color: 'bg-red-100 text-red-800' };
    if (now < startDate) return { text: 'Chưa bắt đầu', color: 'bg-yellow-100 text-yellow-800' };
    if (now > endDate) return { text: 'Đã hết hạn', color: 'bg-gray-100 text-gray-800' };
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
      return { text: 'Đã hết lượt', color: 'bg-orange-100 text-orange-800' };
    }
    return { text: 'Đang hoạt động', color: 'bg-green-100 text-green-800' };
  };

  const handleEdit = (voucher) => {
    setSelectedVoucherState(voucher);
    dispatch(setSelectedVoucher(voucher));
    setEditModalOpen(true);
  };

  const handleDelete = (voucher) => {
    setSelectedVoucherState(voucher);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVoucher) {
      await dispatch(deleteVoucher(selectedVoucher._id));
      setDeleteModalOpen(false);
      setSelectedVoucherState(null);
    }
  };

  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
    // You might want to show a toast notification here
  };

  if (voucherList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Percent size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có voucher nào</h3>
        <p className="text-gray-600">Tạo voucher đầu tiên để bắt đầu quản lý mã giảm giá</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
      {isLoadingActions && <Loader1 isLoading={isLoadingActions}/>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-200 ">
            <tr>
              {adminHeaderVoucher.map((item, idx) =>
                <th key={idx} className="px-4  py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                  {item}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {voucherList.map((voucher) => {
              const status = getVoucherStatus(voucher);
              return (
                <tr key={voucher._id} className="hover:bg-slate-100 items-center bf">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-blue-600">
                        {voucher.code}
                      </span>
                      <button
                        onClick={() => copyVoucherCode(voucher.code)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title="Sao chép mã"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="text-[16px] text-gray-900 min-w-50 line-clamp-2" title={voucher.description}>
                        {voucher.description || 'Không có mô tả'}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-[16px]">
                    <div className="flex items-center gap-1">
                      {voucher.discountType === 'percentage' ? (
                        <>
                          <span className="font-medium text-green-600">
                            {voucher.discountValue}%
                          </span>
                        </>
                      ) : (
                        <>
                         
                          <span className="font-medium text-blue-600">
                            {formatPrice(voucher.discountValue)}
                          </span>
                        </>
                      )}
                    </div>
                    {voucher.maxDiscountAmount && (
                      <p className="text-gray-900 mt-1">
                        Tối đa: {formatPrice(voucher.maxDiscountAmount)}
                      </p>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center font-medium gap-1 text-[16px]">
                      <Calendar size={14} className="text-gray-800" />
                      <div>
                        <p className="text-slate-800 ">{format(new Date(voucher.startDate), "dd/MM/yyyy HH:mm")}</p>
                        <hr className='text-gray-400'/>
                        <p className="text-gray-800">{format(new Date(voucher.endDate), "dd/MM/yyyy HH:mm")}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-gray-800" />
                      <div>
                        <p className="text-[16px] ml-2 text-orange-600">
                          {voucher.usedCount}
                          {voucher.usageLimit > 0 && ` / ${voucher.usageLimit}`}
                        </p>
                        <p className="text-[15px] text-gray-900">lượt sử dụng</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-[15px] font-medium rounded-sm ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="p-2 text-yellow-500 bg-yellow-50 hover:text-yellow-600  hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(voucher)}
                        className="p-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditVoucherModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedVoucherState(null);
        }}
        voucher={selectedVoucher}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedVoucherState(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa Voucher"
         message={
            <>
              Bạn có chắc chắn muốn xóa voucher "{selectedVoucher?.code}"? <br />
              Hành động này không thể hoàn tác.
            </>
          }
        isLoading={isLoadingActions}
      />
    </div>
  );
}