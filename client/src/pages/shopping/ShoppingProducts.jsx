import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { clearCurrentPage, clearFilters, getAllProducts, setCurrentPage, setFilters } from "../../store/shop/products-slice";
import ProductFilters from "../../components/shopping/product/ProductFilters";
import ProductList from "../../components/shopping/product/ProductList";
import ProductPagination from "../../components/shopping/product/ProductPagination";
import Loader from "../../components/ui/Loader";

const GROUPED_CATEGORIES = {
  ao: ["ao-thun", "ao-polo", "ao-khoac"],
  quan: ["quan-short", "quan-dai"],
};

export default function ShoppingProducts() {
  const { isLoading, filters, products, currentPage, totalPages } = useSelector((state) => state.shopProducts);
  
  const loaction = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  
  const [urlFilters, setUrlFilters] = useState(null);

  useEffect(()=>{
    dispatch(clearFilters());
    dispatch(clearCurrentPage());
  }, [loaction])

  const isGroupedCategory = (slugValue) => {
    return Object.keys(GROUPED_CATEGORIES).includes(slugValue);
  };

  const getGroupedCategories = (slugValue) => {
    return GROUPED_CATEGORIES[slugValue] || [];
  };
  
  const parseUrlToFilters = () => {
    const parsedFilters = {
      people: null,
      category: null,
      flashSale: false,
      search: null,
      isGroupedCategory: false,
      groupedCategories: []
    };

    const gioiTinh = searchParams.get("gioi_tinh");
    const searchQuery = searchParams.get("q");

    if (slug === "search") {
      parsedFilters.search = searchQuery || "";
    } else if (slug === "flashsale") {
      parsedFilters.flashSale = true;
    } else if (["nam", "nu", "tre-em"].includes(slug)) {
      parsedFilters.people = slug;
    } else if (isGroupedCategory(slug)) {
      parsedFilters.isGroupedCategory = true;
      parsedFilters.groupedCategories = getGroupedCategories(slug);    
      parsedFilters.category = slug; 
    } else if (gioiTinh) {
      parsedFilters.people = gioiTinh;
      parsedFilters.category = slug;
    } else if(["ao-thun", "ao-polo", "ao-khoac", "quan-short", "quan-dai"].includes(slug)){
      parsedFilters.category = slug;
    }
    else {
      navigate("/")
    }
    return parsedFilters;
  };

  const convertToReduxFilters = (parsedFilters) => {    
    const reduxFilters = {};

    if (parsedFilters.search !== null) {
      reduxFilters.search = parsedFilters.search;
      // Clear other filters when searching
      reduxFilters.category = [];
      reduxFilters.people = [];
      reduxFilters.flashSale = false;
    } else {
      if (filters.search) {
        reduxFilters.search = "";
      }

      if (parsedFilters.isGroupedCategory) {
        reduxFilters.category = parsedFilters.groupedCategories;
      } else if (parsedFilters.category) {
        reduxFilters.category = [parsedFilters.category];
      } else if (filters.category?.length > 0) {
        reduxFilters.category = [];
      }

      if (parsedFilters.people) {
        reduxFilters.people = [parsedFilters.people];
      } else if (filters.people?.length > 0) {
        reduxFilters.people = [];
      }

      if (parsedFilters.flashSale) {
        reduxFilters.flashSale = true;
      } else if (filters.flashSale) {
        reduxFilters.flashSale = false;
      }
    }

    return reduxFilters;
  };

  useEffect(() => {
    const parsedFilters = parseUrlToFilters();
  
    setUrlFilters(parsedFilters);
    
    const reduxFilters = convertToReduxFilters(parsedFilters);
    
    if (JSON.stringify(filters) !== JSON.stringify(reduxFilters)) {
      dispatch(setFilters(reduxFilters));
    }
  }, [slug, searchParams]);

  useEffect(() => {
    if (urlFilters !== null) {
      dispatch(getAllProducts({ ...filters, page: currentPage }));
    }
  }, [filters, currentPage, urlFilters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-sm border transition-colors ${
            i === currentPage
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-white text-gray-800 border-slate-300 hover:bg-slate-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

   

  if (urlFilters === null || isLoading) {
    return (
      <Loader isLoading={isLoading}/>
    );
  }

  return (
    <div className="px-6 md:px-10 lg:px-12 mt-2 relative">
      {urlFilters.search && (
        <div className="mb-4 w-full text-center">
          <p className="text-sm md:text-[16px] text-gray-700">
            Tìm kiếm: <strong className="text-[20px]">"{urlFilters.search}"</strong>
          </p>
        </div>
      )}

      {urlFilters.isGroupedCategory && (
        <div className="mb-4 w-full text-center">
          <p className="text-sm md:text-[16px] text-gray-700">
            Danh mục: <strong>{urlFilters.category === 'ao' ? 'Áo' : 'Quần'}</strong>
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:gap-4">
        <ProductFilters
          urlFilters={urlFilters}
          onFilterChange={handleFilterChange}
        />

        <div className="flex-1">
          <ProductList 
            products={products} 
            loading={isLoading} 
          />
          
          <ProductPagination
            loading={isLoading}
            products={products}
            handlePageChange={handlePageChange}
            renderPaginationNumbers={renderPaginationNumbers}
          />
        </div>
      </div>
    </div>
  );
}