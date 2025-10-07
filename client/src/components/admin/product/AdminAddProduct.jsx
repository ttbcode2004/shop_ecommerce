import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../store/admin/products-slice";
import {availableColors,categoryList, peopleList, focusInputClass} from "../../../config";
import { X, Plus, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminAddProduct({ onClose }) {
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [people, setPeople] = useState("nam");
  const [category, setCategory] = useState("áo thun");
  const [sizes, setSizes] = useState([]);

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files); // chuyển FileList thành mảng

    if (files.length > 0) {
      setImages((prev) => {
        // gộp ảnh cũ + ảnh mới
        const merged = [...prev, ...files];
        // cắt chỉ giữ tối đa 10 ảnh
        return merged.slice(0, 10);
      });
    }

    // reset input để lần sau có thể chọn lại cùng file
    e.target.value = null;
  };

  const handleAddSize = () => {
    const allSizes = ["S", "M", "L", "XL", "XXL"];
    const selectedSizes = sizes.map((s) => s.size);

    // Lọc ra những size chưa chọn
    const available = allSizes.filter((s) => !selectedSizes.includes(s));

    if (available.length === 0) {
      toast.warning("Bạn đã thêm đủ tất cả các size!");
      return;
    }

    const newSize = available[0];

    setSizes((prev) => [...prev, { size: newSize, colors: [] }]);
  };

  const handleRemoveSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, value) => {
    const updated = [...sizes];
    updated[index].size = value;
    setSizes(updated);
  };

  const handleAddColor = (sizeIndex, colorValue) => {
    const updated = [...sizes];
    if (!updated[sizeIndex].colors.some((c) => c.color === colorValue)) {
      updated[sizeIndex].colors.push({ color: colorValue, quantity: 0 });
    }
    setSizes(updated);
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    const updated = [...sizes];
    updated[sizeIndex].colors.splice(colorIndex, 1);
    setSizes(updated);
  };

  const handleQuantityChange = (sizeIndex, colorIndex, value) => {
    const updated = [...sizes];
    updated[sizeIndex].colors[colorIndex].quantity = Number(value);
    setSizes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(discountPercent > 99){
      toast.warning("vui lòng chọn mã giảm giá dưới 100%");
      return;
    }    

    const formData = new FormData();
    formData.append("name", name);
    formData.append("summary", summary);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPercent", discountPercent);
    formData.append("people", people);
    formData.append("category", category);

    // sizes là object → phải stringify
    formData.append("sizes", JSON.stringify(sizes));

    // Thêm ảnh
    images.forEach((img) => {
      formData.append("images", img);
    });
    
    // console.log(formData);
    
    dispatch(addProduct(formData))

    onClose(false)     
  };

  return (
    <div className="bg-white w-full flex flex-col relative">
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700 text-base"
      >

        <div>
          <p className="mb-3 font-medium text-lg">
            Ảnh sản phẩm{" "}
            <span className="text-gray-700 text-sm">(Tối đa 10 ảnh)</span>
          </p>
          <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  className="w-20 h-20 object-cover rounded-sm border border-slate-100 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                >
                  <X size={14} />
                </button>
                <p className="text-center text-sm mt-1">{idx + 1}</p>
              </div>
            ))}
            <label
              className={`w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-sm cursor-pointer hover:bg-slate-50 transition-colors ${
                images.length >= 10 ? "hidden" : ""
              }`}
            >
              <UploadCloud className="text-gray-500" />
              <span className="text-xs text-gray-400 mt-1">Thêm</span>
              <input
                type="file"
                hidden
                multiple
                onChange={handleAddImage}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Tên sản phẩm */}
        <div className="flex md:flex-col lg:flex-row w-full gap-8">
          <div className=" ">
            <p className="mb-1 font-medium text-lg">Tên sản phẩm</p>
            <textarea
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`min-w-80 px-3 py-2 ${focusInputClass}`}
              type="text"
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium text-lg">Tóm tắt</p>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className={`min-w-80 px-3 py-2 ${focusInputClass}`}
              required
            />
          </div>

          <div>
            <p className="mb-1 font-medium text-lg">Mô tả</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-w-120 px-3 py-2 ${focusInputClass}`}
              required
            />
          </div>
        </div>

        {/* Loại & giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="mb-1 font-medium text-lg">Người dùng</p>
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className={`w-full px-3 py-2 ${focusInputClass}`}
            >
              {
                peopleList.map(person=>(
                  <option key={person.slug} value={person.value}>{person.name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <p className="mb-1 font-medium text-lg">Mặt hàng</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 ${focusInputClass}`}
            >
              {
                categoryList.map(cat=>(
                  <option key={cat.slug} value={cat.value}>{cat.name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <div className="flex gap-3">
              <div>
                <p className="mb-1 font-medium text-lg">Giá (nghìn)</p>
                <input
                  min={1}
                  value={price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 || e.target.value === "") {
                      setPrice(e.target.value);
                    }
                  }}
                  className={`w-full px-3 py-2 ${focusInputClass}`}
                  type="number"
                  required
                />
              </div>
              <div>
                <p className="mb-1 font-medium text-lg">Giảm giá %</p>
                <input
                  value={discountPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if ((val >= 1 && val < 100) || e.target.value === "") {
                      setDiscountPercent(e.target.value);
                    }
                  }}
                  className={`w-full px-3 py-2 ${focusInputClass}`}
                  type="number"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sizes & Colors */}
        <div>
          <div className="flex items-center gap-7 mb-2">
            <p className="font-medium text-lg">Kích cỡ & màu</p>
            <button
              type="button"
              onClick={handleAddSize}
              className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 ease-in-out text-white rounded"
            >
              <Plus size={14} /> Thêm size
            </button>
          </div>

          <div className="space-y-4">
            {sizes.map((size, si) => (
              <div
                key={si}
                className="border border-slate-300 p-3 rounded-sm space-y-3 bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={size.size}
                    onChange={(e) => handleSizeChange(si, e.target.value)}
                    className="px-2 py-1 border border-slate-400 rounded-sm"
                  >
                    {["S", "M", "L", "XL", "XXL"]
                      .filter(
                        (s) =>
                          !sizes.some((sz) => sz.size === s) ||
                          s === size.size
                      )
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveSize(si)}
                    className=" bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Chọn màu */}
                <div className="flex gap-2 flex-wrap ">
                  {availableColors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleAddColor(si, c.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200
                        ${
                          size.colors.some((cl) => cl.color === c.value)
                            ? "border-orange-800 scale-110"
                            : "border-gray-300"
                        }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="sr-only">{c.name}</span>
                    </button>
                  ))}
                </div>

                {/* Danh sách màu đã chọn */}
                <div className="flex  gap-8 flex-wrap">
                  {size.colors.map((color, ci) => (
                  <div key={ci} className="flex items-center gap-1">
                    <span
                      className="w-6 h-6 rounded-full border"
                      style={{
                        backgroundColor: availableColors.find(
                          (c) => c.value === color.color
                        )?.hex,
                      }}
                    ></span>
                    <input
                      type="number"
                      placeholder=""
                      value={color.quantity ? color.quantity : null}
                        onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1 || e.target.value === "") {
                          handleQuantityChange(si, ci, e.target.value)
                        }
                      }}
            
                      className="px-2 py-1 border rounded-sm w-22"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(si, ci)}
                      className=" bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="w-28 py-2 bg-gray-300 text-black rounded-sm hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="w-28 py-2 bg-black text-white rounded-sm hover:bg-gray-800"
          >
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
}
