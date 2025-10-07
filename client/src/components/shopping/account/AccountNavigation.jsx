import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../store/auth-slice";
import { User, MapPin, Shield, ListOrdered, History, Bell, LogOut,} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  {
    id: "orders",
    label: "Đơn mua",
    icon: ListOrdered,
    badgeColor: "bg-orange-500",
  },
  {
    id: "history",
    label: "Lịch sử mua hàng",
    icon: History,
    badgeColor: "bg-green-500",
  },
  {
    id: "addresses",
    label: "Địa chỉ",
    icon: MapPin,
  },
  {
    id: "security",
    label: "Tài khoản & Bảo mật",
    icon: Shield,
  },
  {
    id: "vouchers",
    label: "Mã giảm giá",
    icon: Bell,
  },
];

export default function AccountNavigation({ activeTab, setActiveTab }) {
  const { userData } = useSelector((state) => state.shopUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <nav className="flex flex-col md:w-56  overflow-hidden ">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {userData?.photo ? (
            <img
              src={userData.photo}
              alt={userData.name}
              className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
          )}

          <h2 className="text-lg font-medium line-clamp-2">{userData?.name}</h2>
        </div>

        <button
          onClick={handleLogout}
          className="ml-6 text-sm flex items-center bg-slate-800 hover:bg-slate-900 transition-colors w-fit p-2 text-white rounded-sm md:hidden">
          Đăng xuất <LogOut className="ml-2" size={20} />
        </button>
      </div>

      {/* Navigation */}

      <div className="flex md:flex-col gap-2 md:gap-4 mt-4 ">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`relative flex items-center gap-2 p-1 md:p-2 rounded-sm transition-all duration-200 
                ${ isActive ? "bg-blue-50 text-blue-600 shadow-md border border-blue-200"
                  : "text-slate-900 hover:bg-slate-100"}
              `}
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent className="hidden md:block" size={24} />
              <span className="text-sm font-medium text-center leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full flex justify-center">
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center mt-20 bg-slate-800 hover:bg-slate-900 transition-colors w-fit p-2 text-white rounded-sm">
          Đăng xuất <LogOut className="ml-2" size={20} />
        </button>
      </div>
    </nav>
  );
}
