import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPantProducts } from "../../../store/shop/products-slice";
import { pantList } from "../../../config";
import ProductItem from "../../ui/ProductItem";
import NavLinkHome from "../../ui/NavLinkHome";
import Loader1 from "../../ui/Loader1";

const navlinkHeader = { name: "QUẦN", link: "quan" };

const PantProductList = React.memo(({ products }) => {
  return (
    <div className="grid lg:gap-7 gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:px-10 lg:px-14 px-6">
      {products?.map((product, idx) => (
        <ProductItem idx={idx} key={product._id} product={product} />
      ))}
    </div>
  );
});

export default function ShoppingPant() {
  const { pantProducts, pantLoading } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    if(pantProducts.length === 0){
      dispatch(getPantProducts({ limit: 10 }));
    }
  }, [dispatch, pantProducts]);

  return (
    <div className="relative">
      {pantLoading && <Loader1 isLoading={pantLoading} />}
      <NavLinkHome navlinkHeader={navlinkHeader} navlinkList={pantList} />
      <PantProductList products={pantProducts}/>
    </div>
)
}