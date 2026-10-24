# TOPwork VINA — Bản demo website miễn phí

**Website đã tự triển khai trên GitHub Pages:** https://hoang0707007-rgb.github.io/topwork-website/

## Trạng thái

- Nguồn: repository public `hoang0707007-rgb/topwork-website`.
- Quy trình tự động: `.github/workflows/pages.yml`; chạy khi push lên nhánh `main`.
- Trang chủ: `public/index.html`, stylesheet `public/styles.css`, logic `public/app.js`, dữ liệu `public/data.js`.
- Mọi thay đổi trên `main` sẽ tự yêu cầu triển khai; theo dõi trong tab Actions.

## Giới hạn bản demo

- Danh mục **91 mục doanh nghiệp** và **91 hồ sơ vị trí tham khảo**, không xác nhận còn tuyển hoặc hợp tác.
- Bản đồ sử dụng Leaflet/OpenStreetMap, ghim là **tâm khu vực**; có nút tìm tên công ty trên Google Maps, chưa có Google Maps nhúng bằng API key.
- `public/data.js` là bản sao dữ liệu tham khảo tại thời điểm phát hành, **không tự đồng bộ trực tiếp Google Sheets**.
- Website chưa mở nhận hồ sơ ứng viên; không chứa dữ liệu CRM riêng tư, số điện thoại người đón, thông tin ngân hàng hay bí mật API.
- Không dùng mức lương, thưởng và điều kiện tuyển dụng chưa xác minh để đăng tuyển thực tế.

## Nâng cấp tiếp theo

Xác minh và phê duyệt nội dung trên Google Sheets; bổ sung backend bảo mật để đồng bộ nội dung được duyệt và thiết lập CRM tuyển dụng có phân quyền.
