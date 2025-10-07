import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import AdminProductHeader from "../../components/admin/product/AdminProductHeader";
import AdminProductsFilters from "../../components/admin/product/AdminProductsFilters";
import AdminProductsList from "../../components/admin/product/AdminProductsList";
import AdminProductDetails from "../../components/admin/product/AdminProductDetails";
import AdminAddProduct from "../../components/admin/product/AdminAddProduct";
import AdminUpdateProduct from "../../components/admin/product/AdminUpdateProduct";
import AdminUpdateFlashsale from "../../components/admin/product/AdminUpdateFlashsale";

export default function AdminProducts() {
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductFlashsale, setSelectedProductFlashsale] = useState([]);
  
  const [filters, setFilters] = useState({
    search: "",
    category: [],
    people: [],
    sort: "newest",
    priceRange: "all",
    flashSale: "all",
    bestSeller: "all",
  });

  const handleShowDetails = useCallback((product) => {
    setSelectedProduct(product);
    setView('details');
  }, []);

  const handleEditProduct = useCallback((product) => {
    setSelectedProduct(product);
    setView('update');
  }, []);

  const handleAddProduct = useCallback(() => {
    setView('add');
  }, []);

  const handleUpdateFlashsale = useCallback(() => {
    setView('flashsale');
  }, []);

  const handleBackToList = useCallback(() => {
    setView('list');
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Render different views
  const renderCurrentView = () => {
    switch (view) {
      case 'details':
        return (
          <AdminProductDetails 
            product={selectedProduct}
            onBack={handleBackToList}
            sidebarOpen={sidebarOpen}
          />
        );
      case 'add':
        return (
          <AdminAddProduct 
            onClose={handleBackToList}
            sidebarOpen={sidebarOpen}
          />
        );
      case 'update':
        return (
          <AdminUpdateProduct 
            product={selectedProduct}
            onClose={handleBackToList}
            sidebarOpen={sidebarOpen}
          />
        );
      case 'flashsale':
        return (
          <AdminUpdateFlashsale
           selectedProductFlashsale={selectedProductFlashsale}
           setSelectedProductFlashsale={setSelectedProductFlashsale}
           onBack={handleBackToList}
          />
        );
      default:
        return (
          <>
            <AdminProductsFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <AdminProductsList
              selectedProductFlashsale={selectedProductFlashsale}
              setSelectedProductFlashsale={setSelectedProductFlashsale}
              filters={filters}
              onShowDetails={handleShowDetails}
              onEditProduct={handleEditProduct}
            />
          </>
        );
    }
  };

  return (
    <div className="w-full min-h-screen">
      <AdminProductHeader
        onUpdateFlashsale = {handleUpdateFlashsale}
        selectedProductFlashsale={selectedProductFlashsale}
        sidebarOpen={sidebarOpen}
        onAddProduct={handleAddProduct}
        currentView={view}
        onBack={view !== 'list' ? handleBackToList : null}
      />
      
      <div className="pt-12">
        {renderCurrentView()}
      </div>
    </div>
  );
}