import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview } from "../../../store/shop/review-slice";
import { updateOrderReview } from "../../../store/shop/order-slice";
import { formatPrice } from "../../../utils/formatPrice";
import { Star, X } from "lucide-react";

export default function CreateReview({ onClose, product,orderId, idxProduct }) {
  const { userData } = useSelector((state) => state.shopUser);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState();
  const [review, setReview] = useState("");
    
  const overlayRef = useRef();

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {productId: product.product, review, rating, nameUser: userData.name, photoUser: userData.photo || "", userId: userData._id}

    dispatch(addReview(formData))
    
    dispatch(updateOrderReview({orderId, idxProduct}))
    
    setRating(5);
    setReview("");
    onClose()
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 md:px-10 lg:px-20 px-6"
    >
      <div className="max-w-4xl bg-white p-4 rounded-sm max-h-[90vh] shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-400 pb-3 mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Viết đánh giá của bạn
          </h1>
          <button
            onClick={() => onClose(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
            <img
                className="w-40 h-40 object-cover rounded-sm"
                src={product.image}
                alt={product.name}
            />
            <div className="font-medium">
                <h2>{product.name}</h2>
                <p>Giá: {formatPrice(product.price)}</p>
            </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className=" space-y-4"
        > 
            <label className="text-orange-700">Đánh giá sao</label>
            <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => {
              const starValue = idx + 1;
              return (
                <Star
                  key={idx}
                  size={28}
                  className={`cursor-pointer transition ${
                    starValue <= (hover || rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
          </div>

          <label className="text-slate-800">Viết đánh giá</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn..."
            className="w-full border text-[20px] rounded-sm p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-slate-800"
            rows={4}
          />

          {/* Submit */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm font-medium transition"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
}
