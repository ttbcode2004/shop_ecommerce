import { useState } from "react";
import { Plus} from "lucide-react";
import CreateVoucherModal from "./CreateVoucherModal";
import { useSelector } from "react-redux";

export default function AdminVoucherHeader({total}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { sidebarOpen } = useSelector((state) => state.adminProducts);

  return (
    <div
      className={`flex items-center justify-between ${
        !sidebarOpen ? "ml-20" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher <san className="font-medium text-gray-700">({total})</san></h1>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} />
        Tạo Voucher
      </button>

      <CreateVoucherModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
