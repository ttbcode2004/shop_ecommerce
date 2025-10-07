import ShoppingHero from "../../components/shopping/Home/ShoppingHero";
import ShoppingCategory from "../../components/shopping/Home/ShoppingCategory";
import ShoppingFlashSale from "../../components/shopping/Home/ShoppingFlashSale";
import ShoppingShirts from "../../components/shopping/Home/ShoppingShirts";
import ShoppingPant from "../../components/shopping/Home/ShoppingPant";
import ShoppingSpecial from "../../components/shopping/Home/ShoppingSpecial";
import ShoppingReview from "../../components/shopping/Home/ShoppingReview";
import Footer from "../../components/ui/Footer";

export default function ShoppingHome() {
  return (
    <>
      <ShoppingHero/>
      <ShoppingCategory/>
      <div id="flash-sales" className="mt-14 md:px-10 lg:px-12 px-6">
        <ShoppingFlashSale/>
      </div>

      <div id="ao" className="mt-14">
        <ShoppingShirts/>
      </div>

      <div id="quan" className="mt-14">
        <ShoppingPant/>
      </div>

      <div id="special" className="mt-14">
        <ShoppingSpecial/>
      </div>

      <ShoppingReview/>

      <Footer/>
    </>
  )
}
