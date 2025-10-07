import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../../../store/admin/products-slice";
import { availableColors, categoryList, peopleList, focusInputClass} from "../../../config";
import { Plus, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUpdateProduct({ product, onClose }) {
  const dispatch = useDispatch();

  const [images, setImages] = useState(
    (product.images || []).map((url) => ({ type: "url", value: url }))
  );
  const [name, setName] = useState(product.name || "");
  const [summary, setSummary] = useState(product.summary || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [discountPercent, setDiscountPercent] = useState( product.discountPercent || "");
  const [people, setPeople] = useState(product.people);
  const [category, setCategory] = useState(product.category);
  const [sizes, setSizes] = useState(product.sizes || []);
  const [flashSale, setFlashSale] = useState(product.flashSale || {
    isActive: false,
    discountPercent: 0,   // số mặc định
    startDate: "",        // string rỗng để không bị undefined
    endDate: ""           // string rỗng
  });


  const handleAddSize = () => {
    const allSizes = ["S", "M", "L", "XL", "XXL"];
    const selectedSizes = sizes.map((s) => s.size);

    const available = allSizes.filter((s) => !selectedSizes.includes(s));

    if (available.length === 0) {
      toast.warn("Bạn đã thêm đủ tất cả các size!");
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
    setSizes((prevSizes) => {
      const updated = prevSizes.map((size, idx) =>
        idx === sizeIndex
          ? {
              ...size,
              colors: size.colors.some((c) => c.color === colorValue)
                ? size.colors
                : [...size.colors, { color: colorValue, quantity: 0 }],
            }
          : size
      );
      return updated;
    });
  };

  const handleRemoveColor = (sizeIndex, colorIndex) => {
    const updated = [...sizes];
    updated[sizeIndex].colors.splice(colorIndex, 1);
    setSizes(updated);
  };

  const handleQuantityChange = (sizeIndex, colorIndex, value) => {
    setSizes((prev) => {
      const updated = prev.map((size, si) => {
        if (si !== sizeIndex) return size;
        return {
          ...size,
          colors: size.colors.map((color, ci) =>
            ci === colorIndex ? { ...color, quantity: Number(value) } : color
          ),
        };
      });
      return updated;
    });
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setImages((prev) => [
        ...prev,
        ...files.map((file) => ({ type: "file", value: file })),
      ]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(flashSale);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("summary", summary);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discountPercent", discountPercent);
    formData.append("people", people);
    formData.append("category", category);
    formData.append("sizes", JSON.stringify(sizes));

    if (flashSale.isActive && new Date(flashSale.endDate).getTime() > Date.now()) {
      formData.append("flashSale[isActive]", flashSale.isActive);
      formData.append("flashSale[discountPercent]", flashSale.discountPercent);
      formData.append("flashSale[startDate]", flashSale.startDate);
      formData.append("flashSale[endDate]", flashSale.endDate);
    }

    // Ảnh mới
    images.forEach((img) => {
      if (img.type === "file") {
        formData.append("images", img.value);
      }
    });

    // Ảnh cũ (để backend giữ lại)
    const oldImages = images
      .filter((img) => img.type === "url")
      .map((img) => img.value);
    formData.append("oldImages", JSON.stringify(oldImages));

    dispatch(updateProduct({ id: product._id, formData }))

    onClose(false);
  };

  return (
    <div className=" w-full flex flex-col">
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
                  src={
                    img.type === "file"
                      ? URL.createObjectURL(img.value)
                      : img.value
                  }
                  alt=""
                  className="w-20 h-20 object-cover rounded-sm border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
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

        <div>
          <p className="mb-1 font-medium text-lg">Tên sản phẩm</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 ${focusInputClass}`}
            type="text"
            required
          />
        </div>

        <div>
          <p className="mb-1 font-medium text-lg">Tóm tắt</p>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className={`w-full px-3 py-2 ${focusInputClass}`}
            required
          />
        </div>

        <div>
          <p className="mb-1 font-medium text-lg">Mô tả</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 ${focusInputClass}`}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <p className="mb-1 font-medium text-lg">Người dùng</p>
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className={`w-full px-3 py-2 ${focusInputClass}`}
            >
              {peopleList.map((person) => (
                  <option key={person.slug} value={person.value}>{person.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1 font-medium text-lg">Mặt hàng</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 ${focusInputClass}`}
            >
              {categoryList.map((cat) => (
                <option key={cat.slug} value={cat.value}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex gap-3">
              <div>
                <p className="mb-1 font-medium text-lg">Giá (nghìn)</p>
                <input
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
                className="border border-slate-300 p-3 round-sm space-y-3 bg-slate-50"
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
                <div className="flex gap-2 flex-wrap">
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
                <div className="flex gap-8  flex-wrap">
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
                        placeholder="Số lượng"
                        value={color.quantity ?? ""}
                        onChange={(e) =>
                          handleQuantityChange(si, ci, e.target.value)
                        }
                        className="px-2 py-1 border rounded w-24"
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

        {/* Flash Sale */}
        <div className="border border-slate-300 rounded-sm p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={flashSale.isActive}
              className="w-6 h-6 cursor-pointer"
              onChange={() =>
                setFlashSale((prev) => ({
                  ...prev,
                  isActive: !prev.isActive,
                }))
              }
              id="flashSale"
            />
            <label htmlFor="flashSale" className="cursor-pointer font-medium">
              Flash Sale
            </label>
          </div>

          {flashSale.isActive &&
            (() => {
              const now = new Date();
              const start = flashSale.startDate
                ? new Date(flashSale.startDate)
                : null;
              const end = flashSale.endDate
                ? new Date(flashSale.endDate)
                : null;

              let statusMsg = "";
              if (start && end) {
                if (now > end) {
                  statusMsg = `⚠️ Flash Sale đã hết hạn (từ ${start.toLocaleString()} đến ${end.toLocaleString()})`;
                } else if (now < start) {
                  statusMsg = `⏳ Flash Sale chưa bắt đầu (sẽ diễn ra từ ${start.toLocaleString()} đến ${end.toLocaleString()})`;
                } else {
                  statusMsg = `🔥 Flash Sale đang diễn ra (từ ${start.toLocaleString()} đến ${end.toLocaleString()})`;
                }
              }

              return (
                <>
                  {statusMsg && (
                    <div className="p-2 rounded bg-gray-100 text-sm text-gray-700">
                      {statusMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1">Giảm giá (%)</label>
                      <input
                      type="number"
                      min="0"
                      max="100"
                      value={flashSale.discountPercent ?? 0}   // dùng ?? cho chắc
                      onChange={(e) =>
                        setFlashSale((prev) => ({
                          ...prev,
                          discountPercent: Number(e.target.value),
                        }))
                      }
                      className="w-full border rounded p-2"
                    />

                    </div>

                    <div>
                      <label className="block mb-1">Ngày bắt đầu</label>
                      <input
                        type="datetime-local"
                        value={
                          flashSale.startDate
                            ? flashSale.startDate.slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          setFlashSale((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Ngày kết thúc</label>
                      <input
                        type="datetime-local"
                        value={
                          flashSale.endDate
                            ? flashSale.endDate.slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          setFlashSale((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>
                </>
              );
            })()}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 border rounded"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}
