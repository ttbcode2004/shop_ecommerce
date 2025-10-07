import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllVouchers } from "../../store/admin/voucher-slice";
import AdminVoucherHeader from "../../components/admin/voucher/AdminVoucherHeader";
import AdminVoucherFilter from "../../components/admin/voucher/AdminVoucherFilter";
import AdminVoucherList from "../../components/admin/voucher/AdminVoucherList";
import Loader from "../../components/ui/Loader";

export default function AdminVouchers() {
  const { isLoadingVouchers, voucherList, total } = useSelector((state) => state.adminVoucher);
  const dispatch = useDispatch();

  const [filteredVoucherList, setFilteredVoucherList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    discountType: "",
    dateRange: "",
  });

  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);

  // Filter vouchers based on search and filters
  useEffect(() => {
    let filtered = [...voucherList];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((voucher) => {
        const code = voucher.code?.toLowerCase() || "";
        const description = voucher.description?.toLowerCase() || "";

        return (
          code.includes(searchTerm.toLowerCase()) ||
          description.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((voucher) => {
        const now = new Date();
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        switch (filters.status) {
          case "active":
            return (
              voucher.isActive &&
              now >= startDate &&
              now <= endDate &&
              (voucher.usageLimit === 0 ||
                voucher.usedCount < voucher.usageLimit)
            );
          case "expired":
            return now > endDate;
          case "disabled":
            return !voucher.isActive;
          case "used_up":
            return (
              voucher.usageLimit >= 0 && voucher.usedCount >= voucher.usageLimit
            );
          default:
            return true;
        }
      });
    }

    // Apply discount type filter
    if (filters.discountType) {
      filtered = filtered.filter(
        (voucher) => voucher.discountType === filters.discountType
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter((voucher) => {
        const startDate = new Date(voucher.startDate);

        switch (filters.dateRange) {
          case "today":
            return startDate.toDateString() === now.toDateString();
          case "this_week":
            const weekStart = new Date(
              now.setDate(now.getDate() - now.getDay())
            );
            const weekEnd = new Date(
              now.setDate(now.getDate() - now.getDay() + 6)
            );
            return startDate >= weekStart && startDate <= weekEnd;
          case "this_month":
            return (
              startDate.getMonth() === now.getMonth() &&
              startDate.getFullYear() === now.getFullYear()
            );
          case "this_year":
            return startDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredVoucherList(filtered);
  }, [voucherList, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoadingVouchers) {
    return <Loader isLoading={isLoadingVouchers} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full px-2">
      <AdminVoucherHeader total={total} />
      <AdminVoucherFilter onSearch={handleSearch} onFilter={handleFilter} />
      <AdminVoucherList voucherList={filteredVoucherList} />
    </div>
  );
}
