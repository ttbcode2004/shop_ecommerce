import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDelivers} from "../../store/admin/deliver-slice";
import Loader from "../../components/ui/Loader";
import AdminDeliverHeader from "../../components/admin/deliver/AdminDeliverHeader";
import AdminDeliverList from "../../components/admin/deliver/AdminDeliverList";

export default function AdminDelivers() {
  const dispatch = useDispatch();
  const { deliverList, total, isLoadingDelivers, isLoadingActions } = useSelector(state => state.adminDeliver);
    

  useEffect(() => {
    dispatch(getAllDelivers());
  }, [dispatch]);

  if (isLoadingDelivers) return <Loader isLoading={isLoadingDelivers} />;

  return (
    <div className="flex flex-col gap-6 w-full px-2">
      <AdminDeliverHeader total={total}/>
      <AdminDeliverList deliverList={deliverList} isLoadingActions={isLoadingActions}/>
    </div>
  );
}
