import { sendPasswordResetEmail } from "firebase/auth";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../utils/firebase";

export default function UserForgotPassword({ isLoading}) {
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Mail className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Quên mật khẩu</h2>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                    Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến
                    hộp thư của bạn.
                </p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ email *
                    </label>
                    <input
                        type="email"
                        placeholder="Nhập địa chỉ email của bạn"
                        className="w-full text-[16px] px-4 py-3 border border-slate-300 rounded-sm focus:ring-1 outline-none focus:ring-slate-800 focus:border-slate-800"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !forgotEmail}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium w-full justify-center"
                >
                    {isLoading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <Mail size={18} />
                    {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </button>
            </form>
        </div>
    );
}