import {
  AlignJustify,
  BadgeCheck,
  LayoutDashboard,
  ShoppingBasket,
  ArrowLeftToLine,
  X,
  User,
  CirclePoundSterling,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { updateSidebarOpen } from "../../store/admin/products-slice";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Sản Phẩm",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Đơn Hàng",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
  {
    id: "users",
    label: "Khách Hàng",
    path: "/admin/users",
    icon: <User size={20} />,
  },
  {
    id: "vouchers",
    label: "Mã giảm giá",
    path: "/admin/vouchers",
    icon: <CirclePoundSterling size={20} />,
  },
  {
    id: "delivers",
    label: "Phí vận chuyển",
    path: "/admin/delivers",
    icon: <CirclePoundSterling size={20} />,
  },
  {
    id: "account",
    label: "Tài khoản",
    path: "/admin/account",
    icon: <Wrench size={20} />,
  },
];

export default function AdminSidebar() {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      dispatch(updateSidebarOpen(false)); // đóng khi click menu ở mobile
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleSidebar = () => {
    dispatch(updateSidebarOpen(!sidebarOpen));
  };

  return (
    <div>
      {/* Header: hiển thị nút menu cả mobile và lg nếu sidebar bị ẩn */}
      <div className="fixed px-8 py-4 items-center h-16 bg-white z-50">
        {!sidebarOpen && (
          <button onClick={toggleSidebar} className="p-2 h-10 w-10 border rounded-lg border-slate-500 hover:bg-slate-200 transition-all">
            <AlignJustify />
          </button>
        )}
        
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="py-4 px-2 flex justify-between gap-2 items-center border-b">
          <button
            onClick={handleLogout}
            className="bg-slate-800 flex text-white text-xs font-light gap-1 items-center rounded-md p-2 hover:bg-black transition-all"
          >
            <ArrowLeftToLine size={12} />
            <p>Đăng xuất</p>
          </button>
          <div className="flex items-center gap-4 ">
            <span className="font-bold text-xl">Admin</span>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {adminSidebarMenuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-md transition-all duration-300 ease-in-out 
            ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-700 hover:text-white"
            }`
              }
              onClick={handleNavClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => dispatch(updateSidebarOpen(false))}
        ></div>
      )}
    </div>
  );
}
