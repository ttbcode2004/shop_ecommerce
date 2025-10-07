import { Outlet, Link } from "react-router-dom";
import authLayout from "../../assets/authLayout.avif"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Fashion image + overlay */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center bg-black">
        <img
          src={authLayout}
          alt="Fashion Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-md text-center text-white px-8">
          <h1 className="text-5xl font-extrabold tracking-tight uppercase">
            BACH <span className="text-blue-400">Shop</span>
          </h1>
          <p className="mt-4 text-lg font-light tracking-wide">
            Nơi thời trang gặp cá tính – khẳng định phong cách riêng của bạn.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + tagline nhỏ */}
          <div className="text-center">
            <Link to="/" className="text-3xl font-bold text-gray-900 uppercase">
              BACH<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-2 text-gray-500 text-sm">Thời trang đẳng cấp – Đặt chất lượng lên hàng đầu</p>
          </div>

          {/* Outlet (Login/Register Form) */}
          <div className="bg-white rounded-sm shadow-xl p-6 backdrop-blur-sm border border-slate-100">
            <Outlet />
          </div>

          {/* Footer nhỏ */}
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} BACH Shop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
