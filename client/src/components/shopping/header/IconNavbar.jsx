import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User } from 'lucide-react'

export default function IconNavbar() {
  const { userData} = useSelector((state) => state.shopUser);
  const { number } = useSelector((state) => state.shopCart);
  const { numberWishlist } = useSelector((state) => state.shopWishlist);
  const navigate = useNavigate();

  const nameUser = userData?.name.split(" ")

  return (
    <div className='flex gap-4 items-center'>
      <div onClick={() => navigate("/account")} className="relative group">
        <div className="flex items-center gap-2 cursor-pointer">
          {userData?.photo ? (
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={userData?.photo}
            />
          ) : (
            <User className="w-5 " />
          )}
          {userData?.name ? <span className="text-sm font-medium">{nameUser[nameUser.length - 1].slice(0,6)}</span> :""}
        </div>
      </div>

      <Link to="/wishlist" className="relative hover:text-green-700 transition">
        <Heart size={30} className="w-6" />
        <span className="absolute -right-2 -bottom-2 w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition">
          {numberWishlist}
        </span>
      </Link>

      <Link to="/cart" className="relative hover:text-red-700 transition">
        <ShoppingCart size={30} className="w-6" />
        <span className="absolute -right-2 -bottom-2 w-5 h-5 flex items-center justify-center bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition">
          {number}
        </span>
      </Link>
    </div>
  )
}
