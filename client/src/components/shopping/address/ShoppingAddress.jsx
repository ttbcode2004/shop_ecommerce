import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllAddresses, deleteAddress, updateDefaultAddress,} from "../../../store/shop/address-slice";
import { List, Pencil, Trash2, Star, Plus } from "lucide-react";
import AddAddress from "../../ui/AddAddress";
import Loader from "../../ui/Loader";

export default function AddressPage() {
  const { isLoading, addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [address, setAddress] = useState({});
  const [indexUpdate, setIndexUpdate] = useState(null);

  useEffect(() => {

    dispatch(getAllAddresses());

  }, [ dispatch]);

  const handleDelete = (index) => {
    dispatch(deleteAddress({ index }));
  };

  const handleEdit = (address, index) => {
    setAddress(address);
    setIndexUpdate(index);
    setIsOpenAdd(true);
  };

  const handleSetDefault = (index) => {
    dispatch(updateDefaultAddress({ index }));
  };

  if (isLoading) {
    return <Loader isLoading={isLoading}/>
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
          <List className="w-5 h-5 text-blue-600" />
          Danh sách địa chỉ
        </h1>
        <button
          onClick={() => setIsOpenAdd(true)}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm text-sm sm:text-base transition"
        >
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {addressList?.length === 0 ? (
          <p className="text-gray-500">Chưa có địa chỉ nào</p>
        ) : (
          [...addressList] // copy để không ảnh hưởng gốc
            .sort((a, b) => {
              if (a.defaultAddress === b.defaultAddress) return 0;
              return a.defaultAddress ? -1 : 1; // mặc định lên đầu
            })
            .map((addr) => {
              const originalIndex = addressList.indexOf(addr); // lấy index gốc
              return (
                <div
                  key={originalIndex}
                  className="border border-slate-200 rounded-sm p-3 sm:p-4 shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold text-base sm:text-lg flex-1 line-clamp-1">{addr.fullName}</p>
                    <button
                      onClick={() => handleSetDefault(originalIndex)}
                      className={`flex items-center font-medium gap-1 px-2 py-1 rounded-sm text-xs sm:text-sm transition ${
                        addr.defaultAddress
                          ? "bg-green-50 text-green-700 border border-green-500"
                          : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          addr.defaultAddress
                            ? "fill-green-700 text-green-700"
                            : ""
                        }`}
                      />
                      {addr.defaultAddress ? "Mặc định" : "Đặt làm mặc định"}
                    </button>
                  </div>

                  <div>
                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                      {addr.street}, {addr.commune}, {addr.city}
                    </p>
                    {addr.notes && (
                      <p className="text-gray-800 italic text-sm sm:text-base">
                        {addr.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-900 text-sm sm:text-base">{addr.phone}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(addr, originalIndex)}
                        className="flex items-center gap-1 px-2 py-1 rounded-sm bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm"
                      >
                        <Pencil className="w-4 h-4" /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(originalIndex)}
                        className="flex items-center gap-1 px-2 py-1 rounded-sm bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {isOpenAdd && (
        <AddAddress
          setAddress={setAddress}
          setIndexUpdate={setIndexUpdate}
          address={address}
          index={indexUpdate}
          onClose={() => setIsOpenAdd(false)}
        />
      )}
    </div>
  );
}
