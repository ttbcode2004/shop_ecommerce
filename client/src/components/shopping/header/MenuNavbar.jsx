import { useDispatch } from "react-redux";
import { ChevronDown, ChevronRight, LogOut, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { logoutUser } from "../../../store/auth-slice";
import { useState } from "react";

const navLinkClass = ({ isActive }) =>
    `flex items-center justify-between gap-1 px-6 text-[18px] py-1 rounded-md transition-all duration-300
      ${
        isActive
          ? "font-semibold underline underline-offset-8"
          : "text-gray-800 hover:underline underline-offset-8"
      }`;

const dropdownClass = "absolute z-20 left-0 mt-0 w-30 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 origin-top"

export default function MenuNavbar({showMenu}) {
  const distpatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState({
  nam: false,
  nu: false,
  treEm: false,
  });

  const handleLogout = () => {
    distpatch(logoutUser())
    showMenu(false)
    navigate("/")
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 lg:hidden"
      onClick={() => showMenu(false)}
    >
      <div
        className="absolute top-0 left-0 h-full w-2/3 max-w-xs bg-white shadow-lg flex flex-col gap-2 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex px-4 gap-8 justify-between items-center">
          <Link to="/" className="flex items-center">
            <img className="w-16 object-contain"
              src={logo}
              alt="Logo"
            />
          </Link>
          <button
            onClick={() => showMenu(false)}
            className="py-1 px-2 hover:bg-gray-200 rounded-full h-9"
          >
            <X size={20} />
          </button>
        </div>

        <NavLink to="/" onClick={() => showMenu(false)} className={navLinkClass}>
          Trang chủ
        </NavLink>

        <div className="relative w-full">
          <div className="flex items-center justify-between w-full py-1">
            <NavLink to="/nam" onClick={() => showMenu(false)} className={navLinkClass}>
              NAM
            </NavLink>

            <div
              className="flex-1 flex justify-end cursor-pointer pr-4"
              onClick={() => setOpen((prev) => ({...prev, nam: !prev.nam}))}
            >
              <ChevronRight
                className={`w-7 h-8 text-gray-900 transition-transform duration-300 ${
                  open.nam ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`w-full transition-all duration-300 px-8 py-1 flex-col gap-2 text-gray-900 font-medium text-[17px] 
              ${open.nam ? "flex" : "hidden"}`}
          >
            <NavLink to="/ao-thun?gioi_tinh=nam" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Thun
            </NavLink>
            <NavLink to="/ao-polo?gioi_tinh=nam" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo PoLo
            </NavLink>
            <NavLink to="/ao-khoac?gioi_tinh=nam" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Khoác
            </NavLink>
            <NavLink to="/quan-short?gioi_tinh=nam" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Short
            </NavLink>
            <NavLink to="/quan-dai?gioi_tinh=nam" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Dài
            </NavLink>
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex items-center justify-between w-full py-1">
            <NavLink to="/nu" onClick={() => showMenu(false)} className={navLinkClass}>
              NỮ
            </NavLink>

            <div
              className="flex-1 flex justify-end cursor-pointer pr-4"
              onClick={() => setOpen((prev) => ({...prev, nu: !prev.nu}))}
            >
              <ChevronRight
                className={`w-7 h-8 text-gray-900 transition-transform duration-300 ${
                  open.nu ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`w-full transition-all duration-300 px-8 py-1 flex-col gap-2 text-gray-900 font-medium text-[17px] 
              ${open.nu ? "flex" : "hidden"}`}
          >
            <NavLink to="/ao-thun?gioi_tinh=nu" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Thun
            </NavLink>
            <NavLink to="/ao-polo?gioi_tinh=nu" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo PoLo
            </NavLink>
            <NavLink to="/ao-khoac?gioi_tinh=nu" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Khoác
            </NavLink>
            <NavLink to="/quan-short?gioi_tinh=nu" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Short
            </NavLink>
            <NavLink to="/quan-dai?gioi_tinh=nu" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Dài
            </NavLink>
          </div>
        </div>

        <div className="relative w-full">
          <div className="flex items-center justify-between w-full py-1">
            <NavLink to="/tre-em" onClick={() => showMenu(false)} className={navLinkClass}>
              TRẺ EM
            </NavLink>

            <div
              className="flex-1 flex justify-end cursor-pointer pr-4"
              onClick={() => setOpen((prev) => ({...prev, treEm: !prev.treEm}))}
            >
              <ChevronRight
                className={`w-7 h-8 text-gray-900 transition-transform duration-300 ${
                  open.treEm ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`w-full transition-all duration-300 px-8 py-1 flex-col gap-2 text-gray-900 font-medium text-[17px] 
              ${open.treEm ? "flex" : "hidden"}`}
          >
            <NavLink to="/ao-thun?gioi_tinh=tre-em" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Thun
            </NavLink>
            <NavLink to="/ao-polo?gioi_tinh=tre-em" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo PoLo
            </NavLink>
            <NavLink to="/ao-khoac?gioi_tinh=tre-em" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Áo Khoác
            </NavLink>
            <NavLink to="/quan-short?gioi_tinh=tre-em" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Short
            </NavLink>
            <NavLink to="/quan-dai?gioi_tinh=tre-em" onClick={() => showMenu(false)} className="hover:text-blue-600">
              Quần Dài
            </NavLink>
          </div>
        </div>

        <NavLink to="/about" onClick={() => showMenu(false)} className={navLinkClass}>
          THÔNG TIN
        </NavLink>

         <div className="flex-1 flex justify-center items-end my-8">
          <button className=" flex font-medium h-fit bg-slate-100 py-2 px-4 rounded-sm gap-2 hover:bg-slate-200 transition-colors duration-100"
            onClick={()=>handleLogout()}
            >
            Đăng xuất
            <LogOut/>
          </button>
         </div>
      </div>
    </div>
  );
}
