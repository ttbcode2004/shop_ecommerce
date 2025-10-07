import { useSelector } from "react-redux";

export default function ProductPagination({loading, products, handlePageChange, renderPaginationNumbers}) {
  const {currentPage, totalPages, total } = useSelector((state) => state.shopProducts);

  return (
    <div className="mb-8">
      {!loading && products.length > 0 && totalPages > 1 && (
        <div className="flex flex-row justify-end items-center mt-8 gap-4 text-sm ">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 sm:px-4 sm:py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            ← Trước
          </button>

          <div className="flex items-center">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 mx-1 rounded-md border border-gray-300 hover:bg-slate-100 transition-colors"
                >
                  1
                </button>
                {currentPage > 4 && <span className="mx-2">...</span>}
              </>
            )}

            {renderPaginationNumbers()}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="mx-2">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 mx-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 sm:px-4 sm:py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Tiếp →
          </button>
        </div>
      )}

      {/* Page info */}
      {!loading && products.length > 0 && (
        <div className="text-center text-gray-600 mt-4 text-sm">
          Trang {currentPage} / {totalPages} - Tổng {total} sản phẩm
        </div>
      )}
    </div>
  )
}
