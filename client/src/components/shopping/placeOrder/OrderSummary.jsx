import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { applyVoucher, getAllVouchers } from "../../../store/shop/voucher-slice";
import { getDelivers } from "../../../store/shop/deliver-slice";
import { createNewOrder } from "../../../store/shop/order-slice";
import { createNewSubOrder } from "../../../store/shop/subOrder-slice";
import { clearCartToOrder, deleteLocalCartItem, getCart } from "../../../store/shop/cart-slice";
import { CheckCircle, Truck, AlertCircle, ChevronDown } from "lucide-react";
import { formatPrice } from "../../../utils/formatPrice";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function OrderSummary({ selectedAddress, isGuestAddressValid, paymentMethod}) {
  const { user } = useSelector((state) => state.auth);
  const { cartToOrderList } = useSelector((state) => state.shopCart);
  const {voucherList} = useSelector((state) => state.shopVoucher);
  const { isLoading} = useSelector((state) => state.shopOrder);
  const { deliverList } = useSelector((state) => state.shopDeliver);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState({});
  const [isDeliverOpen, setIsDeliverOpen] = useState(false);
  const [selectedDeliver, setSelectedDeliver] = useState({});

  const canPlaceOrder = user ? !!selectedAddress && !isLoading : 
    !!selectedAddress && isGuestAddressValid && !isLoading;

  const subtotal = useMemo(() => {
    return (
      cartToOrderList.reduce(
        (sum, item) => sum + (item.product.finalPrice || item.finalPrice) * item.quantity, 0 ) || 0
    );
  }, [cartToOrderList]);
  
  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;

    let d = 0;
    if (selectedVoucher.discountType === "percentage") {
      d = (subtotal * selectedVoucher.discountValue) / 100;
    } else {
      d = selectedVoucher.discountValue || 0;

      if (selectedVoucher.maxDiscountAmount) {
        const stepPercent = 20; // mỗi 20%
        const bonusPercent = 10; // mỗi lần cộng thêm 10% discountValue

        // Tính số bậc vượt qua
        const steps = Math.floor(
          (subtotal / selectedVoucher.maxDiscountAmount) * 100 / stepPercent
        );

        if (steps > 1) {
          d += (steps - 1) * (bonusPercent / 100) * selectedVoucher.discountValue;
        }
      }
    }

    if (selectedVoucher.maxDiscountAmount) {
      d = Math.min(d, selectedVoucher.maxDiscountAmount);
    }

    return d;
  }, [selectedVoucher, subtotal]);

  const totalAmount = useMemo(() => { 
    return (cartToOrderList.reduce( (sum, item) => sum + item.quantity, 0 ) || 0 ); 
  }, [cartToOrderList]);
  
  const availableVouchers = useMemo(() => {
    if (!voucherList) return [];

    return voucherList.vouchers?.filter(v => {
      return (
        subtotal >= v.minOrderValue
      );
    });
  }, [voucherList, subtotal]);

  const bestVoucher = useMemo(() => {
    if (!availableVouchers || availableVouchers.length === 0) return null;

    let best = null;
    let maxDiscount = 0;

    availableVouchers.forEach(v => {
      let discount =
        v.discountType === "percentage"
          ? (subtotal * v.discountValue) / 100
          : v.discountValue;

      if (v.maxDiscountAmount) {
        discount = Math.min(discount, v.maxDiscountAmount);
      }

      if (discount > maxDiscount) {
        maxDiscount = discount;
        best = { ...v, discount, finalTotal: subtotal - discount };
      }
    });

    return best;
  }, [availableVouchers, subtotal]);

  const allVoucher = useMemo(() => {
    if (!voucherList) return [];

    return voucherList.vouchers
      ?.map(v => {
        const exists = availableVouchers.some(item => item._id === v._id);

        // Tính discount cho voucher này
        let discount = 0;
        if (exists) {
          discount =
            v.discountType === "percentage"
              ? (subtotal * v.discountValue) / 100
              : v.discountValue;

          if (v.maxDiscountAmount) {
            discount = Math.min(discount, v.maxDiscountAmount);
          }
        }

        return { ...v, check: exists, discount };
      })
      .sort((a, b) => {
        // 1. Ưu tiên check = true trước
        if (a.check !== b.check) return a.check ? -1 : 1;

        // 2. Nếu đều check = true thì sort theo discount giảm dần
        if (a.check && b.check) return b.discount - a.discount;

        return 0;
      });
  }, [voucherList, availableVouchers, subtotal]);


  const handleSelectVoucher = (vou) => {
    setSelectedVoucher(vou);
    setIsVoucherOpen(false)
  }

  const handleSelectDeliver = (deliver) => {
    setSelectedDeliver(deliver);
    setIsDeliverOpen(false)
  } 

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warn("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!user && !isGuestAddressValid) {
      toast.warn("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    if (user && (!selectedAddress.fullName || !selectedAddress.phone || !selectedAddress.street)) {
      toast.warn("Địa chỉ không hợp lệ, vui lòng chọn địa chỉ khác");
      return;
    }

    const selectedCart = cartToOrderList?.map((item) => item._id) || [];

    const orderData = {
      products: cartToOrderList?.map((item) => ({
        product: item.product._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.finalPrice || item.finalPrice,
        image: item.image || item.product.images[0],
        name: item.name || item.product.name,
        category: item.category || item.product.category,
      })),
      deliverId: selectedDeliver._id,
      amount: totalAmount,
      totalPrice: subtotal - discount + selectedDeliver.deliverFee,
      address: selectedAddress,
      paymentMethod,
      selectedCart: user ? selectedCart : [],
    };

    try {
      if (user) {
        // Nếu có mã giảm giá thì đợi applyVoucher xong
        if (selectedVoucher?.code) {
          const voucherRes = await dispatch(
            applyVoucher({
              code: selectedVoucher.code,
              orderTotal: subtotal - selectedDeliver?.deliverFee || 0,
            })
          ).unwrap();

          if (!voucherRes.success) {
            return;
          }
        }

        // Nếu không có voucher hoặc apply thành công thì tạo đơn
        const orderRes = await dispatch(createNewOrder(orderData)).unwrap();

        if (orderRes.success) {
          navigate("/account");
          dispatch(getCart());
          dispatch(clearCartToOrder());
        }
      } else {
        // Guest order
        const subOrderRes = await dispatch(createNewSubOrder(orderData)).unwrap();
        subOrderRes.data.order.products.forEach((item) => {
          dispatch(
            deleteLocalCartItem({
              productId: item.product,
              size: item.size,
              color: item.color,
              toast: false,
            })
          );
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đặt hàng!");
    }
  };


  useEffect(() => {
    console.log(bestVoucher);
    
    if (bestVoucher) {
      setSelectedVoucher(bestVoucher);
    } else {
      setSelectedVoucher(null);
    }
  }, [bestVoucher]);

  useEffect(()=>{
    setSelectedDeliver(deliverList?.[0] )
  }, [deliverList])

  useEffect(()=>{
    if(user){
      dispatch(getAllVouchers())
    }
  },[dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVoucherOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(()=> {
    dispatch(getDelivers())
  },[dispatch])
  
  return (
    <div className=" h-fit font-medium sm:w-[360px] md:w-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="text-purple-600" />
        <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
      </div>
      
      <div className="space-y-3 text-gray-800 bg-white shadow-sm p-4 rounded-sm text-[17px]">        
        <div className="flex justify-between gap-6">
          <p>Tổng tiền <span className="text-gray-600 text-[16px]">({totalAmount} sản phẩm):</span></p>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="relative w-full" ref={dropdownRef}>
          <p className="mb-1">
            Mã giảm giá 
            {user && <span className="text-gray-600 text-[16px] ml-1">({voucherList.total}):</span>}
          </p>
          <button
            onClick={() => setIsVoucherOpen(!isVoucherOpen)}
            className="w-full flex justify-between items-center border-slate-300 border rounded-sm px-3 py-1 bg-white shadow-sm hover:bg-slate-100 transition-colors"
          >
            {selectedVoucher ? (
              <div className="text-left">
                <p className="font-semibold">
                  {selectedVoucher?.code}
                  <span className="ml-2 border text-[14px] border-red-200 rounded-sm bg-red-50 text-red-800 px-1">
                    -{selectedVoucher?.discountType === "percentage" 
                      ? `${selectedVoucher.discountValue}%`
                      : formatPrice(selectedVoucher?.discountValue || 0)}
                  </span>
                  <span className="ml-2 text-[14px] text-green-700">
                    tối đa: { formatPrice(selectedVoucher?.maxDiscountAmount || 0)}
                  </span>
                </p>

              </div>
            ) : (
              <span className="text-gray-600">{user ? "Không có voucher phù hợp" : "Chưa đăng nhập"}</span>
            )}
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform 
                ${isVoucherOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isVoucherOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-slate-400 rounded-sm shadow-lg max-h-80 overflow-auto divide-y divide-slate-400">
              {allVoucher?.length > 0 ? (
                allVoucher.map((vou, idx) => (
                  <div
                    key={vou?._id || idx}
                    onClick={() => {if(vou.check)handleSelectVoucher(vou)}}
                    className={`px-3 py-2 transition-colors ${vou.check ? "hover:bg-orange-50 cursor-pointer" : ""}
                      ${ vou._id === selectedVoucher?._id ? "bg-blue-100" : !vou.check ? "bg-slate-100":""}`}
                  >
                    <p className="font-medium">
                      {vou?.code}
                      <span className="ml-2 border text-[14px] border-red-200 rounded-sm bg-red-50 text-red-800 px-1">
                        -{vou?.discountType === "percentage" 
                          ? `${vou.discountValue}%`
                          : formatPrice(vou?.discountValue || 0)}
                      </span>
                      <span className="ml-2 text-[16px] text-green-700">
                        tối đa: { formatPrice(vou?.maxDiscountAmount || 0)}
                      </span>
                    </p>
                    <p className="text-[16px] text-gray-800">
                      {vou.description}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-[16px] text-gray-600">
                      kết thúc: {format(new Date(vou.endDate), "dd/MM")}
                      </p>
                      <p className="text-[16px] text-orange-900">
                        đơn tối thiểu: {formatPrice(vou.minOrderValue)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Hết Voucher hoặc chưa đăng nhập
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative w-full items-center">
          <div className="flex items-center justify-between">
            <p>Phí vận chuyển</p>

            <button
              onClick={() => setIsDeliverOpen(!isDeliverOpen)}
              className="w-fit flex justify-between items-center border-slate-300 border rounded-sm px-3 py-1 bg-white shadow-sm hover:bg-slate-100 transition-colors"
            >
              {selectedDeliver ? (
                <div className="text-left">
                  <p className="font-semibold text-green-700">
                    {selectedDeliver?.deliverFee ? formatPrice(selectedDeliver?.deliverFee) : "Miễn phí"}
                  </p>
      
                </div>
              ) : (
                <span className="text-gray-400">Miễn phí</span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform 
                  ${isDeliverOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {isDeliverOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-slate-400 rounded-sm shadow-lg max-h-80 overflow-auto divide-y divide-slate-400">
              {deliverList?.length > 0 ? (
                deliverList.map((deliver, idx) => (
                  <div
                    key={deliver?._id || idx}
                    onClick={() => {handleSelectDeliver(deliver)}}
                    className={`px-3 py-2  transition-colors hover:bg-orange-50 cursor-pointer
                      ${ deliver._id === selectedDeliver._id ? "bg-blue-100" :""}`}
                  >
                    <p className="font-medium text-green-700">
                      {formatPrice(deliver?.deliverFee || 0)}
                    </p>
                    <p className="text-[16px] text-gray-800">
                      {deliver.description}
                    </p>
                    
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  0
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Tổng cộng</span>
            <div className="flex gap-3">
              {user && <p className="text-[16px] font-medium text-orange-700">
                Tiết kiệm: <span className="line-through">{formatPrice(discount)}</span>
              </p>}
              <p className="text-blue-600">{formatPrice(subtotal - discount + (selectedDeliver?.deliverFee || 0))}</p>
            </div>
          </div>
        </div>
      </div>

      {user && !selectedAddress && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Vui lòng chọn địa chỉ giao hàng
            </span>
          </div>
        </div>
      )}

      {!user && !isGuestAddressValid && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Vui lòng điền đầy đủ thông tin địa chỉ
            </span>
          </div>
        </div>
      )}

      {selectedAddress && (user || isGuestAddressValid) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Sẵn sàng đặt hàng
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={!canPlaceOrder}
        className={`mt-6 w-full py-3 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          canPlaceOrder
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        Xác nhận đặt hàng
      </button>

      {/* Additional order info */}
      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        <p>• Đơn hàng sẽ được xử lý trong vòng 24h</p>
        <p>• Miễn phí đổi trả trong 7 ngày</p>
        <p>• Hỗ trợ 24/7: 0399 279 576</p>
      </div>
    </div>
  );
}