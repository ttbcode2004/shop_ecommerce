import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearLocalWishlist, clearWishlistUser, deleteWishlist, getWishlist, removeFromLocalWishlist } from "../../store/shop/wishlist-slice";
import { formatPrice } from "../../utils/formatPrice";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import Loader from "../../components/ui/Loader";

export default function ShoppingWishlist() {
  const { user } = useSelector((state) => state.auth);
  const {wishlistItems, localWishlistItems, isLoadingWishlist, numberWishlist} = useSelector((state) => state.shopWishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false)

  const currentWishlist = user ? wishlistItems : localWishlistItems;

  useEffect(() => {
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user, user?.id]);

  const removeItemFromWishlist = (productId) => {
    if (user) {
      dispatch(deleteWishlist({ productId }));
    } else {
      dispatch(removeFromLocalWishlist({ productId }));
    }
  };

  const clearWishlist = () => {
    if (user) {
      dispatch(clearWishlistUser());
    } else {
      dispatch(clearLocalWishlist());
    }
    setOpen(false)
  };

  return (
    <div className=" md:px-12 lg:px-26 px-6 p-4 mt-2">
      {isLoadingWishlist && <Loader isLoading={isLoadingWishlist} />}
      <h1 className="text-2xl font-bold ">
        Danh sách yêu thích ({numberWishlist})
      </h1>
      <div className="flex justify-start my-4">
       {currentWishlist.length > 0 &&  
        <button
          variant="outline"
          className="underline font-medium underline-offset-5 text-rose-600 hover:text-rose-700"
          onClick={()=> setOpen(true)}
        >
          Xóa toàn bộ
        </button>}
      </div>

      {currentWishlist.length === 0 ? (
        <p className="text-gray-600">Danh sách yêu thích trống.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 xl:gap-6">
          {currentWishlist.map((item) => (
            <div
              onClick={() => navigate(`/products/${item.slug}`)}
              key={item.productId}
              className="rounded-sm cursor-pointer overflow-hidden shadow-sm hover:shadow-lg flex flex-col justify-between transition duration-150"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-46 object-cover mb-2 hover:scale-110 tracking-tight transition-transform"
              />
              <div className="px-2">
                <h2 className="text-lg font-semibold line-clamp-2">{item.name}</h2>
                <p className="text-gray-700 font-medium">
                  {formatPrice(item.finalPrice)}{" "}
                  <span className="ml-2">-{item.discountPercent}%</span>
                </p>
              </div>
              <button
                variant="destructive"
                className="my-2 font-medium text-rose-600 hover:text-rose-700"
                onClick={(e) => {
                  e.stopPropagation(); // tránh navigate
                  removeItemFromWishlist(item.productId);
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={open} 
        onClose={()=>setOpen(false)} 
        title="Xóa Yêu Thích"
        onConfirm={clearWishlist} 
        message={<>Bạn có chắc chắn muốn xóa toàn bộ yêu thích?</>}/>
    </div>
  );
}
