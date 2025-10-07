// vnpay.service.js
import moment from "moment-timezone";
import qs from "qs";
import crypto from "crypto";

function sortObject(obj) {
  return Object.entries(obj)
    .sort(([key1], [key2]) => key1.localeCompare(key2))
    .reduce((result, [k, v]) => {
      result[k] = encodeURIComponent(v.toString().replace(/ /g, "+"));
      return result;
    }, {});
}

export const createVNPayPayment = (order) => {
  const vnp_TmnCode = "08327UFY"; // Lấy từ VNPAY portal
  const vnp_HashSecret = "ALXE2OWRC1JESJMB78GAW9SE6PVW6IIF"; // Secret từ VNPAY
  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const vnp_ReturnUrl = "http://localhost:5173/payment-success";

  const date = moment.tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss");
  const expire = moment.tz("Asia/Ho_Chi_Minh").add(15, "minutes").format("YYYYMMDDHHmmss");
  const orderId = moment().format("DDHHmmss");

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: order._id.toString(),
    vnp_OrderInfo: `Thanh toan cho GD:${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: order.totalPrice * 100, // số tiền nhân 100
    vnp_ReturnUrl,
    vnp_IpAddr: order.ipAddr || "127.0.0.1",
    vnp_CreateDate: date,
    vnp_ExpireDate: expire,
  };

  // Sắp xếp tham số
  vnp_Params = sortObject(vnp_Params);

  // Tạo query string
  const signData = qs.stringify(vnp_Params, { encode: false });

  // Tạo secure hash (HMAC SHA512)
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Gắn vào URL
  const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

  // console.log(paymentUrl);
  
  return paymentUrl;
};
