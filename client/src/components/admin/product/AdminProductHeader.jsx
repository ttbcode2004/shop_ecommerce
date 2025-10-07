import { useSelector } from "react-redux";
import { Plus, ArrowLeft, Package} from "lucide-react";

export default function AdminProductHeader({ onUpdateFlashsale, selectedProductFlashsale, sidebarOpen, onAddProduct, currentView, onBack}) {
  const { productList} = useSelector((state) => state.adminProducts);
  const productCount= productList?.length || 0
  
  const getTitle = () => {
    switch (currentView) {
      case 'details':
        return 'Chi tiết sản phẩm';
      case 'add':
        return 'Thêm sản phẩm mới';
      case 'update':
        return 'Cập nhật sản phẩm';
      case 'flashsale':
        return 'Cập nhật Flashsale';
      default:
        return 'Quản lý sản phẩm';
    }
  };

  return (
    <header className={`fixed top-0 ml-20 left-0 right-0 z-50 bg-white transition-all duration-300 ${sidebarOpen ? "ml-66" : ""}`}>
      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 
                         hover:text-gray-900 hover:bg-slate-100 rounded-sm transition-colors border border-slate-600"
              >
                <ArrowLeft size={16} />
                Trở lại
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {getTitle()}
                </h1>
                {currentView === 'list' && (
                  <p className="text-[16px] text-gray-800">
                    Tổng cộng: {productCount} sản phẩm
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center  gap-6">
            {
              selectedProductFlashsale.length > 0 && currentView === 'list' && <div>
                <button
                onClick={onUpdateFlashsale}
                className="px-4 py-2 bg-rose-600 text-white 
                           hover:bg-rose-700 rounded-sm transition-colors font-medium"
                >
                  Chọn FLASHSALE <span className="ml-1">({selectedProductFlashsale.length})</span>
                </button>
              </div>
            }
            {currentView === 'list' && (
              <>              
                <button
                  onClick={onAddProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                           hover:bg-blue-700 rounded-sm transition-colors font-medium"
                >
                  <Plus size={16} />
                  Thêm sản phẩm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}