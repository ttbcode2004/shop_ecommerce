import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShirtProducts } from "../../../store/shop/products-slice";
import { shirtList } from "../../../config";
import ProductItem from "../../ui/ProductItem";
import NavLinkHome from "../../ui/NavLinkHome";
import Loader1 from "../../ui/Loader1";

const navlinkHeader = { name: "ÁO", link: "ao" };

const ShirtProductList = React.memo(({ products }) => {
  return (
    <div className="grid lg:gap-7 gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-10 lg:px-14 px-6">
      {products?.map((product, idx) => (
        <ProductItem idx={idx} key={product._id} product={product} />
      ))}
    </div>
  );
});

export default function ShoppingShirts() {
  const shirtsLoading = useSelector((state) => state.shopProducts.shirtsLoading);
  const shirtProducts = useSelector((state) => state.shopProducts.shirtProducts);

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (shirtProducts.length === 0) {
      dispatch(getShirtProducts({ limit: 10 }));
    }
  }, [dispatch, shirtProducts]);

  return (
    <div className="relative">
      {shirtsLoading && <Loader1 isLoading={shirtsLoading}/>}
      <NavLinkHome navlinkHeader={navlinkHeader} navlinkList={shirtList} />
      <ShirtProductList products={shirtProducts} />
    </div>
  );
}
