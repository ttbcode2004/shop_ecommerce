import {Pencil, Trash2, Eye, TrendingUp, Package, AlertCircle, Loader2, Users, Tag, Zap, ImageIcon, Filter, Lock, LockOpen,} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {blockProduct, deleteProduct, getAllProducts,} from "../../../store/admin/products-slice";
import { formatPrice } from "../../../utils/formatPrice";
import { adminHeaderProduct, inputCheckboxClass } from "../../../config";
import DeleteConfirmModal from "../../ui/DeleteConfirmModal";
import Loader from "../../ui/Loader";
import Loader1 from "../../ui/Loader1";

export default function AdminProductsList({filters, onShowDetails, onEditProduct, selectedProductFlashsale, setSelectedProductFlashsale}) {
  const { isLoadingProducts, isLoadingActionProduct, productList} = useSelector((state) => state.adminProducts);

  const dispatch = useDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductDelete, setSelectedProductDelete] = useState(null);
  const [selectedProductBlock, setSelectedProductBlock] = useState(null);

  const handleSelectedFlashsale = (productId) => {
    setSelectedProductFlashsale((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const toNumber = (v) =>
    typeof v === "number" ? v : Number(String(v).replace(/[^\d.-]/g, "") || 0);

  const compare = (a, b) => {
    const da = new Date(a.createdAt).getTime() || 0;
    const db = new Date(b.createdAt).getTime() || 0;
    if (filters.sort === "newest") return db - da;
    if (filters.sort === "oldest") return da - db;

    const pa = toNumber(a.price);
    const pb = toNumber(b.price);
    if (filters.sort === "priceAsc") return pa - pb;
    if (filters.sort === "priceDesc") return pb - pa;

    const sa = toNumber(a.sold);
    const sb = toNumber(b.sold);
    if (filters.sort === "soldAsc") return sa - sb;
    if (filters.sort === "soldDesc") return sb - sa;

    return 0;
  };

  const filteredProducts = useMemo(() => {
    if (!productList) return [];

    return [...productList]
      .filter((p) => {
        if (filters.search) {
          const searchWords = filters.search.toLowerCase().split(" ");
          const productName = (p.name || "").toLowerCase();
          if (!searchWords.every((word) => productName.includes(word))) {
            return false;
          }
        }

        if (
          filters.category.length > 0 &&
          !filters.category.includes(p.category)
        ) {
          return false;
        }

        if (filters.people.length > 0 && !filters.people.includes(p.people)) {
          return false;
        }

        if (filters.flashSale === "only" && !p.flashSale?.isActive)
          return false;
        if (filters.flashSale === "none" && p.flashSale?.isActive) return false;

        // Price range filter
        if (filters.priceRange !== "all") {
          const price = toNumber(p.price);
          switch (filters.priceRange) {
            case "below100":
              if (price >= 100000) return false;
              break;
            case "100to500":
              if (price < 100000 || price > 500000) return false;
              break;
            case "500to1000":
              if (price <= 500000 || price > 1000000) return false;
              break;
            case "above1000":
              if (price <= 1000000) return false;
              break;
            default:
              break;
          }
        }

        return true;
      })
      .sort((a, b) => {
        return compare(a, b);
      });
  }, [productList, filters]);

  // Delete handlers
  const handleDelete = async (id) => {
    setSelectedProductDelete(id)
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProductDelete) {
      const result = await dispatch(deleteProduct(selectedProductDelete));
      if (result?.payload?.success) {
        dispatch(getAllProducts());
      }
      setDeleteModalOpen(false);
      setSelectedProductDelete(null);
    }
    else if (selectedProductBlock) {
      dispatch(blockProduct(selectedProductBlock));
      setDeleteModalOpen(false);
      setSelectedProductBlock(null);
    }
  };

  const handleBlock = async (id, isActive) => {
    if(isActive) {
      setSelectedProductBlock(id)
      setDeleteModalOpen(true);
    }
    else{
      dispatch(blockProduct(id));
    }
  };

  const getStatusBadge = (product) => {
    const badges = [];

    if (product.bestSeller) {
      badges.push(
        <span
          key="bestseller"
          className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-sm font-medium"
        >
          <TrendingUp size={12} />
          Bán chạy
        </span>
      );
    }

    if (product.flashSale?.isActive) {
      const now = new Date();
      const endDate = product.flashSale.endDate
        ? new Date(product.flashSale.endDate)
        : null;
      const isExpired = endDate && now > endDate;

      badges.push(
        <span
          key="flashsale"
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-sm font-medium ${
            isExpired ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-800"
          }`}
        >
          <Zap size={12} />
          {isExpired ? "Flash Sale hết hạn" : "Flash Sale"}
        </span>
      );
    }

    const totalStock =
      product.sizes?.reduce((total, size) => {
        return (
          total +
          size.colors.reduce(
            (colorTotal, color) => colorTotal + (color.quantity || 0),
            0
          )
        );
      }, 0) || 0;

    if (totalStock < 10 && totalStock > 0) {
      badges.push(
        <span
          key="lowstock"
          className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-sm font-medium"
        >
          <AlertCircle size={12} />
          Sắp hết
        </span>
      );
    } else if (totalStock === 0) {
      badges.push(
        <span
          key="outofstock"
          className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-sm font-medium"
        >
          <Package size={12} />
          Hết hàng
        </span>
      );
    }

    return badges;
  };

  const getStockStatus = (product) => {
    return product.stock === 0 ? "out" : product.stock < 10 ? "low" : "good";
  };

  useEffect(() => {
    if (!productList || productList.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, productList]);

  if (isLoadingProducts) {
    return <Loader isLoading={isLoadingProducts} />;
  }

  if (filteredProducts.length === 0) {
    const hasFilters =
      filters.search ||
      filters.category.length > 0 ||
      filters.people.length > 0 ||
      filters.priceRange !== "all" ||
      filters.flashSale !== "all" ||
      filters.bestSeller !== "all";

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {hasFilters ? (
              <Filter className="w-8 h-8 text-gray-400" />
            ) : (
              <Package className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {productList?.length === 0
              ? "Chưa có sản phẩm nào"
              : "Không tìm thấy sản phẩm"}
          </h3>

          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            {productList?.length === 0
              ? "Bắt đầu bằng cách thêm sản phẩm đầu tiên vào cửa hàng của bạn."
              : "Không có sản phẩm nào khớp với bộ lọc hiện tại."}
          </p>

          {hasFilters && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Filter size={14} />
              <span>
                Đang áp dụng{" "}
                {
                  [
                    filters.search && "tìm kiếm",
                    filters.category.length > 0 && "danh mục",
                    filters.people.length > 0 && "đối tượng",
                    filters.priceRange !== "all" && "khoảng giá",
                    filters.flashSale !== "all" && "flash sale",
                    filters.bestSeller !== "all" && "bán chạy",
                  ].filter(Boolean).length
                }{" "}
                bộ lọc
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">

      {isLoadingActionProduct && <Loader1 isLoading={isLoadingActionProduct}/>}
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-800">
            Hiển thị:
            <span className=" ml-1 font-semibold text-gray-900">
              {filteredProducts.length}
            </span>
            {productList && filteredProducts.length !== productList.length && (
              <>
                {" "}
                /{" "}
                <span className="font-semibold text-gray-900">
                  {productList.length}
                </span>
              </>
            )}{" "}
            sản phẩm
          </p>

          {filters.search && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>cho</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                "{filters.search}"
              </span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Còn hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs">Sắp hết</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs">Hết hàng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                {adminHeaderProduct.map((header, index) => (
                  <th
                    key={header}
                    className={`p-2 text-center text-[14px] font-semibold text-gray-800 uppercase tracking-wider ${
                      index === 0 ? "min-w-[200px]" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProducts.map((product, index) => {
                const stockInfo = getStockStatus(product);
                return (
                  <tr
                    key={product._id}
                    className={`group hover:bg-slate-50 transition-colors duration-150`}
                  >
                    <td className="px-4 py-4 min-w-[200px">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-14 h-14 rounded-sm object-cover border border-gray-200 
                                       group-hover:shadow-md transition-shadow duration-150"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`${
                              product.images?.[0] ? "hidden" : "flex"
                            } w-14 h-14 bg-slate-100 rounded-sm items-center justify-center border border-slate-200`}
                          >
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>

                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white cursor-pointer ${
                              stockInfo === "out"
                                ? "bg-red-500"
                                : stockInfo === "low"
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className="text-[16px] font-semibold text-gray-900 truncate max-w-[400px]"
                              title={product.name}
                            > 
                              {product.name || "Không có tên"} 
                            </p>
                          </div>

                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {getStatusBadge(product)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      <div className="text-center">
                        <p className="font-bold text-[16px] text-red-600">
                          {formatPrice(product.price)}
                        </p>
                        {product.discountPercent > 0 && (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded-sm text-sm font-medium text-green-700 mt-1">
                            -{product.isFlashSaleActive ? product.flashSale.discountPercent : product.discountPercent}%
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-sm">
                          <span className="font-semibold text-blue-900 text-[16px]">
                            {product.sold ?? 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-center">
                        <p className="font-semibold text-yellow-600 text-[16px]">
                          {product.stock ?? 0}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[14px] font-medium bg-gray-100 text-gray-800">
                          <Tag size={12} />
                          {product.category || "—"}
                        </span>
                      </div>
                    </td>

                    {/* People/Target */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[14px] font-medium bg-blue-100 text-blue-800">
                          <Users size={12} />
                          {product.people || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onShowDetails(product)}
                          className="p-2 rounded-sm bg-blue-50 text-blue-600 hover:bg-blue-100 
                                   hover:scale-105 transition-all duration-150 group/btn"
                          title="Xem chi tiết"
                        >
                          <Eye
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>

                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-2 rounded-sm bg-yellow-50 text-yellow-600 hover:bg-yellow-100 
                                   hover:scale-105 transition-all duration-150 group/btn"
                          title="Chỉnh sửa"
                        >
                          <Pencil
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>

                        <button
                          onClick={() => handleBlock(product._id, product.isActive)}
                          className={`p-2 rounded-sm hover:scale-105 transition-all duration-150 group/btn
                            ${product.isActive ?"bg-orange-50 text-orange-600 hover:bg-orange-100" 
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                            }  
                          `}
                          title={product.isActive ? "Khóa sản phẩm" : "Mở khóa sản phẩm"}
                        >
                          {product.isActive ? (
                            <Lock
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                            ) : (
                              <LockOpen
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={isLoadingActionProduct}
                          className="p-2 rounded-sm bg-red-50 text-red-600 hover:bg-red-100 
                                   hover:scale-105 transition-all duration-150 disabled:opacity-50 
                                   disabled:cursor-not-allowed group/btn"
                          title="Xóa sản phẩm"
                        >
                          <Trash2
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProductFlashsale.includes(product._id)} // true/false
                        onChange={() => handleSelectedFlashsale(product._id)}
                        className={inputCheckboxClass}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProductDelete(null);
        }}
        onConfirm={confirmDelete}
        title={selectedProductBlock ? "Khóa sản phẩm" : "Xóa sản phẩm"}
          message={
            <>
              Bạn có chắc chắn muốn {selectedProductBlock ? "khóa":"xóa"} sản phẩm ? <br />
              {selectedProductDelete && "Hành động này không thể hoàn tác."}
            </>
          }
        isLoading={isLoadingActionProduct}
        titleConfirm={selectedProductBlock ? "Khóa" : "Xóa"}
      />
    </div>
  );
}
