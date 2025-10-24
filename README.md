FRONTEND: https://bach-shop-frontend.vercel.app/

admin
123@gmail.com
12345678

 ⚙️ Công nghệ chính
| Công nghệ              | Mô tả                                                                        |
| ---------------------- | ---------------------------------------------------------------------------- |
| ⚛️ **React.js**        | Xây dựng giao diện người dùng.                                               |
| 🧩 **Redux Toolkit**   | Quản lý state toàn cục (auth, toast, dữ liệu người dùng).                    |
| 🔥 **Firebase**        | Xác thực người dùng (login/register bằng email hoặc Google, reset password). |
| 🪄 **React Router v6** | Định tuyến (Routing) giữa các trang.                                         |
| 💬 **React Toastify**  | Hiển thị thông báo thành công/lỗi toàn cục.                                  |
| 🎨 **Tailwind CSS**    | Thiết kế giao diện hiện đại, responsive.                                     |

📁 Cấu trúc route chính
| **Nhóm Route** | **Đường dẫn (Path)** | **Mô tả**                              |
| -------------- | -------------------- | -------------------------------------- |
| **/auth**      | `/auth/login`        | Đăng nhập                              |
|                | `/auth/register`     | Đăng ký                                |
|                | `/auth/forgot`       | Quên mật khẩu                          |
| **/admin**     | `/admin/dashboard`   | Thống kê tổng quan                     |
|                | `/admin/products`    | Quản lý sản phẩm                       |
|                | `/admin/orders`      | Quản lý đơn hàng                       |
|                | `/admin/users`       | Danh sách người dùng                   |
|                | `/admin/vouchers`    | Mã giảm giá                            |
|                | `/admin/delivers`    | Đơn vị vận chuyển                      |
|                | `/admin/account`     | Tài khoản admin                        |
| **/**          | `/`                  | Trang chủ (Home)                       |
|                | `/about`             | Giới thiệu                             |
|                | `/products/:slug`    | Chi tiết sản phẩm                      |
|                | `/cart`              | Giỏ hàng                               |
|                | `/wishlist`          | Danh sách yêu thích                    |
|                | `/placeOrder`        | Đặt hàng                               |
|                | `/account`           | Tài khoản người dùng *(Private)*       |
|                | `/reset-password`    | Đặt lại mật khẩu *(Firebase)*          |
|                | `/payment-success`   | Thanh toán thành công *(MoMo / VNPay)* |
|                | `/:slug`             | Trang danh mục sản phẩm                |
|                | `/unauth-page`       | Trang từ chối truy cập                 |
|                | `*`                  | Trang 404 - Không tìm thấy trang       |


 BACKEND: https://bach-shop-backend.onrender.com/
 
 ⚙️ Công nghệ chính
 | Công nghệ                        | Mô tả                                         |
| -------------------------------- | --------------------------------------------- |
| 🚀 **Node.js + Express.js**      | Xây dựng RESTful API.                         |
| 🍃 **MongoDB + Mongoose**        | Cơ sở dữ liệu chính.                          |
| 🔐 **JWT + Cookie**              | Xác thực và lưu phiên người dùng.             |
| 🌍 **CORS**                      | Cho phép frontend (React) truy cập server.    |
| ☁️ **Cloudinary + Multer**       | Upload và lưu trữ hình ảnh sản phẩm, avatar.  |
| 💸 **MoMo + VNPay**              | Cổng thanh toán trực tuyến.                   |
| 📦 **Multer-Storage-Cloudinary** | Lưu ảnh trực tiếp lên Cloudinary khi upload.  |
| 🕒 **Moment-Timezone + DayJS**   | Xử lý thời gian và múi giờ đơn hàng.          |
| 🔐 **Bcrypt/BcryptJS**           | Mã hóa mật khẩu.                              |
| 🪄 **Slugify**                   | Tạo đường dẫn thân thiện cho sản phẩm.        |
| 💬 **Morgan**                    | Ghi log request trong môi trường dev.         |
| 🔧 **Dotenv**                    | Quản lý biến môi trường `.env`.               |

📁 Cấu trúc route chính
| Route               | Mô tả chức năng                                   |
| ------------------- | ------------------------------------------------- |
| `/api/v1/users`     | Đăng ký, đăng nhập, cập nhật thông tin, xác thực. |
| `/api/v1/products`  | CRUD sản phẩm, upload ảnh, tìm kiếm, phân trang.  |
| `/api/v1/vouchers`  | Quản lý mã giảm giá.                              |
| `/api/v1/delivers`  | Quản lý đơn vị vận chuyển.                        |
| `/api/v1/reviews`   | Đánh giá sản phẩm.                                |
| `/api/v1/carts`     | Giỏ hàng người dùng.                              |
| `/api/v1/wishlists` | Danh sách yêu thích.                              |
| `/api/v1/address`   | Địa chỉ người dùng.                               |
| `/api/v1/orders`    | Quản lý đơn hàng, thanh toán MoMo / VNPay.        |
| `/api/v1/subOrders` | Quản lý chi tiết đơn hàng con.                    |
| `/api/v1/dashboard` | Thống kê, báo cáo dành cho admin.                 |


