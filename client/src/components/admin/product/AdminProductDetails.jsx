import { ArrowLeft, Star, Calendar, Package, Users, Tag, Zap, TrendingUp, Edit } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Loader from "../../ui/Loader";
import { categoryList, peopleList, colorTranslate } from "../../../config";
import {formatPrice} from "../../../utils/formatPrice.js"

export default function AdminProductDetails({ product }) {
  
  if (!product) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader isLoading={true} />
      </div>
    );
  }

  const {
    name,
    summary,
    description,
    price,
    discountPercent,
    category,
    people,
    sizes,
    images,
    sold,
    bestSeller,
    ratingsAverage,
    ratingsQuantity,
    flashSale,
    createdAt,
    reviews,
    _id
  } = product;

  

  const getFlashSaleStatus = () => {
    if (!flashSale?.isActive) return null;
    
    const now = new Date();
    const start = flashSale.startDate ? new Date(flashSale.startDate) : null;
    const end = flashSale.endDate ? new Date(flashSale.endDate) : null;

    if (start && end) {
      if (now > end) {
        return { status: 'expired', message: '⚠️ Flash Sale đã hết hạn', class: 'text-red-600 bg-red-50' };
      } else if (now < start) {
        return { status: 'upcoming', message: '⏳ Flash Sale sắp diễn ra', class: 'text-yellow-600 bg-yellow-50' };
      } else {
        return { status: 'active', message: '🔥 Flash Sale đang diễn ra', class: 'text-green-600 bg-green-50' };
      }
    }
    
    return { status: 'active', message: '✅ Flash Sale đang hoạt động', class: 'text-blue-600 bg-blue-50' };
  };

  const flashSaleStatus = getFlashSaleStatus();

  return (
    <div className={`
      min-h-screen transition-all duration-300
    `}>
      <div className=" py-4 space-y-6">
        
        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID: {_id}</p>
                  <p className="text-xs text-gray-400">
                    Tạo lúc: {format(new Date(createdAt), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                  </p>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
              <p className="text-gray-600 mb-4">{summary}</p>
              
              {/* Status Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {bestSeller && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                    <TrendingUp size={14} />
                    Sản phẩm bán chạy
                  </span>
                )}
                
                {flashSale?.isActive && flashSaleStatus && (
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full font-medium ${flashSaleStatus.class}`}>
                    {flashSaleStatus.message}
                  </span>
                )}
                
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  <Users size={14} />
                  {sold || 0} đã bán
                </span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{formatPrice(price)}</p>
          
                  <p className="text-sm text-green-600 font-medium">
                    Giảm {discountPercent}%
                  </p>
      
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{ratingsAverage || 0}</span>
                <span className="text-gray-400 text-sm">({ratingsQuantity || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="p-1 bg-purple-100 rounded">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            Hình ảnh sản phẩm
          </h2>
          
          {images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={index} className="group relative">
                  <img
                    src={img}
                    alt={`${name} - ${index + 1}`}
                    className="w-full h-69 object-cover rounded-lg border border-gray-200 
                             transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                  />
                
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto w-12 h-12 mb-2 opacity-50" />
              <p>Chưa có hình ảnh</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="p-1 bg-green-100 rounded">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              Thông tin sản phẩm
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                <p className="mt-1 text-gray-600 leading-relaxed">{description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Danh mục</label>
                  <p className="mt-1 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {categoryList.find((c) => c === category) || category || "—"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Đối tượng</label>
                  <p className="mt-1 inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                    {peopleList.find((p) => p === people) || people || "—"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Giá bán</label>
                  <p className="mt-1 text-lg font-semibold text-red-600">{formatPrice(price)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Giảm giá</label>
                  <p className="mt-1 text-lg font-semibold text-green-600">{discountPercent}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="p-1 bg-orange-100 rounded">
                <Zap className="w-4 h-4 text-orange-600" />
              </div>
              Flash Sale
            </h2>
            
            {flashSale?.isActive ? (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${flashSaleStatus?.class || 'bg-gray-50'}`}>
                  <p className="font-medium">{flashSaleStatus?.message}</p>
                </div>
                
                {flashSale.startDate && flashSale.endDate && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
                      <p className="mt-1 text-sm text-gray-600">
                        {format(new Date(flashSale.startDate), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Thời gian kết thúc</label>
                      <p className="mt-1 text-sm text-gray-600">
                        {format(new Date(flashSale.endDate), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Zap className="mx-auto w-12 h-12 mb-2 opacity-30" />
                <p>Không có Flash Sale</p>
              </div>
            )}
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="p-1 bg-indigo-100 rounded">
              <Package className="w-4 h-4 text-indigo-600" />
            </div>
            Kích thước & Màu sắc
          </h2>
          
          {sizes && sizes.length > 0 ? (
            <div className="space-y-4">
              {sizes.map((sizeData, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Size: {sizeData.size}</h3>
                  
                  {sizeData.colors && sizeData.colors.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {sizeData.colors.map((colorData, colorIdx) => (
                        <div
                          key={colorIdx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                        >
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: colorData.color }}
                            title={colorData.color}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {colorTranslate[colorData.color?.toLowerCase()] || colorData.color}
                            </p>
                            <p className="text-xs text-gray-500">
                              SL: {colorData.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Chưa có màu sắc</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto w-12 h-12 mb-2 opacity-50" />
              <p>Chưa có thông tin kích thước</p>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="p-1 bg-yellow-100 rounded">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            Đánh giá khách hàng ({reviews?.length || 0})
          </h2>
          
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.user?.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({review.rating})</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Star className="mx-auto w-12 h-12 mb-2 opacity-50" />
              <p>Chưa có đánh giá nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}