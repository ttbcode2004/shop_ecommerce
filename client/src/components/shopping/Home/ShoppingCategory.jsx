import { useNavigate } from "react-router-dom";
import { categories } from "../../../config";
import Title from "../../ui/Title";

export default function ShoppingCategory() {
  const navigate = useNavigate();

  return (
    <div className="w-full md:px-10 lg:px-12 px-6 mt-12">
      <Title>DANH MỤC SẢN PHẨM</Title>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-3">
        {categories.slice(0, 10).map((cat, idx) => {
          return (
            <div
              onClick={() => navigate(`/${cat.slug}`)}
              key={cat.slug}
              className={`flex items-center gap-2 bg-slate-50 cursor-pointer rounded-sm shadow hover:shadow-lg transition 
                ${idx === 4 ? "hidden sm:flex" : ""}`}
            >
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-sm overflow-hidden">
                <img src={cat.img} alt={cat.slug}/>
              </div>

              <div className="w-full text-center">
                <p className="font-semibold text-[16px] text-gray-900 ">
                  {cat.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
