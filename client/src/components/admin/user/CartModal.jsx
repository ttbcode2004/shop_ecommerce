import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../../utils/formatPrice";
import { colorTranslate } from "../../../config";

const CartModal = ({ isOpen, onClose, cart, userName }) => {
  if (!isOpen) return null;
  console.log(cart);
  
  // Calculate total cart value
  const calculateTotal = () => {
    return cart?.reduce((total, item) => total + (item.finalPrice * item.quantity), 0) || 0;
  };

  const calculateTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    // Implement quantity update logic
    console.log('Update quantity:', itemId, newQuantity);
    // Add your API call here
  };

  const handleRemoveItem = (itemId) => {
    // Implement remove item logic
    console.log('Remove item:', itemId);
    // Add your API call here
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-400">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Giỏ hàng của {userName}
            </h2>
            <p className="text-[16px] text-gray-900 mt-1">
              {calculateTotalItems()} sản phẩm
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {cart && cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4 py-2 px-4 border border-slate-200 rounded-sm hover:shadow-sm transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || item.product?.image}
                      alt={item.name || item.product?.name}
                      className="w-16 h-18 object-cover rounded-sm border border-slate-200"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 text-[16px] text-gray-900">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.name || item.product?.name || "Sản phẩm"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm  mt-1">
                      {item.size && (
                        <span className="px-2 py-1 bg-slate-100 rounded-sm text-[14px]">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="px-2 py-1 bg-slate-100 rounded-sm text-[14px]">
                          Màu: {colorTranslate[item.color]}
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-gray-900 mt-1">
                      {formatPrice(item.finalPrice)} 
                      <span className="ml-2 ">
                        SL: {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[100px]">
                    <div className="font-semibold text-gray-900">
                      {formatPrice(item.finalPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Summary */}
              <div className=" pt-4 mt-6">
                <div className="bg-slate-100 rounded-sm p-4">
                  <div className="flex justify-between items-center text-[16px] text-gray-900 mb-2">
                    <span>Tổng sản phẩm:</span>
                    <span>{calculateTotalItems()} món</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-500">
                Người dùng này chưa có sản phẩm nào trong giỏ hàng
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;