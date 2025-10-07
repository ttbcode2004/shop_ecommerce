import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMe, updateAccountPassword, updateAccountProfile } from '../../store/admin/account-slice';
import { Eye, EyeOff, Key, Shield, User } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import Loader1 from '../../components/ui/Loader1';
const classInput = "w-full px-4 py-2 border border-slate-300 rounded-sm bg-slate-50 text-gray-900"

export default function AdminAccount() {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  const {accountData, isLoading, isLoadingAction} = useSelector((state) => state.adminAccount); 
  const {user} = useSelector((state) => state.auth); 
  const dispatch = useDispatch();
  
  const [accountProfile, setAccountProfile] = useState({
    name: "",
    email: "",
    phone: "",
    createdAt: "",
  });

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
  
    const result = await dispatch(updateAccountPassword({
      passwordCurrent: passwordData.currentPassword,
      password: passwordData.newPassword
    }));
  
    if (result.payload?.success) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = () => {
    dispatch(updateAccountProfile({name: accountProfile.name, email: accountProfile.email, phone: accountProfile.phone }));
  }

  const handleCancelUpdateProfile = () => {
    if (accountData) {
      setAccountProfile({
        name: accountData.name || "",
        email: accountData.email || "",
        phone: accountData.phone || "",
        createdAt: accountData.createdAt || "",
      });
    }
  }

  useEffect(() => {
    if (accountData) {
      setAccountProfile({
        name: accountData.name || "",
        email: accountData.email || "",
        phone: accountData.phone || "",
        createdAt: accountData.createdAt || "",
      });
    }
  }, [accountData]);

  useEffect(()=>{
    if(user){
      dispatch(getMe(user.id))
    }
  },[dispatch, user])

  if(isLoading){
    return <Loader isLoading={isLoading}/>
  }

  return (
    <div className='w-full relative'>
      {isLoadingAction && <Loader1 isLoading = {isLoadingAction}/>}
      <h1 className={`text-2xl font-bold text-gray-900 mb-8 ${!sidebarOpen ? "ml-20" : ""}`}>
        Quản lý tài khoản admin
      </h1>

      <div className='w-full flex flex-col gap-6 px-40'>
        <div className="flex items-center gap-2">
          <User className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={accountProfile?.name || ""}
              onChange={handleChange}
              className={`${classInput}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={accountProfile?.email || ""}
              onChange={handleChange}
              className={`${classInput}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={accountProfile?.phone || ""}
              onChange={handleChange}
              className={`${classInput}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày tham gia
            </label>
            <input
              type="text"
              value={
                accountProfile?.createdAt
                  ? new Date(accountProfile.createdAt).toLocaleDateString("vi-VN")
                  : ""
              }
              disabled
              className={`${classInput}`}
            />
          </div>
        </div>
        <div className="flex gap-4 ">
          <button
            onClick={handleCancelUpdateProfile}
            className="py-2 px-4 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-colors font-medium"
          >
            Hủy
          </button>
          <button 
          onClick={handleUpdateProfile}
          className="py-2 px-4 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors font-medium">
            Cập nhật thông tin
          </button>
        </div> 
      </div>

      <div className='w-full flex flex-col gap-6 px-40 my-12'>
        <div className="flex items-center gap-2">
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
            disabled={isLoadingAction}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoadingAction && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            <Key size={18} />
            {isLoadingAction ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  )
}
