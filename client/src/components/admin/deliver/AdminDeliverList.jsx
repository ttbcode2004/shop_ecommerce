import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteDeliver } from "../../../store/admin/deliver-slice";
import { Trash2,  Percent, Edit2 } from "lucide-react";
import { formatPrice } from "../../../utils/formatPrice";
import EditDeliverModal from "./EditDeliverModal";
import DeleteConfirmModal from "../../ui/DeleteConfirmModal";
import Loader1 from "../../ui/Loader1";

export default function AdminDeliverList({ deliverList, isLoadingActions }) {
    const dispatch = useDispatch();
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDeliver, setSelectedDeliver] = useState(null);

    const handleEdit = (deliver) => {
        setSelectedDeliver(deliver);
        setEditModalOpen(true);
      };
    
      const handleDelete = (deliver) => {
        setSelectedDeliver(deliver);
        setDeleteModalOpen(true);
      };
    
      const confirmDelete = async () => {
        if (selectedDeliver) {
          await dispatch(deleteDeliver(selectedDeliver._id));
          setDeleteModalOpen(false);
          setSelectedDeliver(null);
        }
      };

  if (!deliverList || deliverList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Percent size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn vị giao hàng nào</h3>
        <p className="text-gray-600">Tạo đơn vị giao hàng đầu tiên để bắt đầu quản lý</p>
      </div>
    );
  }

  return (
    <div className="bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoadingActions && <Loader1 isLoading={isLoadingActions} />}

      {deliverList.map((deliver) => (
        <div
          key={deliver._id}
          className="p-4 flex flex-col justify-between shadow-sm border border-slate-200 rounded-sm hover:shadow-md transition-shadow"
        >
          {/* Info */}
          <div className="mb-1">
            <p className="font-medium text-gray-900">{deliver.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-lg">Phí: <span className="text-green-600 font-medium">{formatPrice(deliver.deliverFee)}</span></p>
            <div className="flex gap-2 items-center">
                <button
              onClick={() => handleEdit(deliver)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
              title="Chỉnh sửa"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(deliver)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
              title="Xóa"
            >
              <Trash2 size={18} />
            </button>
            </div>
          </div>
        </div>
      ))}

      <EditDeliverModal
        isOpen={editModalOpen}
        onClose={() => {
        setEditModalOpen(false);
        setSelectedDeliver(null);
        }}
        deliver={selectedDeliver}
    />

    <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
            setDeleteModalOpen(false);
            setSelectedDeliver(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa phí vận chuyển"
            message={
            <>
                Bạn có chắc chắn muốn xóa phí vận chuyển? <br />
                Hành động này không thể hoàn tác.
            </>
            }
        isLoading={isLoadingActions}
        />
    </div>
  );
}
