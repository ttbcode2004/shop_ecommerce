import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCartItem, deleteLocalCartItem, updateCart, updateLocalCartItem } from "../../../store/shop/cart-slice";
import { Trash2 } from "lucide-react";
import { colorTranslate, selectColor } from "../../../config";
import { formatPrice } from "../../../utils/formatPrice";
import { toSlug } from "../../../utils/toSlug";
import QuantityInput from "../../ui/QuantityInput";

export default function CartListDesktop({ idx, item, selectedItems, setSelectedItems}) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();  
  const dispatch = useDispatch();
  
  const slug = toSlug(item.name || item.product.name)
  
  const updateItem = ( itemId, productId, color, quantity, size, item, oldSize = null, oldColor = null) => {
    if (quantity === null || quantity <= 0) return;
    
    const existing = selectedItems.findIndex(item => item.product._id === productId && item.size === size && item.color === color)
    
    if (existing !== -1) {
      setSelectedItems((prev) =>
        prev.map((item, idx) => {
          if(idx ===  existing){
            
            return {...item, quantity: quantity}
          }
          else
            return item
        })
      )
    } 
    
    if (user) {
      dispatch(updateCart({cartId: itemId,
          productId, color, quantity,size,}) );
    } else {
      dispatch(updateLocalCartItem({productId, size, color, quantity,
          sizes: item, oldSize, oldColor,}) );
    }
  };

  const deleteItem = (itemId=null, productId, size, color) => {
    if (user) {
      dispatch(deleteCartItem({ cartId: itemId }));
    } else {
      dispatch(deleteLocalCartItem({ productId, size, color }));
    }
  };

  const toggleSelectItem = (item, idx, checked) => {
    if (checked) {
      if (!user) setSelectedItems((prev) => [...prev, { ...item, idx }]);
      else setSelectedItems((prev) => [...prev, item]);
    } else {
      if (!user)
        setSelectedItems((prev) =>
          prev.filter((selected) => selected.idx !== idx)
        );
      else
        setSelectedItems((prev) =>
          prev.filter((selected) => selected._id !== item._id)
        );
    }
  };
  
  return (
    <div className="hidden md:grid md:grid-cols-[110px_1fr_86px_90px_50px_30px] lg:grid-cols-[110px_1fr_100px_110px_60px_40px] gap-2 items-center">
      <div
        className="relative cursor-pointer group"
        onClick={() => navigate(`/products/${slug || item.productId}`)}
      >
        <img
          src={item.image || item.product.images[0]}
          alt={item.name || item.product.name}
          className="w-24 h-22 object-cover rounded-lg transform group-hover:scale-105 transition duration-300 shadow"
        />
        {!item.product?.isActive && 
          <p className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-sm w-24 h-26 text-red-200 font-medium text-center p-2">
            Đã ngừng kinh doanh
          </p>
        }
        <button className="absolute w-20 top-1/2 left-12 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 text-white px-2 rounded-lg bg-black/60">
          Chi tiết
        </button>
      </div>

      <div className="font-medium h-full md:text-[16px] lg:text-lg flex flex-col gap-1">
        <h2 className="line-clamp-1 text-[18px]">{item.name || item.product.name}</h2>
        <div className="text-red-600 font-semibold mt-[-4px] mb-[4px]">
          {formatPrice(item.finalPrice || item.product.finalPrice)}
        </div>
        <div className="flex items-center gap-1 text-base">
          <QuantityInput
            disabled={!item.product?.isActive}
            onChange={(quantity) =>
              updateItem(
                item._id,
                item.product?._id || item.productId,
                item.color,
                quantity,
                item.size,
                item.product.sizes
              )
            }
            initial={item.quantity}
            max={
              item.product?.sizes
                ?.find((s) => s.size === item.size)
                ?.colors?.find((c) => c.color === item.color)?.quantity || 99
            }
          />
          <p className="text-slate-600 text-[15px]">
            (
            {item.product?.sizes
              ?.find((s) => s.size === item.size)
              ?.colors?.find((c) => c.color === item.color)?.quantity || '∞'}
            )
          </p>
        </div>
      </div>

      {/* Size */}
      <select
        disabled={!item.product?.isActive}
        className="text-slate-950 mr-7 font-medium px-1 py-1.5 border border-slate-500 rounded focus:outline-none focus:ring-1 focus:ring-slate-800 hover:border-slate-800"
        value={item.size}
        onChange={(e) =>
          updateItem(
            item._id,
            item.product?._id || item.productId,
            item.color,
            item.quantity,
            e.target.value,
            item.product.sizes,
            item.size,
            item.color
          )
        }
      >
        {item.product?.sizes?.map((size, idx) => (
          <option value={size.size} className="cursor-pointer" key={idx}>
            {size.size}
          </option>
        ))}
      </select>

      {/* Màu */}
      <select
        disabled={!item.products?.isActive}
        className={`text-slate-950 text-sm mr-2 lg:text-base font-medium px-1 py-1.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-800 hover:border-slate-800 cursor-pointer 
          ${selectColor(item.color)}`}
        value={item.color}
        onChange={(e) =>
          updateItem(
            item._id,
            item.product?._id || item.productId,
            e.target.value,
            item.quantity,
            item.size,
            item.product.sizes,
            item.size,
            item.color
          )
        }
      >
        {item.product?.sizes
          ?.filter((s) => s.size === item.size)
          .flatMap((s) =>
            s.colors?.map((color, idx) => {
              if (color.quantity === 0) return null;
              return (
                <option
                  key={idx}
                  value={color.color}
                  className={`cursor-pointer outline-none border-0 
                    ${selectColor(color.color)}`}
                >
                  {colorTranslate[color.color?.toLowerCase()] || color.color}
                </option>
              );
            })
          )}
      </select>

      {/* Delete */}
      <button
        onClick={() => deleteItem(
          item._id, 
          item.product?._id || item.productId, 
          item.size, 
          item.color
        )}
        className="p-2 w-8 text-red-500 hover:bg-red-50 rounded-lg mr-2 ml-2"
      >
        <Trash2 size={18} />
      </button>

      {/* Checkbox */}
      <input
        disabled={!item.product?.isActive}
        type="checkbox"
        className="w-5 h-5 rounded-md border-2 border-yellow-500 accent-yellow-500 cursor-pointer hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition duration-200"
        checked={!user ? selectedItems.some(selected => selected.idx === idx): selectedItems.some(selected => selected._id === item._id)}
        onChange={(e) => toggleSelectItem(item,idx, e.target.checked)}
      />
    </div>
  );
}