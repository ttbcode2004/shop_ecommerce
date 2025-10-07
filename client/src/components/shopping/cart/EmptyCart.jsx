import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full mx-auto mt-12 md:px-10 lg:px-20 px-6 py-10">
      <div className="text-center py-20">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-500 mb-4">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-400 mb-8">
          Hãy thêm một số sản phẩm vào giỏ hàng của bạn
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}