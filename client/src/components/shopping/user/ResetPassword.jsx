import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../store/auth-slice";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const oobCode = searchParams.get("oobCode");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Verify reset code when component mounts
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError("Liên kết không hợp lệ hoặc đã hết hạn.");
        setIsVerifying(false);
        return;
      }

      try {
        // Verify the reset code and get the email
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setIsVerifying(false);
      } catch (error) {
        console.error("Verify reset code error:", error);
        let errorMessage = "Liên kết không hợp lệ hoặc đã hết hạn.";

        switch (error.code) {
          case "auth/invalid-action-code":
            errorMessage = "Liên kết đặt lại mật khẩu không hợp lệ.";
            break;
          case "auth/expired-action-code":
            errorMessage = "Liên kết đặt lại mật khẩu đã hết hạn.";
            break;
        }

        setError(errorMessage);
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    return null;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      dispatch(resetPassword({email, password: newPassword}));
      await confirmPasswordReset(auth, oobCode, newPassword);

      navigate("/account");
    } catch (error) {
      console.error("Reset password error:", error);

      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

      switch (error.code) {
        case "auth/invalid-action-code":
          errorMessage = "Liên kết đặt lại mật khẩu không hợp lệ.";
          break;
        case "auth/expired-action-code":
          errorMessage = "Liên kết đặt lại mật khẩu đã hết hạn.";
          break;
        case "auth/weak-password":
          errorMessage = "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center text-gray-600">Đang xác thực liên kết...</p>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-96 flex items-center justify-center bg-white">
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Liên kết không hợp lệ
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
        </div>

        {email && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
            <p className="text-blue-800 text-[16px]">
              Gmail: <strong>{email}</strong>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-2">
              Mật khẩu mới *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                className="w-full text-[16px] px-4 py-3 pr-12 border border-slate-300 rounded-sm focus:ring-1 outline-none focus:ring-slate-800 focus:border-slate-800"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-medium text-gray-900 mb-2">
              Xác nhận mật khẩu *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full text-[16px] px-4 py-3 pr-12 border border-slate-300 rounded-sm focus:ring-1 outline-none focus:ring-slate-800 focus:border-slate-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium w-full justify-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <Lock size={18} />
            {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
