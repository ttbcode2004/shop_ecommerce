import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../store/auth-slice";
import { Eye, EyeOff } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

export default function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const [showPasswords, setShowPasswords] = useState( false);

   const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => !prev);
  };

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full max-w-md mx-auto space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
      </div>

      {/* Input fields */}
      <div className="space-y-4">
        <label>Email</label>
        <input
          required
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
          placeholder="Email"
        />
      
        <label>Mật khẩu</label>
        <div className="relative">
          <input
            required
            type={showPasswords ? "text" : "password"}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
            className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
            placeholder="Mật khẩu"
          />
   
          <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-600"
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
      </div>

      {/* Login button */}
      <div className="text-center">
        <button
          type="submit"
          className="w-1/3 bg-slate-800 text-white py-3 rounded-sm font-medium 
          hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
         Đăng nhập
       </button>
      </div>

      {/* Links */}
      <div className="flex items-center justify-between text-[16px] font-medium text-gray-800">
        <Link to="/auth/forgot" className="hover:text-black hover:underline">
          Quên mật khẩu?
        </Link>
        <Link to="/auth/register" className="hover:text-black hover:underline ">
          Tạo tài khoản
        </Link>
      </div>
    </form>
  );
}
