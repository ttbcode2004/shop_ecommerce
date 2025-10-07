import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../store/admin/user-slice";
import { toast } from "react-toastify";
import { Eye, EyeOff, X } from "lucide-react";

const initialState = {
  name: "",
  phone: "",
  email: "",
  password: "",
};

const CreateUserModal = ({ isOpen, onClose }) => {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

    dispatch(createUser(formData));
    onClose()
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-400">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Thêm khách hàng</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] flex justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-md">
            <div className="space-y-6">
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                className="w-1/3 bg-slate-700 text-white py-3 rounded-sm font-medium 
                hover:bg-slate-800 transition mt-6"
              >
                Tạo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
