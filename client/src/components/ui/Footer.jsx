import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-200 mt-10 ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">BACH</h2>
          <p className="text-[16px] text-gray-300">
            Leading e-commerce platform for electronics.  
            Fast • Reliable • Global
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Shop</h3>
          <ul className="space-y-2">
            <li><Link to="/nam" className="hover:text-white">Nam</Link></li>
            <li><Link to="/nu" className="hover:text-white">Nữ</Link></li>
            <li><Link to="/tre-em" className="hover:text-white">Trẻ Em</Link></li>
            <li><Link to="/ao-thun" className="hover:text-white">Áo Thun</Link></li>
            <li><Link to="/ao-polo" className="hover:text-white">Áo PoLo</Link></li>
            <li><Link to="/ao-khoac" className="hover:text-white">Áo Khoác</Link></li>
            <li><Link to="/quan-short" className="hover:text-white">Quần Short</Link></li>
            <li><Link to="/quan-dai" className="hover:text-white">Quần Dài</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Hỗ Trợ</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">Thông Tin</Link></li>
            
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Tham Gia</h3>
          <p className="text-p16px text-gray-300 mb-4">
            Đăng ký để nhận được những sản phẩm và voucher mới nhất.
          </p>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Nhập email"
              className="px-3 py-2 rounded-sm text-[16px] bg-slate-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              className="px-4 py-2 bg-red-500 rounded-sm text-white font-semibold hover:bg-red-600 min-w-24" 
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 py-6 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} BACH. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://www.facebook.com/thatbach0312" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110"><Facebook size={20}/></a>
          <a href="https://www.instagram.com/tthatbach/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110"><Instagram size={20}/></a>
          <a href="#" className="hover:text-white hover:scale-110"><Twitter size={20}/></a>
          <a href="#" className="hover:text-white hover:scale-110"><Linkedin size={20}/></a>
          <a href="#" className="hover:text-white hover:scale-110"><Youtube size={20}/></a>
        </div>
      </div>
    </footer>
  );
}
