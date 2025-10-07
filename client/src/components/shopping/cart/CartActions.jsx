import { useDispatch, useSelector } from "react-redux";
import { clearCart, clearLocalCart } from "../../../store/shop/cart-slice";
import { Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "../../ui/DeleteConfirmModal";

export default function CartActions({ selectedItems, setSelectedItems }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen]= useState(false);

  const confirmClear = ()=>{
     if (user) {
      dispatch(clearCart(user.id));
      setOpen(false)
      setSelectedItems([]);
    } else{
      dispatch(clearLocalCart());
      setOpen(false)
      setSelectedItems([]);
    }
  }

  const handleClearSelected = () => {
    setSelectedItems([]);
  };

  return (
    <div className="flex gap-3 items-center mt-2">
      {selectedItems.length > 0 && (
        <button
          onClick={handleClearSelected}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
        >
          <ShoppingBag size={16} />
          Bỏ chọn ({selectedItems.length})
        </button>
      )}
      
      <button
        onClick={()=>setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
      >
        <Trash2 size={16} />
        Xóa toàn bộ giỏ hàng
      </button>

      <DeleteConfirmModal 
        isOpen={open} 
        onClose={()=>setOpen(false)} 
        title="Xóa Giỏ Hàng"
        onConfirm={confirmClear} 
        message={<>Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?</>}/>
    </div>
  );
}