import { memo } from "react";
import ProductItem from "../../ui/ProductItem";

const EmptyState = memo(() => (
  <div className="text-center py-16">
    <div className="text-gray-300 text-8xl mb-6" role="img" aria-label="Empty box">
      📦
    </div>
    <h3 className="text-gray-600 text-xl font-medium mb-3">
      Không tìm thấy sản phẩm nào
    </h3>
    <p className="text-gray-500 text-sm max-w-md mx-auto">
      Hãy thử điều chỉnh bộ lọc của bạn hoặc sử dụng từ khóa tìm kiếm khác để tìm những gì bạn đang tìm kiếm.
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const ProductGrid = memo(({ products }) => (
  <div 
    className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
    role="grid"
    aria-label="Product grid"
  >
    {products.map((product, index) => (
      <div key={product._id} role="gridcell">
        <ProductItem 
          product={product} 
          loading="lazy"
          priority={index < 8} // Prioritize first 8 products
        />
      </div>
    ))}
  </div>
));

ProductGrid.displayName = 'ProductGrid';

export default function ProductList({ products = []}) {
  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-label="Product list">
      <ProductGrid products={products} />
    </section>
  );
}