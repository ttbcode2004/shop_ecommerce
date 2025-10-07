import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function QuantityInput({ initial = 1, max = null, onChange, disabled = false }) {
  const [value, setValue] = useState(initial);
  const [prevValue, setPrevValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const validateAndCommit = (num) => {
    if (max == null) {
      toast.error(`Vui lòng chọn màu`);
      return;
    }
    if (num < 1) num = 1;
    if (num > max) num = max;

    if(prevValue !== num){
      setValue(num);
      onChange?.(num);
      setPrevValue(num)
    }
    
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setValue(""); // cho phép xóa hết để nhập lại
      return;
    }
    if (!/^\d+$/.test(val)) return; // chặn ký tự không phải số
    if (max != null && val > max) {
    return; 
  }
    if(Number(val) !== value)
      setValue(Number(val));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center rounded-sm h-6 overflow-hidden w-24 md:w-24 shadow-sm">
        <button
          disabled={disabled}
          type="button"
          className="w-5 md:w-6 h-10 bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
          onClick={() => validateAndCommit(Number(value || 0) - 1)}
        >
          <Minus className="w-5 md:w-6 h-full text-slate-500" />
        </button>

        <input
          type="number"
          className="w-full text-center text-[16px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-all
             [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
             [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0
             -moz-appearance:textfield mx-0.5 h-5 md:-8 mb-[-2.5px] rounded-sm"
          value={value}
          onChange={handleInputChange}
          onBlur={() => {
            if (value === "" || isNaN(value)) {
              setValue(initial); // nếu để trống thì quay lại số cũ
            } else {
              validateAndCommit(Number(value));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.target.blur(); // enter = commit
            }
          }}
        />

        <button
          disabled={disabled}
          type="button"
          className="w-5 md:w-6 h-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
          onClick={() => validateAndCommit(Number(value || 0) + 1)}
        >
          <Plus className="w-8 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
