1. Cấu trúc mã nguồn
   /project
   │
   ├── data/
   │ ├── sinhvien.json # Thông tin sinh viên  
   │ ├── monhoc.json # Danh sách môn học  
   │ └── ketqua.json # Kết quả học tập  
   │
   ├── index.html  
   ├── style.css  
   ├── scripts.js # Xử lý logic  
   │
   └── README.md

2. Xử lý bất đồng bộ
   Sử dụng async/await với fetch() (hoặc fs/promises nếu chạy Node.js) để đọc JSON.
   await -> đảm bảo dữ liệu được tải xong trước khi xử lý tiếp.

3. Quy trình làm việc
   Đọc dữ liệu từ sinhvien.json, monhoc.json, ketqua.json
   Ghép nối theo sid và cid để tạo bảng kết quả tổng hợp
   Chuyển đổi điểm chữ -> hệ 10
   Hiển thị kết quả ra giao diện web
