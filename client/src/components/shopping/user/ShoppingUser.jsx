import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Shield, Mail, User } from "lucide-react";
import UserProfile from "./UserProfile";
import UserPassword from "./UserPassword";
import UserForgotPassword from "./UserForgotPassword";
import Loader from "../../ui/Loader";
import Loader1 from "../../ui/Loader1";

const sectionTabs = [
  { id: "profile", label: "Thông tin cá nhân", icon: User },
  { id: "security", label: "Đổi mật khẩu", icon: Shield },
  { id: "forgot", label: "Quên mật khẩu", icon: Mail },
];

const ShoppingUser = () => {
  const { userData, isLoading, isLoadingAction } = useSelector((state) => state.shopUser);
  const dispatch = useDispatch();

  const [forgotEmail, setForgotEmail] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [messages, setMessages] = useState({ success: "", error: "" });
;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      setMessages({ error: "Vui lòng nhập email", success: "" });
      return;
    }

    const result = await forgotPassword(forgotEmail);
    
    if (result.success) {
      setMessages({ success: result.message, error: "" });
      setForgotEmail("");
    } else {
      setMessages({ error: result.message, success: "" });
    }
  };

  if (isLoading || !userData) {
    return <Loader isLoading={isLoading} />
  }

  return (
    <div className="mx-auto">

      <div className=" mb-6">
        <div className="flex space-x-1 gap-4">
          {sectionTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 p-2 text-[14px] rounded-sm font-medium transition-colors ${
                  activeSection === tab.id
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-800  hover:bg-slate-100"
                }`}
              >
                <IconComponent className="hidden sm:block" size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {isLoadingAction && <Loader1 isLoading={isLoadingAction} />}
        {activeSection === "profile" && <UserProfile/>}
        {activeSection === "security" && <UserPassword isLoading={isLoading} />}
        {activeSection === "forgot" && <UserForgotPassword isLoading={isLoading}/>}
      </div>
    </div>
  );
};

export default ShoppingUser;