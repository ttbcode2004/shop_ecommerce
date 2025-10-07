import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // dùng icon (nếu bạn cài lucide-react)
import { useLocation } from "react-router-dom";

export default function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút nếu scroll xuống quá 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // cuộn mượt
    });
  };

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 bottom-10 right-4 p-1 rounded-full bg-slate-300/55 text-white shadow-sm hover:bg-slate-400/55 transition"
        >
          <ArrowUp size={20} className="text-black/55 font-medium" />
        </button>
      )}
    </>
  );
}
