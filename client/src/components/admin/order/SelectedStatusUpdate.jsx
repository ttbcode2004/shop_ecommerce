import { useEffect, useRef, useState } from "react";
import {useDispatch } from "react-redux";
import { updateSubOrderStatus } from "../../../store/admin/subOrder-slice";
import {updateOrderStatus} from "../../../store/admin/order-slice";
import { ChevronDown } from "lucide-react";
import {statusList} from "../../../config";

export default function SelectedStatusUpdate({ isUser,seletedDefault, orderId=null }) {
  const dispatch = useDispatch()
  
  const [isOpen, setIsOpen] = useState(false);
  const [prev, setPrev] = useState(seletedDefault);
  const ref = useRef(null);

  const selectedBg = statusList.find((s) => s.value === seletedDefault)?.bg || "";

  const handleSelect = (value) => {
    if(value !== prev){
        if(orderId !== null){
          if(isUser)
            dispatch(updateOrderStatus({orderId, status: value}))
          else
            dispatch(updateSubOrderStatus({orderId, status: value}))
        }
        setPrev(value)
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md" >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center rounded-sm px-2 py-1 shadow-sm 
            ${selectedBg? selectedBg : "bg-white"}
            `}
      >
        {seletedDefault ? (
          <div className="text-left">
            <p className="">
              {statusList.find((s) => s.value === seletedDefault)?.name ||
                seletedDefault}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">Chọn</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-slate-600 rounded-sm shadow-lg max-h-60 overflow-auto"
         >
          {statusList.map((select, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(select.value)}
              className={`px-3 py-2 cursor-pointer ${
                select.value === seletedDefault ? selectedBg : select.bg
              } ${select.hover} transition-colors duration-200`}
            >
              <p className="">{select.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
