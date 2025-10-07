import { useSelector } from "react-redux";

export default function OrderHeader({isUser, setIsUser, orderList }) {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);

  return (
    <div
      className={`flex items-center justify-between mb-2 ${
        !sidebarOpen ? "ml-20" : ""
      }`}
    >
      <h1 className="md:text-2xl text-xl font-semibold text-slate-800">
        Quản lý đơn hàng {isUser? "có user":"không có user"} ({orderList.length})
      </h1>

      {
        !isUser && <button
        onClick={()=>setIsUser(prev => !prev)}
        className="px-4 py-2 bg-green-600 text-white 
                           hover:bg-green-700 rounded-sm transition-colors font-medium"
      >
        Đơn hàng có user
      </button>
      }
      {
        isUser && <button
        onClick={()=>setIsUser(prev => !prev)}
        className="px-4 py-2 bg-blue-600 text-white 
                           hover:bg-blue-700 rounded-sm transition-colors font-medium"
      >
        Đơn hàng không có user
      </button>
      }

    </div>
  );
}
