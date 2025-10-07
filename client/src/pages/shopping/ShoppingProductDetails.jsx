import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductBySlug, getRelatedProducts } from "../../store/shop/products-slice";
import { addLocalCartItem, addToCart, cartToOrder} from "../../store/shop/cart-slice";
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Check,} from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ProductItem from "../../components/ui/ProductItem";
import QuantityInput from "../../components/ui/QuantityInput";
import Loader from "../../components/ui/Loader";
import Loader1 from "../../components/ui/Loader1";
import Footer from "../../components/ui/Footer";
import userPhoto from "../../assets/user.png";

export default function ShoppingProductDetails() {
  const { user } = useSelector((state) => state.auth);
  const { productDetails, productDetailsLoading, relatedLoading, relatedProducts } = useSelector((state) => state.shopProducts);
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedLimit, setRelatedLimit] = useState(10); 
  
  const {
    name = "",
    summary = "",
    description = "",
    images = [],
    price = 0,
    finalPrice = 0,
    ratingsAverage = 0,
    ratingsQuantity = 0,
    isFlashSaleActive,
    flashSale,
    discountPercent,
    sizes = [],
    sold = 0,
    stock = 0,
    reviews = [],
  } = productDetails || {};

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelectSize = (size) => {
    if (selectedSize === size) {
      setSelectedSize(null);
      setSelectedColor(null);
    } else {
      setSelectedSize(size);
      setSelectedColor(null);
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedSize?.size) {
      toast.warn("Vui lòng chọn size");
      return;
    }

    if (!selectedColor?.color) {
      toast.warn("Vui lòng chọn màu");
      return;
    }

    if (user) {
      dispatch(
        addToCart({
          productId: productDetails._id,
          size: selectedSize.size,
          color: selectedColor.color,
          quantity,
        })
      );
    } else {
      dispatch(
        addLocalCartItem({
          productId: productDetails._id,
          size: selectedSize.size,
          color: selectedColor.color,
          quantity,
          stock: selectedColor.quantity,
        })
      );
    }
  };

  const handleToCheckout = () => {
    if (!selectedSize?.size) {
      toast.warn("Vui lòng chọn size");
      return;
    }

    if (!selectedColor) {
      toast.warn("Vui lòng chọn màu");
      return;
    }
    
    dispatch(
      cartToOrder([
        {
          color: selectedColor.color,
          size: selectedSize.size,
          quantity,
          product: productDetails,
          image: productDetails.images[0],
          stock: selectedColor.quantity,
        },
      ])
    );
    navigate("/placeOrder");
  };

  const handleLoadMore = () => {
    setRelatedLimit((prev) => prev + 8);
  };

  useEffect(() => {
    dispatch(getProductBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    dispatch(getRelatedProducts({ slug, limit: relatedLimit }));
  }, [dispatch, slug, relatedLimit]);

  if (productDetailsLoading || productDetails === null) {
    return <Loader isLoading={productDetailsLoading}/>
  }

  return (
    <>
    <div className="px-6 md:px-10 lg:px-20 mt-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 ">
        <div className="flex gap-2 px-2 sm:px-0 h-[80vh] sm:h-[60vh] lg:h-[70vh] 2xl:h-[80vh]">
          <div className="hidden sm:flex flex-col gap-1 overflow-y-auto bg h-auto overflow-hidden">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${name}-${idx}`}
                onClick={() => setCurrentImageIndex(idx)}
                className={`sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover rounded-sm cursor-pointer 
                  border-3 flex-shrink-0 transition-transform duration-500 hover:scale-110
                  ${
                  currentImageIndex === idx
                    ? "border-slate-400"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          <div className="relative w-full h-full sm:w-[39vw] md:w-[40vw] lg:w-[46vw] 2xl:w-[50vw] overflow-hidden rounded-sm">
            <img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={name}
              className="object-cover w-full h-full cursor-pointer transition-transform duration-500 hover:scale-110"
            />

            <button
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 opacity-95 text-gray-300 hover:text-gray-400"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-95 text-gray-300 hover:text-gray-400"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex text-[16px] flex-col gap-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{name}</h1>
          <p className="text-gray-500 text-lg sm:text-[17px] lg:text-[18px]">{summary}</p>

          <div className="flex gap-4">
            <div className="flex gap-2">
              {isFlashSaleActive &&
                <p className="bg-red-500 text-white px-2 py-0.5 rounded-sm">Flashsale</p>
              }
              <p className="text-red-600 text-[17px]">- {isFlashSaleActive ? flashSale.discountPercent:discountPercent}%</p>
              </div>

            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(ratingsAverage) ? "fill-yellow-400" : ""
                  }
                />
              ))}
              <span className="text-gray-600">({ratingsQuantity})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-[20px] font-medium text-red-500">
              {formatPrice(finalPrice)}
            </p>

            <p className="text-[20px] line-through text-gray-600">
              {formatPrice(price)}
            </p>
          </div>

          <p className="text-gray-800 text-[17px]">Đã bán: {sold}</p>
        
          <span className="text-gray-800 text-[17px]">
            kho: {selectedColor ? selectedColor.quantity : stock}
          </span>
      
          {sizes?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-medium text-[17px]">Chọn Size:</span>
              <div className="flex gap-1 text-[14px] flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={()=>handleSelectSize(s)}
                    className={`px-2 py-0.5 border rounded-sm transition-transform ${
                      selectedSize?.size === s.size
                        ? "bg-pink-400 text-white scale-110"
                        : "bg-white border-gray-300 hover:border-pink-900"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedSize && selectedSize.colors.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-medium">Chọn Màu:</span>

              <div className="flex gap-1 flex-wrap">
                {selectedSize.colors.map((c) => {
                  const isSelected = selectedColor?.color === c.color;
                  const isOutOfStock = c.quantity === 0;

                  if (isOutOfStock) return null;

                  return (
                    <button
                      key={c.color}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-6 rounded-sm border-2 flex items-center justify-center transition-transform relative
                        ${isSelected ? "scale-110 border-blue-600" : "border-slate-300"}`}
                      style={{ backgroundColor: c.color }}
                    >
                      <span className="sr-only">{c.color}</span>
                      {isSelected && (
                        <Check className="text-slate-500 text-sm font-bold" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-2">
            <p className="text-[17px] mb-1">Số lượng</p>
            <QuantityInput
              max={selectedColor?.quantity}
              onChange={setQuantity}
            />
          </div>

          <div className="flex mt-4 lg:text-sm gap-4 ">
            <button
              disabled={!productDetails.isActive}
              className={`flex items-center text-[16px] lg:text-[18px] gap-1 justify-center p-2 rounded-sm transition bg-gray-800 text-white hover:bg-gray-900`}
              onClick={() => handleAddToCart()}
            >
              <ShoppingCart size={20} /> Thêm vào giỏ hàng
            </button>
            <button
              disabled={!productDetails.isActive}
              className={`p-2 text-[16px] lg:text-[18px] rounded-sm transition bg-gray-800 text-white hover:bg-gray-900`}
              onClick={() => handleToCheckout()}
            >
              Mua ngay
            </button>
          </div>
          {!productDetails.isActive && (
            <p className="mt-3 text-red-400 text-xl font-medium">
              ⚠️ Sản phẩm này đã ngừng kinh doanh
            </p>
          )}
        </div>
      </div>
 
      <div className="mt-8 text-lg">
        <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
        <p className="text-gray-900 mt-2">{description}</p>
        <p className="text-gray-900 mt-1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi eum itaque, ratione aperiam eos consectetur maxime quis beatae, odio accusamus a quod, eaque fuga atque tempora dolores est optio nulla?</p>
      </div>
          
      {/* Reviews */}
      {reviews?.length >= 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm <span className="text-gray-600 text-xl">({productDetails.reviews?.length})</span></h2>
          <div className="flex flex-col gap-4">
            {reviews.map((r, idx) => (
              <div key={idx} className="flex gap-4">
                <img
                  src={r.user.photo || userPhoto}
                  alt={r.user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = userPhoto;
                  }}
                />

                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-gray-900 text-[16px] truncate max-w-[200px]">
                    {r.user.name}
                  </p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.round(r.rating) ? "fill-yellow-400 text-amber-400" : ""}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700" >{format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", {locale: vi,})}</p>
                  <p className="text-gray-900 text-[17px]">{r.review}</p>
                </div>
              </div>
            ))}
             
          </div>
        </div>
      )}
      
      <div className="items-center">
        <h2 className="text-2xl font-semibold mb-4 mt-8 text-center">Có thể bạn thích</h2>

        <div className="grid lg:gap-7 gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 relative">
          {relatedLoading && <Loader1 isLoading={relatedLoading} />}
          {relatedProducts?.map((product, idx) => (
            <ProductItem idx={idx} key={product._id} product={product} />
          ))}
        </div>
        {relatedProducts?.length >= relatedLimit ? (
          <button
            onClick={handleLoadMore}
            className="w-full mt-8 text-lg hover:underline underline-offset-8 transition-all text-gray-700"
          >
            Xem thêm
          </button>
        ) : (
          <p className="text-center text-lg mt-8 text-gray-700">
            Đã hiển thị tất cả sản phẩm liên quan
          </p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
