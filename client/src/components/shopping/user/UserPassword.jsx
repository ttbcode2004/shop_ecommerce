import{ useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPassword } from '../../../store/shop/user-slice';
import { Eye, EyeOff, Key, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserPassword({ isLoading}) {
  const dispatch = useDispatch();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdatePassword = async (e) => {
  e.preventDefault();

  if (passwordData.newPassword.length < 8) {
    toast.warn("Mật khẩu ít nhất 8 ký tự");
    return;
  }
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.warn("Xác nhận mật khẩu không trùng nhau");
    return;
  }

  const result = await dispatch(updateUserPassword({
    passwordCurrent: passwordData.currentPassword,
    password: passwordData.newPassword
  }));

  if (result.payload?.success) {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }
}


  return (
    <div className="lg:ml-20 2xl:ml-30 bg-white rounded-sm shadow-sm border max-w-xl border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Cập nhật mật khẩu</h2>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-gray-50 text-gray-800"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            Mật khẩu mới *
          </label>
          <div className="relative">
            <input
              min={8}
              type={showPasswords.new ? "text" : "password"}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-gray-50 text-gray-800"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
              required

            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới *
          </label>
          <div className="relative">
            <input
              min={8}
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-gray-50 text-gray-800"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {passwordData.newPassword && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Độ mạnh mật khẩu:</div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => {
                const strength = passwordData.newPassword.length >= 8 ? 
                  (passwordData.newPassword.length >= 12 ? 4 : 3) : 
                  (passwordData.newPassword.length >= 6 ? 2 : 1);
                
                return (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded ${
                      level <= strength
                        ? strength <= 2 ? 'bg-red-400' : 
                          strength === 3 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <Key size={18} />
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  )
}
