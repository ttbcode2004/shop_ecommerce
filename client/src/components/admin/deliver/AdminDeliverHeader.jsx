import { useState } from "react";
import { Plus} from "lucide-react";
import CreateDeliverModal from "./CreateDeliverModal";
import { useSelector } from "react-redux";

export default function AdminDeliverHeader({total}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { sidebarOpen } = useSelector((state) => state.adminProducts);

  return (
    <div
      className={`flex items-center justify-between ${
        !sidebarOpen ? "ml-20" : ""
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-900">Quản lý phí vận chuyển <span className="text-gray-600 font-medium">({total})</span></h1>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} />
        Tạo phí vận chuyển
      </button>

      <CreateDeliverModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
