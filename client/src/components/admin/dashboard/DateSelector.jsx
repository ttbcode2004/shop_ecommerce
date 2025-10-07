import { Calendar } from "lucide-react";
import { useState } from "react";

export default function DateSelector({ dateRange, onChange }) {
  const { year, month, day, date } = dateRange;
  const [dateInput, setDateInput] = useState(date);
  const [errorInput, setErrorInput] = useState("");

  const handleChange = (newYear, newMonth, newDay, newDate, newSelected) => {
    let selected = {
      year: newYear,
      month: newMonth,
      day: newDay,
      date: newDate,
    };

    if (newSelected === "inputDate") {
    }
    onChange && onChange(selected, newSelected);
  };

  const getDaysInMonth = (y, m) => {
    if (!y || !m) return 0;
    return new Date(y, m, 0).getDate(); // số ngày trong tháng
  };

  return (
    <div className="flex items-center space-x-3">
      <Calendar size={20} className="text-gray-500" />

      <select
        value={year}
        onChange={(e) =>
          handleChange(e.target.value, month, day, date, "select")
        }
        className="border border-slate-300 outline-none rounded-sm p-2 text-sm focus:ring-1 focus:ring-slate-800"
      >
        {[2025, 2024, 2023].map((y) => (
          <option key={y} value={y}>
            Năm {y}
          </option>
        ))}
      </select>


      <select
        value={month}
        onChange={(e) =>
          handleChange(year, e.target.value, day, date, "select")
        }
        className="border border-slate-300 outline-none rounded-sm p-2 text-sm focus:ring-1 focus:ring-slate-800"
      >
        <option value="">Chọn tháng</option>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
            Tháng {i + 1}
          </option>
        ))}
      </select>

      {/* Ngày */}
      {month && (
        <select
          value={day}
          onChange={(e) =>
            handleChange(year, month, e.target.value, date, "select")
          }
          className="border border-slate-300 outline-none rounded-sm p-2 text-sm focus:ring-1 focus:ring-slate-800"
        >
          <option value="">Chọn ngày</option>
          {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
              Ngày {i + 1}
            </option>
          ))}
        </select>
      )}

      <div className="relative">
        <input
        type="text"
        placeholder="dd-mm-yyyy hoặc dd/mm/yyyy"
        value={dateInput}
        onChange={(e) => {
          const val = e.target.value;
          if (val.length <= 10) {
            setDateInput(val);
          }

          if (val.length === 10) {
            // chỉ validate khi đủ 10 ký tự
            const regex = /^(\d{2})([-\/])(\d{2})\2(\d{4})$/;
            if (regex.test(val)) {
              handleChange(year, month, day, val, "inputDate");
              setErrorInput("")
            } else {
              setErrorInput("dd-mm-yyyy, dd/mm/yyyy")
            }
          }
        }}

        className="border border-slate-300 outline-none rounded-sm p-2 text-sm focus:ring-1 focus:ring-slate-800"
      />
      {errorInput && <p className="absolute left-1 bottom-[-19px] text-sm text-red-500 w-full">{errorInput}</p>}
      </div>
    </div>
  );
}
