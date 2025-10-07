import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Shield, Truck, RefreshCw, ShoppingBag } from "lucide-react";
import Footer from "../../components/ui/Footer";

export default function ShoppingAbout() {
  return (
    <>
    
      <div className="container mx-auto px-6 py-16 space-y-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
            BACH SHOP
          </h1>
          <p className="text-lg text-gray-600">
            Hệ thống thương mại điện tử uy tín, mang đến những sản phẩm thời trang chất lượng, 
            dịch vụ tận tâm và trải nghiệm mua sắm hiện đại cho khách hàng Việt Nam.
          </p>
        </motion.div>

        {/* Tầm nhìn & Sứ mệnh */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Tầm nhìn</h2>
          <p className="text-gray-900 mb-8 text-[18px]">
            Trở thành nền tảng thương mại điện tử hàng đầu, nơi khách hàng có thể mua sắm mọi lúc, 
            mọi nơi với sự an tâm tuyệt đối về chất lượng và dịch vụ.
          </p>
          <h2 className="text-2xl font-bold mb-4">Sứ mệnh</h2>
          <p className="text-gray-900 text-[18px]">
            Mang lại trải nghiệm mua sắm trực tuyến nhanh chóng, tiện lợi, 
            đảm bảo sản phẩm chính hãng và dịch vụ khách hàng tận tình, 
            góp phần nâng cao chất lượng cuộc sống của cộng đồng.
          </p>
        </motion.div>

        {/* Hệ thống cửa hàng */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-6">Hệ thống cửa hàng</h2>
          <ul className="space-y-3 text-gray-900 text-[18px]">
            <li>📍 TP.HCM: 123 Đường ABC, Quận 1</li>
            <li>📍 Hà Nội: 456 Đường DEF, Quận Hoàn Kiếm</li>
            <li>📍 Đà Nẵng: 789 Đường GHI, Quận Hải Châu</li>
          </ul>
        </motion.div>

        {/* Chính sách */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="p-6 bg-slate-50 rounded-sm shadow hover:shadow-md transition">
            <div className="flex gap-2 ">
              <Shield className="text-pink-500 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">Chính sách bảo mật</h3>
            </div>
            <p className="text-gray-900 text-[18px]">
              Thông tin cá nhân của khách hàng luôn được bảo mật và chỉ sử dụng cho mục đích giao dịch.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-sm shadow hover:shadow-md transition">
            <div className="flex gap-2 ">
              <ShoppingBag className="text-pink-500 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">Hướng dẫn mua hàng</h3>
            </div>
            <p className="text-gray-900 text-[18px]">
              Khách hàng có thể mua sắm dễ dàng qua website, chọn sản phẩm, thêm vào giỏ hàng và thanh toán nhanh chóng.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-sm shadow hover:shadow-md transition">
            <div className="flex gap-2 ">
              <RefreshCw className="text-pink-500 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">Chính sách đổi trả</h3>
            </div>
            <p className="text-gray-900 text-[18px]">
              Khách hàng có thể mua sắm dễ dàng qua website, chọn sản phẩm, thêm vào giỏ hàng và thanh toán nhanh chóng.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-sm shadow hover:shadow-md transition">
            <div className="flex gap-2 ">
              <Truck className="text-pink-500 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">Chính sách vận chuyển</h3>
            </div>
            <p className="text-gray-900 text-[18px]">
              Giao hàng toàn quốc, miễn phí với đơn từ 500.000đ. Thời gian 2-5 ngày tùy khu vực.
            </p>
          </div>
        </motion.div>
        
        {/* Liên hệ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-8 mx-auto"
        >
          {/* Google Map */}
          <iframe 
          title="Bach E-commerce Location"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1193.5953920045465!2d107.59266567568889!3d16459679329788912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3141a13f462a1445%3A0x1b70ba6cb49fb526!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIEh14bq_!5e1!3m2!1svi!2sus!4v1759300663691!5m2!1svi!2sus" 
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[400px] md:h-[500px] rounded-sm shadow-md"
          />

          {/* Contact Info */}
          <div className="min-w-[430px] flex flex-col gap-6 bg-white p-6 rounded-sm shadow-md">
            <div className="flex items-start gap-3 text-[17px]">
              <MapPin className="text-slate-700 mt-1" />
              <p><strong>Địa chỉ: </strong> 123 Đường ABC, Quận XYZ, TP.HCM</p>
            </div>
            <div className="flex items-start gap-3 text-[17px]">
              <Phone className="text-slate-700 mt-1" />
              <p><strong>Điện thoại: </strong> 0123 456 789</p>
            </div>
            <div className="flex items-start gap-3 text-[17px]">
              <Mail className="text-slate-700 mt-1" />
              <p><strong>Email: </strong>tonthatbach2004@gmail.com</p>
            </div>
            <div className="flex items-start gap-3 text-[17px]">
              <Clock className="text-slate-700 mt-1" />
              <p><strong>Giờ làm việc: </strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </>
  );
}
