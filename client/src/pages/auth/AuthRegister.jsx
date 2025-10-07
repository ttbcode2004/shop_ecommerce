import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../store/auth-slice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";

const initialState = {
  name: "",
  phone: "",
  email: "",
  password: "",
};

export default function AuthRegister() {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Tên tài khoản không được để trống");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!/^\d{9,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại phải có 9-11 số");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Mật khẩu tối thiểu 6 ký tự");
      return false;
    }
    return true;
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    // ✅ 1. Đăng ký user trên Firebase Authentication
    await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // ✅ 2. Gửi thông tin về backend để lưu vào MongoDB
    const data = await dispatch(registerUser(formData));

    if (data.payload?.success) {
      navigate("/auth/login");
    }
  }

  return (
    <div className="w-full flex items-center justify-center px-4 ">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <h1 className="text-3xl pb-6 font-extrabold text-center text-gray-800">
          Đăng ký tài khoản
        </h1>

        {/* Input Group */}
        <div className="space-y-6">
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
            placeholder="Tên tài khoản"
          />
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
            placeholder="Email"
          />
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
            placeholder="Số điện thoại"
          />

          {/* Password field with Eye toggle */}
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
              placeholder="Mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
          type="submit"
          disabled={isLoading}
          className="w-1/3 bg-slate-800 text-white py-3 rounded-sm font-medium 
          hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        </div>

        {/* Link */}
        <p className="text-center text-[16px] text-gray-800 mt-6">
          Bạn đã có tài khoản?{" "}
          <Link
            className="text-black font-semibold hover:underline"
            to="/auth/login"
          >
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
