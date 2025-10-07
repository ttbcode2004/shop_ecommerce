import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getFlashSaleProducts } from "../../../store/shop/products-slice";
import { formatPrice } from "../../../utils/formatPrice";
import Loader1 from "../../ui/Loader1";

function Countdown({ endDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endDate) {
      setTimeLeft("");
      return;
    }

    function update() {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Đã kết thúc");
        return;
      }
      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2 items-center text-[14px] lg:text-xl font-bold bg-black/40 px-2 md:px-4 py-2 rounded-sm">
      ⏰ <span className="font-mono tracking-widest">{timeLeft}</span>
    </div>
  );
}

// ProductCard memoized để không re-render khi props không đổi
const ProductCard = React.memo(function ProductCard({ product, idx }) {
  const navigate = useNavigate();
  const progress = Math.min(200, 100);

  return (
    <div
      key={product._id}
      className={`relative h-83 bg-white text-black rounded-sm shadow-lg overflow-hidden group flex flex-col transition
        ${idx > 5 ? "hidden lg:block":"" } ${idx > 7 ? "lg:hidden xl:block":"" } ${idx > 9 ? "xl:hidden 2xl:block":"" }`}
    >
      <div
        className="absolute top-1 left-1 bg-gradient-to-r from-red-600 to-orange-600 text-white p-1 rounded-sm font-medium text-[13px] shadow-md z-10"
      >
        -{product.flashSale?.discountPercent}% 
      </div>

      <div className="relative h-50 w-full overflow-hidden" onClick={() => navigate(`/products/${product.slug}`)}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-125 cursor-pointer"
        />
        <div className="text-[16px] absolute bottom-1 left-1 flex gap-2">
          <p className="bg-gradient-to-r from-red-600 to-orange-500 p-1 rounded-sm text-white font-medium shadow-md">
            {formatPrice(product.finalPrice)}
          </p>
          <p className=" line-through bg-gradient-to-r from-red-400 to-orange-400 p-1 rounded-sm text-white font-light shadow-md">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      <div className="p-2 flex flex-col flex-grow ">
        <h3 className="font-semibold text-[16px] xl:text-[17px] line-clamp-2">
          {product.name}
        </h3>

        <div className="absolute bottom-2 left-2 right-2">
          <div>
            <p className="text-[15px] text-gray-700">Đã bán {product.sold}</p>
            {/* <p className="mt-1 block text-sm font-bold text-red-600 animate-pulse min-h-[1rem]">
              {progress >= 50 ? "Sắp hết hàng 🔥" : "\u00A0"}
            </p> */}
          </div>

          <Link to={`/products/${product.slug}`} className="mt-1 flex justify-between gap-2 text-[16px]">
            <button className="px-2 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white  rounded-sm font-semibold hover:from-red-700 transition">
              Chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default function ShoppingFlashSale() {
  const flashSaleLoading = useSelector((state) => state.shopProducts.flashSaleLoading);
  const flashSaleProducts = useSelector((state) => state.shopProducts.flashSaleProducts);

  const dispatch = useDispatch();

  // memoize nearestEnd: chỉ thay đổi khi flashSaleProducts thay đổi
  const nearestEnd = useMemo(() => {
    if (!flashSaleProducts?.length) return null;
    const times = flashSaleProducts
      .map((p) => {
        const t = new Date(p.flashSale?.endDate).getTime();
        return Number.isFinite(t) ? t : Infinity;
      })
      .filter((t) => Number.isFinite(t));
    if (!times.length) return null;
    const min = Math.min(...times);
    return new Date(min);
  }, [flashSaleProducts]);

  useEffect(() => {
    dispatch(getFlashSaleProducts({ limit: 12 }));
  }, [dispatch]);

  return (
    <div className="relative py-4 px-4 md:px-6 bg-gradient-to-r from-red-700 via-orange-600 to-red-500 text-white rounded-sm shadow-xl">
      {flashSaleLoading && <Loader1 isLoading={flashSaleLoading} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="sm:text-lg lg:text-2xl font-extrabold tracking-wide uppercase">🔥 Flash Sale</h2>
          <h2 className="text-[14px] md:text-[16px] font-medium tracking uppercase underline underline-offset-4 cursor-pointer" 
            onClick={() => window.location.assign("/flashsale")}>
            Xem tất cả
          </h2>
        </div>

        {/* Chỉ Countdown component này cập nhật mỗi giây */}
        <Countdown endDate={nearestEnd} />
      </div>

      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {flashSaleProducts?.map((product, idx) => (
          <ProductCard key={product._id} product={product} idx={idx} />
        ))}
      </div>
    </div>
  );
}
