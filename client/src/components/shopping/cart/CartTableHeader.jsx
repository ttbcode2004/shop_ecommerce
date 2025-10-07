export default function CartTableHeader() {
  return (
    <div className="hidden mt-4 md:grid md:grid-cols-[110px_1fr_86px_90px_35px_30px] lg:grid-cols-[110px_1fr_100px_110px_40px_40px] gap-2 px-4 py-3 bg-slate-200 rounded-sm font-semibold text-gray-900 mb-4">
      <span>Ảnh</span>
      <span>Tên</span>
      <span>Size</span>
      <span>Màu</span>
      <span>Xóa</span>
      <span>Chọn</span>
    </div>
  );
}