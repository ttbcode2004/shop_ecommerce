import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  Percent, 
  DollarSign, 
  Package, 
  Award, 
  Star, 
  Zap, 
  Clock, 
  TrendingUp,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Bestseller Management Component
function BestsellerManagement({ products, onBack, onUpdateProduct }) {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p._id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (id, checked) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProducts(newSelected);
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedProducts.size === 0) return;
    
    const action = bulkAction === 'add' ? true : false;
    selectedProducts.forEach(id => {
      const product = products.find(p => p._id === id);
      if (product) {
        onUpdateProduct(id, { bestSeller: action });
      }
    });
    
    setSelectedProducts(new Set());
    setBulkAction('');
  };

  const bestsellerStats = useMemo(() => {
    const total = products.length;
    const bestsellers = products.filter(p => p.bestSeller).length;
    const revenue = products
      .filter(p => p.bestSeller)
      .reduce((sum, p) => sum + (p.sold * p.price), 0);
    
    return { total, bestsellers, revenue, percentage: total ? (bestsellers / total * 100).toFixed(1) : 0 };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng Bestsellers</p>
              <p className="text-2xl font-bold text-gray-900">{bestsellerStats.bestsellers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ Bestsellers</p>
              <p className="text-2xl font-bold text-gray-900">{bestsellerStats.percentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doanh thu Bestsellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bestsellerStats.revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{bestsellerStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">
                Đã chọn {selectedProducts.size} sản phẩm
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1.5 border border-yellow-300 rounded text-sm"
              >
                <option value="">Chọn hành động</option>
                <option value="add">Thêm vào Bestsellers</option>
                <option value="remove">Xóa khỏi Bestsellers</option>
              </select>
              
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Đã bán
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Doanh thu
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Đánh giá
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Bestseller
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product._id)}
                      onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded"
                    />
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category} - {product.people}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-blue-600">{product.sold}</span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.sold * product.price)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.ratingsAverage}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onUpdateProduct(product._id, { bestSeller: !product.bestSeller })}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.bestSeller
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {product.bestSeller ? 'Bestseller' : 'Thường'}
                    </button>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onUpdateProduct(product._id, { bestSeller: !product.bestSeller })}
                      className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                    >
                      {product.bestSeller ? <Award size={16} /> : <Crown size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Navigation
function ManagementApp() {
  const [currentView, setCurrentView] = useState('bestseller');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              
              <nav className="flex gap-1">
                <button
                  onClick={() => setCurrentView('bestseller')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'bestseller'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Quản lý Bestsellers
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentView('flashsale')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'flashsale'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quản lý Flash Sale
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'bestseller' ? (
          <BestsellerManagement />
        ) : (
          <FlashSaleManagement />
        )}
      </div>
    </div>
  );
}

export default ManagementApp;




//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-yellow-200 rounded-lg">
//               <Crown className="w-6 h-6 text-yellow-700" />
//             </div>
//             <div>
//               <p className="text-sm text-yellow-700">Tổng Bestsellers</p>
//               <p className="text-2xl font-bold text-yellow-900">{bestsellerStats.bestsellers}</p>
//               <p className="text-xs text-yellow-600">+{bestsellerStats.percentage}% tổng SP</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-blue-200 rounded-lg">
//               <Percent className="w-6 h-6 text-blue-700" />
//             </div>
//             <div>
//               <p className="text-sm text-blue-700">Tỷ lệ Bestsellers</p>
//               <p className="text-2xl font-bold text-blue-900">{bestsellerStats.percentage}%</p>
//               <p className="text-xs text-blue-600">Của tổng sản phẩm</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-green-200 rounded-lg">
//               <DollarSign className="w-6 h-6 text-green-700" />
//             </div>
//             <div>
//               <p className="text-sm text-green-700">Doanh thu Bestsellers</p>
//               <p className="text-2xl font-bold text-green-900">
//                 {(bestsellerStats.revenue / 1000000).toFixed(1)}M
//               </p>
//               <p className="text-xs text-green-600">VND</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-purple-200 rounded-lg">
//               <Star className="w-6 h-6 text-purple-700" />
//             </div>
//             <div>
//               <p className="text-sm text-purple-700">Đánh giá TB</p>
//               <p className="text-2xl font-bold text-purple-900">{bestsellerStats.avgRating}</p>
//               <p className="text-xs text-purple-600">Bestsellers</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters and Controls */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-gray-500" />
//               <select
//                 value={filterBy}
//                 onChange={(e) => setFilterBy(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">Tất cả sản phẩm</option>
//                 <option value="bestseller">Chỉ Bestsellers</option>
//                 <option value="regular">Sản phẩm thường</option>
//               </select>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Sắp xếp:</span>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="sold">Số lượng bán</option>
//                 <option value="revenue">Doanh thu</option>
//                 <option value="rating">Đánh giá</option>
//                 <option value="name">Tên A-Z</option>
//               </select>
//             </div>
//           </div>

//           <div className="text-sm text-gray-600">
//             Hiển thị {filteredProducts.length} / {products.length} sản phẩm
//           </div>
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedProducts.size > 0 && (
//         <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Crown className="w-5 h-5 text-yellow-600" />
//               <span className="font-medium text-yellow-900">
//                 Đã chọn {selectedProducts.size} sản phẩm
//               </span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <select
//                 value={bulkAction}
//                 onChange={(e) => setBulkAction(e.target.value)}
//                 className="px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500"
//               >
//                 <option value="">Chọn hành động</option>
//                 <option value="add">Thêm vào Bestsellers</option>
//                 <option value="remove">Xóa khỏi Bestsellers</option>
//               </select>
              
//               <button
//                 onClick={handleBulkAction}
//                 disabled={!bulkAction}
//                 className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 
//                          disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 <Check className="w-4 h-4" />
//                 Áp dụng
//               </button>
              
//               <button
//                 onClick={() => setSelectedProducts(new Set())}
//                 className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="w-12 px-4 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
//                     onChange={(e) => handleSelectAll(e.target.checked)}
//                     className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
//                   Sản phẩm
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                   Đã bán
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                   Doanh thu
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                   Đánh giá
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                   Trạng thái
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                   Thao tác
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {filteredProducts.map((product, index) => (
//                 <tr key={product._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedProducts.has(product._id)}
//                       onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
//                       className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
//                     />
//                   </td>
                  
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <img
//                           src={product.images[0]}
//                           alt={product.name}
//                           className="w-12 h-12 rounded-lg object-cover"
//                         />
//                         {product.bestSeller && (
//                           <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                             <Crown className="w-3 h-3" />
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">{product.name}</p>
//                         <p className="text-sm text-gray-500">{product.category} • {product.people}</p>
//                         <p className="text-xs text-gray-400">
//                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
                  
//                   <td className="px-4 py-4 text-center">
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold text-blue-600">{product.sold}</span>
//                       <span className="text-xs text-gray-500">sản phẩm</span>
//                     </div>
//                   </td>
                  
//                   <td className="px-4 py-4 text-center">
//                     <div className="flex flex-col items-center">
//                       <span className="font-semibold text-green-600">
//                         {((product.sold * product.price) / 1000000).toFixed(1)}M
//                       </span>
//                       <span className="text-xs text-gray-500">VND</span>
//                     </div>
//                   </td>
                  
//                   <td className="px-4 py-4 text-center">
//                     <div className="flex items-center justify-center gap-1">
//                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="font-medium">{product.ratingsAverage}</span>
//                     </div>
//                   </td>
                  
//                   <td className="px-4 py-4 text-center">
//                     <button
//                       onClick={() => actualUpdateProduct(product._id, { bestSeller: !product.bestSeller })}
//                       className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
//                         product.bestSeller
//                           ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 hover:from-yellow-200 hover:to-yellow-300 border border-yellow-300'
//                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
//                       }`}
//                     >
//                       {product.bestSeller ? (
//                         <div className="flex items-center gap-1">
//                           <Crown className="w-3 h-3" />
//                           Bestseller
//                         </div>
//                       ) : 'Thường'}
//                     </button>
//                   </td>
                  
//                   <td className="px-4 py-4 text-center">
//                     <div className="flex items-center justify-center gap-1">
//                       <button
//                         onClick={() => actualUpdateProduct(product._id, { bestSeller: !product.bestSeller })}
//                         className={`p-2 rounded-lg transition-all ${
//                           product.bestSeller 
//                             ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         }`}
//                         title={product.bestSeller ? "Bỏ Bestseller" : "Thêm vào Bestseller"}
//                       >
//                         {product.bestSeller ? <Award size={16} /> : <Plus size={16} />}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

