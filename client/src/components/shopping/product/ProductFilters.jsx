import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { categoryList, peopleList } from "../../../config";
import { ChevronDown} from "lucide-react";

const inputCheckClass = "w-4 h-4 rounded border-2 border-yellow-500 accent-yellow-500 cursor-pointer hover:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 transition duration-200";

const PRICE_RANGES = [
  { label: "Dưới 500K", min: 0, max: 500000 },
  { label: "500K - 1 Triệu", min: 500000, max: 1000000 },
  { label: "1 Triệu - 2 Triệu", min: 1000000, max: 2000000 },
];

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Mới nhất" },
  { value: "createdAt", label: "Cũ nhất" },
  { value: "-finalPrice", label: "Giá cao → thấp" },
  { value: "finalPrice", label: "Giá thấp → cao" },
  { value: "-rating", label: "Đánh giá cao nhất" },
  { value: "name", label: "Tên A → Z" },
  { value: "-name", label: "Tên Z → A" },
];

const DEFAULT_OPEN_SECTIONS = {
  gender: true,
  category: true,
  price: true,
  special: true,
};

export default function ProductFilters({urlFilters,onFilterChange}) {
  const { loading, filters, total } = useSelector((state) => state.shopProducts);
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN_SECTIONS);
  const [mobileOpen, setMobileOpen] = useState(false);

  const availableCategories = useMemo(() => {
    if (urlFilters?.isGroupedCategory) {
      const groupedSlugPrefix = urlFilters.category; // 'ao' hoặc 'quan'
      return categoryList.filter(cat => 
        cat.slug.startsWith(`${groupedSlugPrefix}-`) || 
        urlFilters.groupedCategories?.includes(cat.slug)
      );
    }
    return categoryList;
  }, [urlFilters, categoryList]);


  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const isSelected = useCallback((filterType, value) => {
    const filterValue = filters[filterType];

    return Array.isArray(filterValue)
      ? filterValue.includes(value)
      : filterValue === value;
  }, [filters]);

  const shouldHideSection = useCallback((sectionType) => {
    if (sectionType === 'people') {
      return urlFilters?.people; // Hide nếu people được chọn từ URL
    }
    if (sectionType === 'category') {
      return urlFilters?.category && !urlFilters?.isGroupedCategory; // Hide nếu single category từ URL
    }
    return false;
  }, [urlFilters]);


  const handleCheckboxChange = useCallback((filterType, value) => {
    const currentValues = Array.isArray(filters[filterType])
      ? filters[filterType]
      : [];

    let newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
     
    if(newValues.length === 0)
      newValues = urlFilters.groupedCategories
    onFilterChange({ [filterType]: newValues });
  }, [filters, onFilterChange]);

  // Handle price range changes
  const handlePriceRangeChange = useCallback((min, max) => {
    const isCurrentlySelected = filters.minPrice === min && filters.maxPrice === max;
    onFilterChange({
      minPrice: isCurrentlySelected ? null : min,
      maxPrice: isCurrentlySelected ? null : max,
    });
  }, [filters.minPrice, filters.maxPrice, onFilterChange]);

  // Handle boolean filter changes
  const handleBooleanFilterChange = useCallback((filterType) => {
    onFilterChange({
      [filterType]: !filters[filterType],
    });
  }, [filters, onFilterChange]);

  // Handle sort changes
  const handleSortChange = useCallback((e) => {
    onFilterChange({ sort: e.target.value });
  }, [onFilterChange]);

  const FilterSection = useCallback(({ sectionKey, title, children }) => (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center w-full bg-gray-100 rounded-sm px-3 py-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 gap-2"
      >
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <ChevronDown
          className={`transition-transform duration-200 ${
            openSections[sectionKey] ? "rotate-180" : ""
          }`}
        />
      </button>
      {openSections[sectionKey] && (
        <div className="mt-3 pl-1">{children}</div>
      )}
    </div>
  ), [openSections, toggleSection]);

  if (urlFilters === null) {
    return null;
  }

  return (
    <div className="rounded-sm">
      <div className="absolute left-6 right-6 md:left-10 md:right-10 lg:left-12 lg:right-12 flex pb-1 justify-between items-center border-b border-gray-200 mb-4">
        <div className="flex items-center gap-6 sm:gap-10 md:gap-40">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">Bộ Lọc</h3>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Toggle filters"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  mobileOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <span className="text-sm font-medium text-gray-600">
            {total.toLocaleString()} sản phẩm
          </span>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filters.sort || "-createdAt"}
            onChange={handleSortChange}
            disabled={loading}
            className="px-3 py-1 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`mt-12 ${
          mobileOpen
            ? "block absolute z-20 bg-white rounded-sm shadow-lg border border-slate-400 p-2 max-w-sm"
            : "hidden md:block"
        }`}>

        {!shouldHideSection('people') && (
          <FilterSection sectionKey="gender" title="Giới tính">
            <div className="space-y-3">
              {peopleList.map((person) => (
                <label
                  key={person.slug}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:text-yellow-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    className={inputCheckClass}
                    checked={isSelected("people", person.slug)}
                    onChange={() => handleCheckboxChange("people", person.slug)}
                    disabled={loading}
                  />
                  <span>{person.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {!shouldHideSection('category') && (
          <FilterSection 
            sectionKey="category" 
            title={urlFilters?.isGroupedCategory 
              ? `Loại ${urlFilters.category === 'ao' ? 'Áo' : 'Quần'}`
              : "Danh mục"
            }
          >
            <div className="space-y-3">
              {availableCategories.map((cat) => (
                <label
                  key={cat.slug}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:text-yellow-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    className={inputCheckClass}
                    checked={isSelected("category", cat.slug)}
                    onChange={() => handleCheckboxChange("category", cat.slug)}
                    disabled={loading}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection sectionKey="price" title="Khoảng giá">
          <div className="space-y-3">
            {PRICE_RANGES.map((range) => {
              const isChecked = filters.minPrice === range.min && filters.maxPrice === range.max;
              return (
                <label
                  key={`${range.min}-${range.max}`}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:text-yellow-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    className={inputCheckClass}
                    checked={isChecked}
                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                    disabled={loading}
                  />
                  <span>{range.label}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection sectionKey="special" title="Flash Sale">
          <div className="space-y-3">
            {!urlFilters.flashSale && (
              <label className="flex items-center gap-3 text-sm cursor-pointer hover:text-yellow-600 transition-colors">
                <input
                  type="checkbox"
                  className={inputCheckClass}
                  checked={filters.flashSale || false}
                  onChange={() => handleBooleanFilterChange("flashSale")}
                  disabled={loading}
                />
                <span>Flash Sale</span>
              </label>
            )}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}