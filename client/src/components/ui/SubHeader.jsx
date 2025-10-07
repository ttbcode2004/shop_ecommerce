import { Link, useLocation } from "react-router-dom";
import { House } from "lucide-react";

export default function SubHeader() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");
  const gender = searchParams.get("gioi_tinh");

  return (
    <div className={`mt-20 w-full px-6 md:px-10 lg:px-12 text-[12px] text-gray-600 ${location.pathname === "/" ? "hidden" : ""}`}>
      <nav className="flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:text-blue-600 font-medium flex items-center gap-1">
          <House size={14}/>
          Trang chủ
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
   
          return (
            <span key={routeTo} className="flex items-center gap-1">
              <span>|{" "}</span>
              <span className="capitalize">{decodeURIComponent(name)}</span>
            </span>
          );
        })}

        {/* Nếu là trang search thì hiện keyword */}
        {location.pathname.startsWith("/search") && searchQuery && (
          <span className="flex items-center gap-1">
            <span>|</span>
            <span className="italic text-gray-800">
              {decodeURIComponent(searchQuery)}
            </span>
          </span>
        )}

        {/* Nếu có query param về giới tính */}
        {gender && (
          <span className="flex items-center gap-1">
            <span>|</span>
            <span className="capitalize">{decodeURIComponent(gender)}</span>
          </span>
        )}
      </nav>
    </div>
  );
}
