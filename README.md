# TOPwork VINA — Website xem thử miễn phí

Đây là phiên bản **demo công khai** của TOPwork VINA, sử dụng GitHub Pages miễn phí từ repository public. Nội dung chưa được duyệt để tuyển dụng chính thức.

## Kích hoạt GitHub Pages

1. Mở **Settings → Pages** tại: https://github.com/hoang0707007-rgb/topwork-website/settings/pages
2. Tại **Build and deployment**, chọn **Source: Deploy from a branch**.
3. Chọn **Branch: main** và **Folder: /(root)**, rồi nhấn **Save**.
4. Sau khi GitHub xuất bản và báo trạng thái thành công, chọn **Visit site** trong trang Pages để lấy URL thật.

Trang gốc `index.html` chuyển đến `public/index.html`. Các file HTML/CSS/JS và bản sao danh mục công khai đã nằm trong thư mục `public/`.

Đường dẫn GitHub Pages dự kiến (chỉ sử dụng sau khi **Visit site** xác nhận):
https://hoang0707007-rgb.github.io/topwork-website/

## Hiện trạng

- Danh mục 91 mục doanh nghiệp và 91 hồ sơ vị trí tham khảo, **không phải đơn tuyển đã xác nhận**.
- Lọc theo công ty/khu vực, bản đồ bằng Leaflet/OpenStreetMap, liên kết tìm địa điểm trên Google Maps.
- Ghim thể hiện **tâm khu vực**; không dùng để chỉ đường đến nhà máy.
- Bản sao dữ liệu trong `public/data.js` là snapshot; **chưa tự động đồng bộ Google Sheets**.
- Không nhận hồ sơ trực tuyến, không thu thập CCCD/số điện thoại ứng viên, không chứa khóa API, thông tin ngân hàng hoặc dữ liệu nội bộ.
- Những thông tin đang chờ duyệt không đồng nghĩa đã hợp tác hoặc đang tuyển.

## Tùy chọn Render

Render có thể yêu cầu thông tin thanh toán tùy cấu hình tài khoản. **GitHub Pages** là lựa chọn được ưu tiên cho demo miễn phí này.
