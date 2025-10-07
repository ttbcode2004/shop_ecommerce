import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import logo from "../../../assets/logo.png";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-300
    ${
      isActive
        ? " font-semibold underline underline-offset-8"
        : "text-gray-800 hover:underline underline-offset-8"
    }`;
const dropdownClass = "absolute left-0 mt-0 w-48 bg-white shadow-sm rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 origin-top"

export default function Navbar({ showMenu }) {  
  return (
    <div className="flex items-center gap-4 ">
      <button
        className="lg:hidden border p-2 border-slate-400 rounded-lg hover:bg-slate-100 transition"
        onClick={()=>showMenu(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <Link to="/" className="hidden sm:flex items-center">
        <img
          className="w-20 md:w-16 sm:w-14 object-contain"
          src={logo}
          alt="Logo"
        />
      </Link>

      {/* Menu desktop */}
      <nav className="hidden items-center gap-2 lg:flex lg:text-[16px] font-medium">
        <NavLink to="/" className={navLinkClass}>
          TRANG CHỦ
        </NavLink>

        <div className="relative group">
          <NavLink to="/nam" className={navLinkClass}>
            <span className="flex items-center">
              NAM
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
            </span>
          </NavLink>

          <div className={dropdownClass}>
            <div className="flex flex-col text-[16px] gap-2 p-4 text-gray-700">
              <NavLink to="/ao-thun?gioi_tinh=nam" className="hover:text-blue-600">
                Áo Thun
              </NavLink>
              <NavLink to="/ao-polo?gioi_tinh=nam" className="hover:text-blue-600">
                Áo PoLo
              </NavLink>
              <NavLink to="/ao-khoac?gioi_tinh=nam" className="hover:text-blue-600">
                Áo Khoác
              </NavLink>
              <NavLink to="/quan-short?gioi_tinh=nam" className="hover:text-blue-600">
                Quần Short
              </NavLink>
              <NavLink to="/quan-dai?gioi_tinh=nam" className="hover:text-blue-600">
                Quần Dài
              </NavLink>
            </div>
          </div>
        </div>

        <div className="relative group">
          <NavLink to="/nu" className={navLinkClass}>
            <span className="flex items-center">
              NỮ
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
            </span>
          </NavLink>

          <div className={dropdownClass}>
            <div className="flex flex-col text-[16px] gap-2 p-4 text-gray-700">
              <NavLink to="/ao-thun?gioi_tinh=nu" className="hover:text-blue-600">
                Áo Thun
              </NavLink>
              <NavLink to="/ao-polo?gioi_tinh=nu" className="hover:text-blue-600">
                Áo PoLo
              </NavLink>
              <NavLink to="/ao-khoac?gioi_tinh=nu" className="hover:text-blue-600">
                Áo Khoác
              </NavLink>
              <NavLink to="/quan-short?gioi_tinh=nu" className="hover:text-blue-600">
                Quần Short
              </NavLink>
              <NavLink to="/quan-dai?gioi_tinh=nu" className="hover:text-blue-600">
                Quần Dài
              </NavLink>
            </div>
          </div>
        </div>

        <div className="relative group">
          <NavLink to="/tre-em" className={navLinkClass}>
            <span className="flex items-center">
              TRẺ EM
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
            </span>
          </NavLink>

          <div className={dropdownClass}>
            <div className="flex flex-col text-[16px] gap-2 p-4 text-gray-700">
              <NavLink to="/ao-thun?gioi_tinh=tre-em" className="hover:text-blue-600">
                Áo Thun
              </NavLink>
              <NavLink to="/ao-polo?gioi_tinh=tre-em" className="hover:text-blue-600">
                Áo PoLo
              </NavLink>
              <NavLink to="/ao-khoac?gioi_tinh=tre-em" className="hover:text-blue-600">
                Áo Khoác
              </NavLink>
              <NavLink to="/quan-short?gioi_tinh=tre-em" className="hover:text-blue-600">
                Quần Short
              </NavLink>
              <NavLink to="/quan-dai?gioi_tinh=tre-em" className="hover:text-blue-600">
                Quần Dài
              </NavLink>
            </div>
          </div>
        </div>

        <NavLink to="/about" className={navLinkClass}>
          THÔNG TIN
        </NavLink>
      </nav>
    </div>
  );
}
