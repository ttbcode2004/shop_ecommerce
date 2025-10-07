import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addLocalCartItem, addToCart, cartToOrder } from "../../store/shop/cart-slice";
import { addToLocalWishlist, addWishlist } from "../../store/shop/wishlist-slice";
import { ShoppingCart, Check, Plus, Heart } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { toast } from "react-toastify";

export default function ProductItem({ product}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const {_id, name, images, finalPrice, discountPercent, flashSale, sizes, slug, isFlashSaleActive } = product;

  let discount = isFlashSaleActive ? flashSale.discountPercent : discountPercent;

  const handleSelectSize = (size) => {
    if (selectedSize === size) {
      setSelectedSize(null);
      setSelectedColor(null);
    } else {
      setSelectedSize(size);
      setSelectedColor(null);
    }
  };

  const handleToAddToWishlist = () => {
    if (user) {
      dispatch(addWishlist({ productId: _id }));
    } else {
      dispatch(
        addToLocalWishlist({
          productId: _id,
          name: name,
          slug: slug,
          image: images[0],
          finalPrice: finalPrice,
          discountPercent: discount,
        })
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize?.size) {
      toast.warn("Vui lòng chọn size");
      return;
    }

    if (!selectedColor) {
      toast.warn("Vui lòng chọn màu");
      return;
    }

    if (user) {
      dispatch(
        addToCart({
          productId: _id,
          size: selectedSize.size,
          color: selectedColor.color,
          quantity: 1,
        })
      );
    } else {
      dispatch(
        addLocalCartItem({
          productId: _id,
          size: selectedSize.size,
          color: selectedColor.color,
          quantity: 1,
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
          quantity: 1,
          product,
          image: images[0],
          stock: selectedColor.quantity,
        },
      ])
    );
    navigate("/placeOrder");
  };

  return (
            // ${ idx > 5 ? "hidden lg:block" : "" } ${idx > 7 ? "lg:hidden 2xl:block" : ""}
    <div className={`group h-full max-w-[300px] bg-white rounded-sm shadow-sm overflow-hidden relative cursor-pointer `}
    >
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
          -{discount}%
        </span>
      )}

      <Link
        to={`/products/${slug}`}
        className="block relative overflow-hidden rounded-sm"
      >
        <img
          src={images[0]}
          alt={name}
          className="w-full h-65 object-cover transition-transform duration-500 hover:scale-125"
        />
      </Link>

      <div className="relative">
        <div className="absolute bottom-0 font-semibold lg:text-[15px] right-1 rounded-xl gap-4 text-white  flex flex-col items-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToAddToWishlist();
            }}
            className="flex items-center gap-1 p-1 rounded-sm bg-gray-100/90 text-black hover:bg-gray-300 transition"
          >
            <Heart size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="flex items-center gap-1 p-1 rounded-sm bg-gray-100/90 text-black hover:bg-gray-300 transition"
          >
            <Plus size={14} />
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToCheckout();
            }}
            className="flex items-center rounded-sm bg-gray-100/90 text-black hover:bg-gray-300 transition"
          >
            <span className="text-[16px] lg:px-2  md:px-1 px-1 py-1">
              Mua Ngay
            </span>
          </button>
        </div>
      </div>

      <div className="p-2 flex flex-col sm:text-[17px] text-[16px] h-full">
        <h3 className="font-semibold line-clamp-2">{name}</h3>
        <p className=" font-normal text-[18px] mb-1">
          {formatPrice(finalPrice)}
        </p>

        {sizes?.length > 0 && (
          <div className="flex flex-col gap-1 bg">
            <div className="grid grid-cols-5 gap-1">
              {sizes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSize(s)}
                  className={`px-0.5 py-0.5 rounded-sm border text-[12px] transition-transform 
                    ${
                      selectedSize?.size === s.size
                        ? "bg-pink-400 text-white scale-110"
                        : "bg-white border-slate-300 hover:border-pink-900"
                    }`}
                >
                  {s.size}
                </button>
              ))}
            </div>

            {selectedSize && (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSize.colors.map((c, i) => {
                  const isSelected = selectedColor?.color === c.color;
                  const isOutOfStock = c.quantity === 0;

                  if (isOutOfStock) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-5 flex items-center justify-center rounded-sm relative 
                        ${
                          isSelected ? "border-orange-400 border-2 scale-110" : " border-1 border-slate-300"
                        }`}
                      style={{ backgroundColor: c.color }}
                    >
                      {isSelected && (
                        <Check className="text-slate-500 text-sm font-bold" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
