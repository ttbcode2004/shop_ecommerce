import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePhotoMe, updateUserProfile } from "../../../store/shop/user-slice";
import { Camera, User } from "lucide-react";

const classInput = "w-full px-4 py-2 border border-slate-300 rounded-sm bg-slate-50 text-gray-900"

export default function UserProfile() {
  const {userData} = useSelector((state) => state.shopUser);  

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [userProfile, setUserProfile] = useState({
      photo: "",
      name: "",
      email: "",
      phone: "",
      createdAt: "",
    });

  useEffect(() => {
    if (userData) {
      setUserProfile({
        photo: userData.photo || "",
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        createdAt: userData.createdAt || "",
      });
    }
  }, [userData]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
  
      dispatch(updatePhotoMe({formData }));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = () => {
    dispatch(updateUserProfile({name: userProfile.name, email: userProfile.email, phone: userProfile.phone }));
  }

  const handleCancelUpdateProfile = () => {
    if (userData) {
      setUserProfile({
        photo: userData.photo || "",
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        createdAt: userData.createdAt || "",
      });
    }
  }

  return (
    <div className="relative bg-white rounded-sm shadow-sm border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {userProfile?.photo ? (
              <img
                src={userProfile.photo}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
            )}

            <button
              type="button"
              onClick={handleClick}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <Camera size={16} className="text-gray-800" />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">{userProfile?.name}</h3>
            <p className="text-gray-800">{userProfile?.email}</p>
            <button
              type="button"
              onClick={handleClick}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Thay đổi ảnh đại diện
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={userProfile?.name || ""}
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
              value={userProfile?.email || ""}
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
              value={userProfile?.phone || ""}
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
                userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString("vi-VN")
                  : ""
              }
              disabled
              className={`${classInput}`}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
          onClick={handleUpdateProfile}
          className="py-2 px-4 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors font-medium">
            Cập nhật thông tin
          </button>
          <button
            onClick={handleCancelUpdateProfile}
            className="py-2 px-4 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-colors font-medium"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
