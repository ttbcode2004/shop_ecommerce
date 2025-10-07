import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers } from "../../store/admin/user-slice";
import { LoaderCircle, Plus } from "lucide-react";
import UserSummary from "../../components/admin/user/UserSummary";
import UserFilter from "../../components/admin/user/UserFilter";
import AdminUserList from "../../components/admin/user/AdminUserList";
import Loader from "../../components/ui/Loader";

export default function AdminUsers() {
  const { isLoadingUsers, userList, isLoadingUsersAction } = useSelector(state => state.adminUser)
  const { sidebarOpen } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  const [isReferesh, setIsReferesh] = useState(false)
  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false)

  const [filters, setFilters] = useState({
    search: "",
    sort: "newest",
  });

  // Apply filters to userList
  const filteredUsers = [...(userList || [])]
    .filter(user => {
      if (!filters.search) return true;
      const searchLower = filters.search.toLowerCase();
      return user.name.toLowerCase().includes(searchLower) || 
             user.email.toLowerCase().includes(searchLower) ||
             (user.phone && user.phone.includes(filters.search));
    })
    .filter(user => {
      // Handle date filters separately
      if (filters.sort === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(user.createdAt) >= sevenDaysAgo;
      }
      if (filters.sort === "1month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(user.createdAt) >= oneMonthAgo;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "muchSpent":
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        case "lessSpent":
          return (a.totalSpent || 0) - (b.totalSpent || 0);
        case "muchOrders":
          return (b.ordersCount || 0) - (a.ordersCount || 0);
        case "lessOrders":
          return (a.ordersCount || 0) - (b.ordersCount || 0);
        case "7days":
        case "1month":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, isReferesh]);

  if (isLoadingUsers) {
    return <Loader isLoading={isLoadingUsers} />;
  }

  return (
    <div className="flex flex-col gap-4 w-full px-2">
      <div className={`flex items-center justify-between mb-2 text-slate-800 ${!sidebarOpen ? "ml-20" : ""}`}>
        <h1 className={`md:text-2xl text-xl font-semibold `}>
          Thông tin tài khoản khách hàng
        </h1>
       <div className="flex items-center gap-8">
         <button
          onClick={()=>setIsReferesh(prev => !prev)}
          className="text-blue-500 hover:text-blue-700"
        >
          <LoaderCircle />
        </button>
        <button
          onClick={()=> setIsOpenCreateUser(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-sm transition-colors font-medium"
        >
          <Plus size={16} />
          Thêm tài khoản
        </button>
       </div>
      </div>
      <UserSummary userList={userList}/>
      <UserFilter filters={filters} setFilters={setFilters} />
      <AdminUserList isReferesh={isReferesh} isOpenCreateUser={isOpenCreateUser} onCloseCreateUser = {()=>setIsOpenCreateUser(false)} userList={filteredUsers} isLoadingUsersAction={isLoadingUsersAction} />
    </div>
  )
}