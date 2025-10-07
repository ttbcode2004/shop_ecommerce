import hero1 from "../assets/hero1.avif";
import hero2 from "../assets/hero2.avif";
import hero3 from "../assets/hero3.avif";
import hero4 from "../assets/hero4.avif";

import shirt from "../assets/shirt.png";
import jacket from "../assets/jacket.png";
import polo from "../assets/polo.png";
import short from "../assets/short.webp";
import pant from "../assets/pant.webp";

export const slides = [
  {
    image: hero1,
    slogan: "Flash Sale - Giảm sốc đến 70%",
    description: "Săn ngay hàng hot với mức giá không thể rẻ hơn. Số lượng có hạn!",
    id: "flash-sales",
  },
  {
    image: hero2,
    slogan: "Áo Mùa Xuân",
    description: "Khám phá những mẫu áo đang được giới trẻ yêu thích nhất.",
    id: "ao",
  },
  {
    image: hero3,
    slogan: "Quần Thu Đông",
    description: "Top items được khách hàng tin tưởng và lựa chọn nhiều nhất.",
    id: "quan",
  },
  {
    image: hero4,
    slogan: "Sản phẩm nổi bậc - Special",
    description: "Cập nhật bộ sưu tập nổi bậc, bắt kịp mọi xu hướng thời trang.",
    id: "special",
  },
];

export const categories = [
  { name: "Áo Thun", slug: "ao-thun", img: shirt },
  { name: "Áo Khoác", slug: "ao-khoac", img: jacket },
  { name: "Áo PoLo", slug: "ao-polo", img: polo },
  { name: "Quần Short", slug: "quan-short", img: short },
  { name: "Quần Dài", slug: "quan-dai", img: pant },
];

export const shirtList = [
  { name: "ÁO THUN",link: "ao-thun", value: "shirt" },
  { name: "Áo POLO",link: "ao-polo", value: "jacket" },
  { name: "ÁO KHOÁC",link: "ao-khoac", value: "jacket"},
];
export const pantList = [
  { name: "QUẦN SHORT",link: "quan-short", value: "shirt" },
  { name: "QUẦN DÀI",link: "quan-dai", value: "jacket" },
];

export const categoryList = [
  { name: "Áo Thun", slug: "ao-thun", value: "áo thun" },
  { name: "Áo Polo", slug: "ao-polo", value: "áo polo" },
  { name: "Áo Khoác", slug: "ao-khoac", value: "áo khoác" },
  { name: "Quần Short", slug: "quan-short", value: "quần short" },
  { name: "Quần Dài", slug: "quan-dai", value: "quần dài" }
];

export const peopleList = [
  { name: "Nam", slug: "nam", value: "nam" },
  { name: "Nữ", slug: "nu", value: "nữ" },
  { name: "Trẻ Em", slug: "tre-em", value: "trẻ em" }
];


export const statusList = [
  { name: "Chờ xác nhận", value: "processing", bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200", hover: "hover:bg-pink-200",},
  { name: "Đã đặt hàng", value: "order placed", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", hover: "hover:bg-blue-300", },
  { name: "Đang giao", value: "shipping", bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", hover: "hover:bg-yellow-300", },
  { name: "Đã giao", value: "delivered", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", hover: "hover:bg-green-300", },
  { name: "Đã hủy", value: "cancelled", bg: "bg-red-300", text: "text-red-700", border: "border-red-200", hover: "hover:bg-red-400", },
];

export function getStatusColor(status) {
  if (!status) return "";
  const normalized = status.toLowerCase();
  const stat = statusList.find(item => item.value.toLowerCase() === normalized);

  return stat ? `${stat.bg} ${stat.text} ${stat.border}` : "";
}

export function getStatusText(status) {
  if (!status) return "";
  const normalized = status.toLowerCase();
  const stat = statusList.find(item => item.value.toLowerCase() === normalized);

  return stat ? `${stat.name}` : "";
}

export const colorTranslate = {
  red: "Đỏ",
  blue: "Xanh dương",
  green: "Xanh lá",
  black: "Đen",
  white: "Trắng",
  yellow: "Vàng",
  gray: "Xám",
  pink: "Hồng",
};


export const adminHeaderProduct = [
  "Tên sản phẩm",
  "Giá",
  "Đã bán",
  "Kho",
  "Mặt hàng",
  "Người dùng",
  "Thao tác",
  "FLASH SALE"
];

export const adminHeaderOrder = [
  "Mã đơn hàng",
  "Tên",
  "Giá",
  "Thời gian đặt",
  "PT",
  "Trạng thái",
  "Xem",
];

export const adminHeaderSubOrder = [
  "Mã đơn hàng",
  "Giá",
  "Thời gian đặt",
  "PT",
  "Trạng thái",
  "Xem",
];

export const adminHeaderUser = [
  "Tên",
  "SĐT",
  "Email",
  "Ngày tạo",
  "Đã đặt",
  "Tổng chi tiêu",
  "Giỏ hàng",
  "Chặn",
];

export const adminHeaderVoucher = [
  "Mã Voucher",
  "Mô tả",
  "Giảm giá",
  "Thời gian",
  "Sử dụng",
  "Trạng thái",
  "Hành động",
];

export const adminSelectClass = "appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-sm bg-white text-black shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition text-xs lg:text-sm"
export const focusInputClass = "border border-slate-500 rounded-sm focus:border-black focus:ring focus:ring-black/10 transition"
export const inputSearchAdminClass = "w-full pl-10 pr-4 py-2 text-sm shadow-sm shadow-slate-200 border border-slate-500 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
export const inputCheckboxClass = "w-5 h-5 rounded border-2 border-yellow-500 accent-yellow-500 cursor-pointer hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition duration-200"

export const availableColors = [
  { name: "Đen", value: "black", hex: "#000000" },
  { name: "Trắng", value: "white", hex: "#FFFFFF" },
  { name: "Hồng", value: "pink", hex: "#FFC0CB" },
  { name: "Xanh lá", value: "green", hex: "#008000" },
  { name: "Vàng", value: "yellow", hex: "#FFFF00" },
  { name: "Xanh dương", value: "blue", hex: "#0000FF" },
  { name: "Đỏ", value: "red", hex: "#FF0000" },
];

export function getColorName(color) {
  if (!color) return "";
  const normalized = color.toLowerCase();
  const stat = availableColors.find(item => item.value.toLowerCase() === normalized);

  return stat ? {name: stat.name, hex: stat.hex} : "";
}


const colorMap = {
  red: "bg-red-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  black: "bg-slate-700 text-white",
  pink: "bg-pink-400",
  white: "bg-white text-black",
};

export const selectColor = (color) => {
  return colorMap[color] || "bg-gray-300"; // fallback
};

