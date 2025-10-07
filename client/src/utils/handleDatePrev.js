export const formatDatePrev = (dateRange) => {
    let headerDatePrev = null;
  if (dateRange?.currentSelect === "select") {
    if (dateRange.day) {
      const prevDay =
        dateRange.day - 1 < 10 ? `0${dateRange.day - 1}` : dateRange.day - 1;
      headerDatePrev = `${prevDay}/${dateRange.month}/${dateRange.year}`;
    } else if (dateRange.month) {
      const prevMonth =
        dateRange.month - 1 < 10
          ? `0${dateRange.month - 1}`
          : dateRange.month - 1;
      headerDatePrev = `${prevMonth}/${dateRange.year}`;
    } else {
      headerDatePrev = `${dateRange.year - 1}`;
    }
  } else if (dateRange?.currentSelect === "inputDate") {
    let parts;
    let check;
    if (dateRange.date.includes("-")) {
      parts = dateRange.date.split("-");
      check="-"
    } else if (dateRange.date.includes("/")) {
      parts = dateRange.date.split("/");
      check="/"
    }
    const num = Number(parts[0])-1
    headerDatePrev = `${num}${check}${parts[1]}${check}${parts[2]}`;
  }
  return headerDatePrev
}