import {useState } from "react";
import AccountNavigation from "../../components/shopping/account/AccountNavigation"
import ShoppingOrders from "../../components/shopping/order/ShoppingOrders";
import ShoppingOrdersHistory from "../../components/shopping/order/ShoppingOrdersHistory";
import ShoppingAddress from "../../components/shopping/address/ShoppingAddress";
import ShoppingUser from "../../components/shopping/user/ShoppingUser";
import ShoppingVoucher from "../../components/shopping/voucher/ShoppingVoucher";

export default function ShoppingAccount() {
  const [activeTab, setActiveTab] = useState("orders"); 

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-10 mt-4 md:px-10 lg:px-16 px-6">
      <AccountNavigation activeTab={activeTab} setActiveTab={setActiveTab}/>

      <div className="w-full min-h-100 ">
        {activeTab === "orders" && <ShoppingOrders/>}
        {activeTab === "history" && <ShoppingOrdersHistory/>}
        {activeTab === "addresses" && <ShoppingAddress/>}
        {activeTab === "security" && <ShoppingUser/>}
        {activeTab === "vouchers" && <ShoppingVoucher/>}
      </div>
    </div>
  );
}
