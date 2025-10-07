export const toSlug = (str) => {
    return str
    .normalize("NFD")                  // chuẩn hóa ký tự có dấu
    .replace(/[\u0300-\u036f]/g, "")   // xóa dấu
    .toLowerCase()                     // về chữ thường
    .trim()                            // bỏ khoảng trắng đầu/cuối
    .replace(/[^a-z0-9\s-]/g, "")      // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-")              // thay khoảng trắng = dấu "-"
    .replace(/-+/g, "-");              // gộp nhiều "-" thành 1
}