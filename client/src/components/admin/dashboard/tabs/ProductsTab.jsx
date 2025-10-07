import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList, }from "recharts";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsData, getProductsOverview, getTopSellingProducts, } from "../../../../store/admin/dashboard-slice";
import { formatPrice } from "../../../../utils/formatPrice";
import StatCard from "../StatCard";
import Loader1 from "../../../ui/Loader1";

const IconMap = [
  { icon: Package, color: "blue" },
  { icon: TrendingUp, color: "green" },
  { icon: AlertTriangle, color: "red" },
  { icon: AlertTriangle, color: "yellow" },
];

const ProductsTab = () => {
  const { isLoadingProductsOverview, productsOverview, productsData, topSellingproducts } =
    useSelector((state) => state.adminDashboard);
  const dispatch = useDispatch();
  console.log(productsData);
  
  useEffect(() => {
    dispatch(getProductsOverview());
    dispatch(getProductsData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6 relative">
      {isLoadingProductsOverview && <Loader1 isLoading={isLoadingProductsOverview}/>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {productsOverview.statCards?.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            currentValue={stat.totalValue}
            icon={IconMap[idx].icon}
            color={IconMap[idx].color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(() => {
          
          const normalizeData = (data) => {
            const max = Math.max(...data.map((d) => d.sold), 1);
            return data.map((d) => ({
              ...d,
              soldPercent: (d.sold / max) * 100, // vẽ theo % để cột đều nhau
            }));
          };

          const productCategoriesNorm = normalizeData(productsData?.productCategories || []);
          const topProductsNorm = normalizeData(productsData?.topProducts || []);

          // ✅ Hàm render tick 2 dòng (nếu ngắn thì dòng 2 trống)
          const renderTwoLineTick = ({ x, y, payload }) => {
            const words = payload.value.split(" ");
            const firstLine = words.slice(0, 2).join(" ");
            const secondLine = words.slice(2).join(" ");
            return (
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                fontSize={12}
                fill="#374151"
              >
                <tspan x={x} dy="0">
                  {firstLine}
                </tspan>
                <tspan x={x} dy="12">
                  {secondLine || ""}
                </tspan>
              </text>
            );
          };

          return (
            <>
              {/* Chart theo loại sản phẩm */}
              <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                  📊 Loại sản phẩm
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={productCategoriesNorm}
                    margin={{ top: 30, right: 30, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="category"
                      interval={0}
                      tick={renderTwoLineTick}
                    />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        props.payload.sold.toLocaleString(), 
                        "Số lượng bán",
                      ]}
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="soldPercent" fill="url(#colorSold)">
                      <LabelList
                        dataKey="sold"
                        position="top"
                        fill="#374151"
                        formatter={(val) => val.toLocaleString()}
                      />
                    </Bar>
                    <defs>
                      <linearGradient
                        id="colorSold"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#60A5FA"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart theo top 5 sản phẩm */}
              <div className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-6 text-gray-700">
                  🔥 Top 5 sản phẩm bán chạy
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={topProductsNorm}
                    margin={{ top: 30, right: 30, left: 0, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      tick={renderTwoLineTick}
                    />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        props.payload.sold.toLocaleString(),
                        "Số lượng bán",
                      ]}
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="soldPercent" fill="url(#colorTop)">
                      <LabelList
                        dataKey="sold"
                        position="top"
                        fill="#374151"
                        formatter={(val) => val.toLocaleString()}
                      />
                    </Bar>
                    <defs>
                      <linearGradient id="colorTop" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#F97316"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FDBA74"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          );
        })()}
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">
            Danh sách Loại sản phẩm chi tiết
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productsData.productCategories?.map((product, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[16px] font-medium text-gray-900 min-w-xs ">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-blue-900">
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-orange-800">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-gray-900">
                    {formatPrice(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-sm ${
                        product.stock <= 5
                          ? "bg-red-100 text-red-800"
                          : product.stock <= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-slate-200 mb-8">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold">
            Top sản phẩm bán chạy
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-[14px] font-medium text-gray-900 uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topSellingproducts?.map((product, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[16px] font-medium text-gray-900  min-w-xs ">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-blue-900">
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] text-orange-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[16px] font-medium text-gray-900">
                    {formatPrice(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-sm ${
                        product.stock <= 5
                          ? "bg-red-100 text-red-800"
                          : product.stock <= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
