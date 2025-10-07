import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Plus, ChevronDown } from "lucide-react";
import AddAddress from "../../ui/AddAddress";
import AddressNotUser from "../../ui/AddressNotUser";

export default function PlaceOrderAddress({selectedAddress, selectedAddressIndex, setSelectedAddressIndex, setGuestAddress, setIsGuestAddressValid }) {
  const { user } = useSelector((state) => state.auth);
  const {addressList } = useSelector((state) => state.shopAddress);

  const dropdownRef = useRef(null);
  const [isOpenAddAddress, setIsOpenAddAddress] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const handleSelectAddress = (index) => {    
    setSelectedAddressIndex(index);
    setIsAddressOpen(false);
  };

  const handleGuestAddressChange = (addressData) => {
    setGuestAddress(addressData.address);
    setIsGuestAddressValid(addressData.isValid);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAddressOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-blue-600" />
          <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
        </div>
        {user && (
          <button
            onClick={() => setIsOpenAddAddress(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 rounded-sm text-sm sm:text-base transition h-8"
          >
            <Plus className="w-3 h-3" /> Thêm
          </button>
        )}
      </div>

      {user ? (
        <>
          <div className="relative w-full" ref={dropdownRef}>
            <button
              onClick={() => setIsAddressOpen(!isAddressOpen)}
              className="w-full flex justify-between items-center border-slate-300 border rounded-sm px-3 py-2 bg-white shadow-sm hover:bg-slate-100 transition-colors"
            >
              {selectedAddress ? (
                <div className="text-left">
                  <p className="font-semibold text-lg">
                    {selectedAddress.defaultAddress ? <span className="text-green-600">Mặc định: </span> : ""}
                    {selectedAddress.fullName}
                  </p>
                  <p className="text-[16px] text-gray-900">
                    {selectedAddress.street}, {selectedAddress.commune},{" "}
                    {selectedAddress.city}
                  </p>
                </div>
              ) : (
                <span className="text-gray-400">Chọn địa chỉ</span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isAddressOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isAddressOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-slate-400 rounded-sm shadow-lg max-h-60 overflow-auto divide-y divide-slate-400">
                {addressList?.length > 0 ? (
                  addressList.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectAddress(idx)}
                      className={`px-3 py-2 cursor-pointer hover:bg-blue-100 transition-colors ${
                        idx === selectedAddressIndex ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-semibold text-lg">
                        {addr.defaultAddress ? <span className="text-green-600">Mặc định: </span> : ""}
                        {addr.fullName}
                      </p>
                      <p className="text-[16px] text-gray-800">
                        {addr.street}, {addr.commune}, {addr.city}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedAddress && (
            <div className="mt-4">
              <h1 className="mb-1 font-semibold text-lg">Chi tiết</h1>
              <div className="flex bg-slate-50 border border-slate-400 rounded-sm p-4 justify-between items-start">
                <div className="text-[16px] text-gray-900">
                  <p className="font-semibold text-lg">{selectedAddress.fullName}</p>
                  <p className="mt-1">{selectedAddress.phone}</p>
                  <p className="mt-1">
                    {selectedAddress.street}, {selectedAddress.commune},{" "}
                    {selectedAddress.city}
                  </p>
                  {selectedAddress.notes && (
                    <p className="italic mt-2">{selectedAddress.notes}</p>
                  )}
                </div>
                {selectedAddress.defaultAddress && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-sm">
                    Mặc định
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Guest Address Form */
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <AddressNotUser 
            onAddressChange={handleGuestAddressChange}
          />
        </div>
      )}

      {isOpenAddAddress && (
        <AddAddress onClose={() => setIsOpenAddAddress(false)} />
      )}
    </div>
  );
}