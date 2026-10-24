# TOPwork VINA · Website 3.0 (GitHub Pages)

**Website:** https://hoang0707007-rgb.github.io/topwork-website/  
**Mã nguồn:** https://github.com/hoang0707007-rgb/topwork-website

## Đã hoàn thành

- Giao diện TOPwork VINA 3.0 responsive, màu sắc thương hiệu, tìm kiếm và bộ lọc khu vực.
- Bản đồ doanh nghiệp đặt lên trước danh sách vị trí; hỗ trợ lọc mục có nguồn đối chiếu địa điểm.
- Phân luồng trải nghiệm cho **người lao động / doanh nghiệp / cộng tác viên**.
- Mục minh bạch trạng thái tuyển dụng, giải thích quy trình xác minh và FAQ.
- 91 mục doanh nghiệp và 91 hồ sơ vị trí **DRAFT**, là bản sao tham khảo từ Google Sheets, **không phải các đơn hiện đang tuyển**.
- 13 mục có nguồn đối chiếu **địa điểm** ban đầu; đây không phải xác nhận quan hệ hợp tác hoặc đang tuyển.
- Bản đồ Leaflet / OpenStreetMap thể hiện **tâm khu vực**, mỗi công ty có nút tìm kiếm trên Google Maps.
- GitHub Actions chạy `node --check` và `node scripts/verify.mjs` trước mỗi lần xuất bản.

## Quản trị nội dung

Google Sheets CMS (quản lý của TOPwork):  
https://docs.google.com/spreadsheets/d/1DEdbK7JEwjnLcaDenSLh1cFxRTXzJHpRMp7OYGiwxqs/edit

Các tab **Companies** và **Jobs** đã bổ sung trường ngày xác minh, người duyệt và ghi chú công bố.  
Tab **Publish_Review** gồm 10 bước rà soát trước khi đưa tin lên website.

**Điều kiện đăng một đơn tuyển dụng thật:** phải có người duyệt xác nhận vị trí, số lượng, lương/phụ cấp/thưởng kèm điều kiện, địa điểm, thời hạn, hồ sơ và cách tiếp nhận dữ liệu ứng viên hợp pháp. Không tự đổi DRAFT thành PUBLISHED.

## Các giới hạn hiện tại

- **GitHub Pages chỉ lưu bản tĩnh:** dữ liệu `public/data.js` chưa đồng bộ tự động từ Google Sheets.
- **Chưa có backend/CRM có xác thực:** không nhận hồ sơ online, không lưu CCCD hay dữ liệu ứng viên.
- **Google Maps trực tiếp** chưa bật vì chưa cấu hình Google Maps JavaScript API và billing của Google Cloud. Nút Google Maps chỉ mở trang tìm kiếm.
- Tên khu vực được giữ theo cách ghi trong Excel gốc, có thể không trùng ranh giới hành chính hiện hành.
- Repo public: **tuyệt đối không tải lên** thông tin ngân hàng, ghi chú người đón, dữ liệu riêng tư, API key hay thông tin lương thưởng chưa duyệt.

## Cấu trúc

- `public/index.html`: trang web
- `public/styles.css`, `public/upgrade.css`: CSS và giao diện v3
- `public/data.js`: snapshot dữ liệu công khai an toàn
- `public/app.js`, `public/upgrade.js`: tìm kiếm, lọc, bản đồ, tương tác
- `scripts/verify.mjs`: smoke tests
- `.github/workflows/pages.yml`: tự động kiểm thử và xuất bản GitHub Pages

## Đường đi lên hệ thống thật

1. TOPwork xác minh dữ liệu công ty/đơn tuyển và phê duyệt pháp lý/chính sách.
2. Xây backend riêng có phân quyền, API trả về **chỉ nội dung đã duyệt**, đồng bộ Google Sheets theo lịch có log và kiểm soát lỗi.
3. Bật form ứng tuyển với thông báo đồng ý, chính sách dữ liệu cá nhân và phân quyền nhân sự.
4. Kết nối CRM/CTV và làm quy trình QA, backup, kiểm thử bảo mật trước production.
