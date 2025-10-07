import crypto from 'crypto';
import axios from 'axios';

export const createMoMoPayment = async (order) => {
  const partnerCode = 'MOMO'; // đổi sang mã thật từ sandbox
  const accessKey = 'F8BBA842ECF85';
  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const redirectUrl ='http://localhost:5173/payment-success';
  const ipnUrl = 'http://localhost:5000/api/v1/payment/momo/callback';
  const requestType = 'payWithMethod';
  
  const requestId = order._id.toString() + Date.now();
  const orderId = order._id.toString();
  const orderInfo = `Thanh toán đơn hàng ${orderId}`;
  const amount = (order.totalPrice).toString(); // phải là string

  // MoMo yêu cầu rawSignature theo đúng thứ tự
  const rawSignature =
    `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    requestType,
    signature,
    extraData: '',
  };

  console.log('Body gửi lên MoMo:', body);

  try {
    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/create',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.payUrl;
  } catch (error) {
    console.error('❌ MoMo error:', error.response?.data || error.message);
    throw error;
  }
};
