import  { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { auth } from "../../utils/firebase";

export default function AuthForgot({ isLoading}) {
    const [forgotEmail, setForgotEmail] = useState("");
    const [message, setMessage] = useState({ error: "", success: "" });

     const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
        setMessage({ error: "Vui lòng nhập email", success: "" });
        toast.error("Vui lòng nhập email");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
        setMessage({ error: "Email không hợp lệ", success: "" });
        toast.error("Email không hợp lệ");
        return;
    }

    setMessage({ error: "", success: "" });

    try {
        // Sử dụng URL cố định và đã được authorize
        await sendPasswordResetEmail(auth, forgotEmail, {
            url: 'https://ecommerce-c4fc9.firebaseapp.com', // Hoặc domain production của bạn
            handleCodeInApp: true,
        });
        
        setMessage({ 
            error: "", 
            success: "Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư." 
        });
        toast.success("Đã gửi email đặt lại mật khẩu!");
        setForgotEmail("");
    } catch (error) {
        console.error("Reset password error:", error);
        
        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "Email này không tồn tại trong hệ thống.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Email không hợp lệ.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
                break;
            case 'auth/unauthorized-continue-uri':
                errorMessage = "URL không được ủy quyền. Vui lòng liên hệ quản trị viên.";
                break;
            default:
                errorMessage = error.message;
        }
        
        setMessage({ error: errorMessage, success: "" });
        toast.error(errorMessage);
    }
};
    return (
      <div className="flex flex-col w-full max-w-md mx-auto space-y-6">
          <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h1>
          </div>

          {/* Display messages */}
          {message.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{message.error}</p>
              </div>
          )}
          
          {message.success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{message.success}</p>
              </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                  <label>
                      Địa chỉ 
                  </label>
                  <input
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn"
                      className="w-full px-4 py-3 border text-[17px] border-slate-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-800 pr-12"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      disabled={isLoading}
                  />
              </div>

              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !forgotEmail}
                  className="w-1/2 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-sm font-medium hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    <Mail size={18} />
                    {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </button>
              </div>

              
          </form>
          <div className="flex items-center justify-between text-[16px] font-medium text-gray-800">
            <Link
                className="text-black font-semibold hover:underline"
                to="/auth/login"
            >
                Đăng nhập
            </Link>
            <Link to="/auth/register" className="hover:text-black hover:underline ">
                Tạo tài khoản
            </Link>
          </div>
      </div>
    );
}