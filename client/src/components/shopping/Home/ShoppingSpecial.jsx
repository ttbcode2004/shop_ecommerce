import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProducts } from "../../../store/shop/products-slice";
import ProductItem from "../../ui/ProductItem";
import NavLinkHome from "../../ui/NavLinkHome";
import Loader1 from "../../ui/Loader1";

const navlinkHeader = { name: "SẢN PHẨM NỔI BẬC", link: "san-pham-moi" };

const FeaturedProductList = React.memo(({ products }) => {
  return (
    <div className="grid lg:gap-7 gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-10 lg:px-14 px-6">
      {products?.map((product, idx) => (
        <ProductItem idx={idx} key={product._id} product={product} />
      ))}
    </div>
  );
});

export default function ShoppingSpecial() {
  const { featuredProducts, featuredLloading } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(featuredProducts.length === 0){
      dispatch(getFeaturedProducts());
    }
  }, [featuredProducts]);

  return (
    <div className="relative">
      {featuredLloading && <Loader1 isLoading={featuredLloading}/>}
      <NavLinkHome navlinkHeader={navlinkHeader} />
      <FeaturedProductList products={featuredProducts}/>
    </div>
  );
}
