function FlashSaleManagement({ products, onBack, onUpdateProduct }) {
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [bulkFlashSale, setBulkFlashSale] = useState({
    isActive: false,
    discountPercent: 0,
    startDate: '',
    endDate: ''
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const flashSaleStats = useMemo(() => {
    const now = new Date();
    const active = products.filter(p => 
      p.flashSale?.isActive && 
      new Date(p.flashSale.startDate) <= now && 
      new Date(p.flashSale.endDate) >= now
    ).length;
    
    const upcoming = products.filter(p => 
      p.flashSale?.isActive && 
      new Date(p.flashSale.startDate) > now
    ).length;
    
    const expired = products.filter(p => 
      p.flashSale?.isActive && 
      new Date(p.flashSale.endDate) < now
    ).length;
    
    return { active, upcoming, expired, total: products.length };
  }, [products]);

  const handleBulkFlashSale = () => {
    if (selectedProducts.size === 0) return;
    
    selectedProducts.forEach(id => {
      onUpdateProduct(id, { flashSale: bulkFlashSale });
    });
    
    setSelectedProducts(new Set());
    setBulkFlashSale({
      isActive: false,
      discountPercent: 0,
      startDate: '',
      endDate: ''
    });
    setShowBulkModal(false);
  };

  const handleSingleFlashSale = (productId, flashSaleData) => {
    onUpdateProduct(productId, { flashSale: flashSaleData });
    setEditingProduct(null);
  };

  const getFlashSaleStatus = (flashSale) => {
    if (!flashSale?.isActive) return { status: 'inactive', label: 'Không hoạt động', class: 'bg-gray-100 text-gray-600' };
    
    const now = new Date();
    const start = new Date(flashSale.startDate);
    const end = new Date(flashSale.endDate);
    
    if (now > end) return { status: 'expired', label: 'Đã hết hạn', class: 'bg-red-100 text-red-600' };
    if (now < start) return { status: 'upcoming', label: 'Sắp diễn ra', class: 'bg-yellow-100 text-yellow-600' };
    return { status: 'active', label: 'Đang hoạt động', class: 'bg-green-100 text-green-600' };
  };

  const calculateDiscountPrice = (originalPrice, discountPercent) => {
    return originalPrice * (1 - discountPercent / 100);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      
      const status = getFlashSaleStatus(product.flashSale);
      return matchesSearch && status.status === filterStatus;
    });
  }, [products, searchTerm, filterStatus]);

  const handleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Flash Sale</h2>
            <p className="text-gray-600">Thiết lập và quản lý các chương trình flash sale</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Flash Sale Đang Hoạt Động</p>
              <p className="text-2xl font-bold text-gray-900">{flashSaleStats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Flash Sale Sắp Diễn Ra</p>
              <p className="text-2xl font-bold text-gray-900">{flashSaleStats.upcoming}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Flash Sale Đã Hết Hạn</p>
              <p className="text-2xl font-bold text-gray-900">{flashSaleStats.expired}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng Sản Phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{flashSaleStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="expired">Đã hết hạn</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="flex gap-3">
            {selectedProducts.size > 0 && (
              <button
                onClick={() => setShowBulkModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Thiết lập Flash Sale ({selectedProducts.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Chọn tất cả</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá gốc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flash Sale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá khuyến mãi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const status = getFlashSaleStatus(product.flashSale);
                const discountPrice = product.flashSale?.isActive 
                  ? calculateDiscountPrice(product.price, product.flashSale.discountPercent)
                  : null;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.flashSale?.isActive ? (
                          <span className="font-medium text-red-600">-{product.flashSale.discountPercent}%</span>
                        ) : (
                          <span className="text-gray-400">Không có</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {discountPrice ? (
                          <span className="font-medium text-red-600">
                            {Math.round(discountPrice).toLocaleString('vi-VN')}đ
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.class}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.flashSale?.isActive ? (
                        <div>
                          <div>{new Date(product.flashSale.startDate).toLocaleDateString('vi-VN')}</div>
                          <div>{new Date(product.flashSale.endDate).toLocaleDateString('vi-VN')}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {product.flashSale?.isActive && (
                        <button
                          onClick={() => handleSingleFlashSale(product.id, { isActive: false })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Flash Sale Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thiết lập Flash Sale hàng loạt</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phần trăm giảm giá (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={bulkFlashSale.discountPercent}
                  onChange={(e) => setBulkFlashSale(prev => ({
                    ...prev,
                    discountPercent: parseFloat(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={bulkFlashSale.startDate}
                  onChange={(e) => setBulkFlashSale(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={bulkFlashSale.endDate}
                  onChange={(e) => setBulkFlashSale(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bulkActive"
                  checked={bulkFlashSale.isActive}
                  onChange={(e) => setBulkFlashSale(prev => ({
                    ...prev,
                    isActive: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="bulkActive" className="ml-2 text-sm text-gray-700">
                  Kích hoạt Flash Sale
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkFlashSale}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Flash Sale Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa Flash Sale - {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FlashSaleForm
              product={editingProduct}
              onSave={(flashSaleData) => handleSingleFlashSale(editingProduct.id, flashSaleData)}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Flash Sale Form Component
function FlashSaleForm({ product, onSave, onCancel }) {
  const [flashSaleData, setFlashSaleData] = useState({
    isActive: product.flashSale?.isActive || false,
    discountPercent: product.flashSale?.discountPercent || 0,
    startDate: product.flashSale?.startDate || '',
    endDate: product.flashSale?.endDate || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(flashSaleData);
  };

  const discountPrice = flashSaleData.isActive 
    ? product.price * (1 - flashSaleData.discountPercent / 100)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phần trăm giảm giá (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={flashSaleData.discountPercent}
          onChange={(e) => setFlashSaleData(prev => ({
            ...prev,
            discountPercent: parseFloat(e.target.value)
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {discountPrice && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Giá gốc: <span className="font-medium">{product.price.toLocaleString('vi-VN')}đ</span>
          </p>
          <p className="text-sm text-blue-800">
            Giá sau giảm: <span className="font-medium text-red-600">{Math.round(discountPrice).toLocaleString('vi-VN')}đ</span>
          </p>
          <p className="text-sm text-blue-800">
            Tiết kiệm: <span className="font-medium">{Math.round(product.price - discountPrice).toLocaleString('vi-VN')}đ</span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngày bắt đầu
        </label>
        <input
          type="datetime-local"
          value={flashSaleData.startDate}
          onChange={(e) => setFlashSaleData(prev => ({
            ...prev,
            startDate: e.target.value
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngày kết thúc
        </label>
        <input
          type="datetime-local"
          value={flashSaleData.endDate}
          onChange={(e) => setFlashSaleData(prev => ({
            ...prev,
            endDate: e.target.value
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="flashSaleActive"
          checked={flashSaleData.isActive}
          onChange={(e) => setFlashSaleData(prev => ({
            ...prev,
            isActive: e.target.checked
          }))}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="flashSaleActive" className="ml-2 text-sm text-gray-700">
          Kích hoạt Flash Sale
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}