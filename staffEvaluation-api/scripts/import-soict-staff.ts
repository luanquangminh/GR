import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const soictStaff = [
  // Page 1 (20)
  { name: "Tạ Hải Tùng", academicrank: "PGS", academicdegree: "TS", schoolEmail: "tung.tahai@hust.edu.vn", homeEmail: "tungth@soict.hust.edu.vn", position: "Hiệu trưởng Trường CNTT&TT", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Linh Giang", academicrank: "PGS", academicdegree: "TS", schoolEmail: "giangnl@soict.hust.edu.vn", homeEmail: null, position: "Trưởng Khoa Kỹ thuật Máy tính", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Phạm Thanh Liêm", academicrank: null, academicdegree: "ThS", schoolEmail: "liem.phamthanh@hust.edu.vn", homeEmail: "liempt@soict.hust.edu.vn", position: "Giám đốc TT Máy tính và Thực hành", department: "Trung tâm Máy tính và Thực hành" },
  { name: "Bành Thị Quỳnh Mai", academicrank: null, academicdegree: "ThS", schoolEmail: "maibtq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Khanh Văn", academicrank: "PGS", academicdegree: "TS", schoolEmail: "van.nguyenkhanh@hust.edu.vn", homeEmail: "vannk@soict.hust.edu.vn", position: "Trưởng phòng PTN CNPM", department: "Khoa Khoa học Máy tính" },
  { name: "Ngô Thành Trung", academicrank: null, academicdegree: "TS", schoolEmail: "trungnth@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Trịnh Văn Chiến", academicrank: null, academicdegree: "TS", schoolEmail: "chientv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Thị Thanh Nga", academicrank: null, academicdegree: "TS", schoolEmail: "ngantt@soict.hust.edu.vn", homeEmail: null, position: "Phó Trưởng Văn phòng", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Lê Tấn Hùng", academicrank: null, academicdegree: "ThS", schoolEmail: "hunglt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Lã Thế Vinh", academicrank: "PGS", academicdegree: "TS", schoolEmail: "vinh.lathe@hust.edu.vn", homeEmail: "vinhlt@soict.hust.edu.vn", position: "Giám đốc TT NAVIS", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Hữu Đức", academicrank: null, academicdegree: "TS", schoolEmail: "duc.nguyenhuu@hust.edu.vn", homeEmail: null, position: "Giám đốc TT Công nghệ Dữ liệu", department: "Khoa Khoa học Máy tính" },
  { name: "Phạm Văn Hải", academicrank: "PGS", academicdegree: "TS", schoolEmail: "haipv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên cao cấp", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Hoàng Hải", academicrank: null, academicdegree: "TS", schoolEmail: "hai.tranhoang@hust.edu.vn", homeEmail: "haith@soict.hust.edu.vn", position: "Phó Giám đốc TT Mạng thông tin", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Đức Toàn", academicrank: null, academicdegree: "TS", schoolEmail: "toannd@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Vũ Tuyết Trinh", academicrank: null, academicdegree: "TS", schoolEmail: "trinhvt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Huỳnh Thị Thanh Bình", academicrank: "GS", academicdegree: "TS", schoolEmail: "binhht@soict.hust.edu.vn", homeEmail: null, position: "Phó Hiệu trưởng Trường CNTT&TT", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Xuân Thành", academicrank: null, academicdegree: "TS", schoolEmail: "thanh.lexuan@hust.edu.vn", homeEmail: null, position: "Trưởng Văn phòng Trường", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Đức Tiến", academicrank: null, academicdegree: "ThS", schoolEmail: "tien.nguyenduc@hust.edu.vn", homeEmail: "tiennd@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Phạm Thị Phương Giang", academicrank: null, academicdegree: "ThS", schoolEmail: "giangptp@soict.hust.edu.vn", homeEmail: null, position: "Cán bộ phục vụ giảng dạy", department: "Bộ môn Hệ thống Thông tin" },
  { name: "Trần Quang Đức", academicrank: "PGS", academicdegree: "TS", schoolEmail: "duc.tranquang@hust.edu.vn", homeEmail: null, position: "Giám đốc TT An toàn An ninh TT", department: "Khoa Kỹ thuật Máy tính" },

  // Page 2 (20)
  { name: "Vũ Văn Thiệu", academicrank: null, academicdegree: "TS", schoolEmail: "thieuvv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Hoàng Văn Hiệp", academicrank: null, academicdegree: "TS", schoolEmail: "hiephv@soict.hust.edu.vn", homeEmail: null, position: "Phó giám đốc TT Máy tính", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Cao Tuấn Dũng", academicrank: "PGS", academicdegree: "TS", schoolEmail: "dung.caotuan@hust.edu.vn", homeEmail: null, position: "Phó Hiệu trưởng Trường CNTT&TT", department: "Khoa Khoa học Máy tính" },
  { name: "Phạm Đăng Hải", academicrank: null, academicdegree: "TS", schoolEmail: "haipd@soict.hust.edu.vn", homeEmail: null, position: "Trưởng khoa, Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Ngô Lam Trung", academicrank: null, academicdegree: "TS", schoolEmail: "trung.ngolam@hust.edu.vn", homeEmail: "trungnl@soict.hust.edu.vn", position: "Phó Trưởng Khoa Kỹ thuật Máy tính", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Vũ Thị Hương Giang", academicrank: null, academicdegree: "TS", schoolEmail: "giangvth@soict.hust.edu.vn", homeEmail: null, position: "Phó trưởng khoa, Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Thanh Hương", academicrank: "PGS", academicdegree: "TS", schoolEmail: "huonglt@soict.hust.edu.vn", homeEmail: null, position: "Phó Trưởng Khoa KHMT", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Bá Vui", academicrank: null, academicdegree: "ThS", schoolEmail: "vui.leba@hust.edu.vn", homeEmail: "vuilb@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Thị Oanh", academicrank: null, academicdegree: "TS", schoolEmail: "oanh.nguyenthi@hust.edu.vn", homeEmail: "oanhnt@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Phạm Ngọc Hưng", academicrank: null, academicdegree: "TS", schoolEmail: "hungpn@soict.hust.edu.vn", homeEmail: null, position: "Giám đốc TT Đổi mới sáng tạo", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Trịnh Anh Phúc", academicrank: null, academicdegree: "TS", schoolEmail: "phuc.trinhanh@hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Vĩnh Đức", academicrank: null, academicdegree: "TS", schoolEmail: "ductv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Bùi Trọng Tùng", academicrank: null, academicdegree: "ThS", schoolEmail: "tungbt@soict.hust.edu.vn", homeEmail: null, position: "Phó giám đốc TT An toàn ANTT", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Phạm Quang Dũng", academicrank: null, academicdegree: "TS", schoolEmail: "dungpq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Nguyên Ngọc", academicrank: null, academicdegree: "TS", schoolEmail: "ngoc.trannguyen@hust.edu.vn", homeEmail: "ngoctn@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Đình Thuận", academicrank: null, academicdegree: "TS", schoolEmail: "thuan.nguyendinh@hust.edu.vn", homeEmail: "thuannd@soict.hust.edu.vn", position: "Phó giám đốc TT NAVIS", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Đặng Tuấn Linh", academicrank: null, academicdegree: "TS", schoolEmail: "linh.dangtuan@hust.edu.vn", homeEmail: "linhdt@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Trần Nhật Hóa", academicrank: null, academicdegree: "TS", schoolEmail: "hoatn@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Đỗ Công Thuần", academicrank: null, academicdegree: "TS", schoolEmail: "thuan.docong@hust.edu.vn", homeEmail: "thuandc@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Thân Quang Khoát", academicrank: "PGS", academicdegree: "TS", schoolEmail: "khoattq@soict.hust.edu.vn", homeEmail: null, position: "Phó Giáo sư", department: "Khoa Khoa học Máy tính" },

  // Page 3 (20)
  { name: "Nguyễn Khánh Phương", academicrank: null, academicdegree: "TS", schoolEmail: "phuongnk@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Nhất Hải", academicrank: null, academicdegree: "TS", schoolEmail: "hainn@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Thanh Hùng", academicrank: null, academicdegree: "TS", schoolEmail: "hungnt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Hải Anh", academicrank: null, academicdegree: "TS", schoolEmail: "anhth@soict.hust.edu.vn", homeEmail: null, position: "Phó Trưởng khoa KTMT", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Lê Huy Cường", academicrank: null, academicdegree: "ThS", schoolEmail: "cuong.lehuy@hust.edu.vn", homeEmail: "cuonglh@soict.hust.edu.vn", position: "Giám đốc TT Mạng thông tin", department: "Trung tâm Mạng thông tin" },
  { name: "Phạm Duy Đạt", academicrank: null, academicdegree: "KS", schoolEmail: "datpd@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên", department: "Văn phòng Trường" },
  { name: "Nguyễn Phi Lê", academicrank: "PGS", academicdegree: "TS", schoolEmail: "lenp@soict.hust.edu.vn", homeEmail: null, position: "Điều hành Viện AI4LIFE", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Thị Thu Trang", academicrank: null, academicdegree: "TS", schoolEmail: "trangntt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Đỗ Tuấn Anh", academicrank: null, academicdegree: "TS", schoolEmail: "anh.dotuan@hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Tuấn Dũng", academicrank: null, academicdegree: "TS", schoolEmail: "dungnt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Hồng Phương", academicrank: null, academicdegree: "ThS", schoolEmail: "phuongnh@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Ban Hà Bằng", academicrank: "PGS", academicdegree: "TS", schoolEmail: "bang.banha@hust.edu.vn", homeEmail: "bangbh@soict.hust.edu.vn", position: "Giảng viên cao cấp", department: "Khoa Khoa học Máy tính" },
  { name: "Đỗ Quốc Huy", academicrank: null, academicdegree: "TS", schoolEmail: "huydq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Bùi Thị Mai Anh", academicrank: null, academicdegree: "TS", schoolEmail: "anhbtm@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Mạnh Tuấn", academicrank: null, academicdegree: "ThS", schoolEmail: "tuan.nguyenmanh@hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trịnh Văn Loan", academicrank: "PGS", academicdegree: "TS", schoolEmail: "loantv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên cao cấp", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Thị Hoàng Lan", academicrank: "PGS", academicdegree: "TS", schoolEmail: "lan.nguyenthihoang@hust.edu.vn", homeEmail: "lannth@soict.hust.edu.vn", position: "Giảng viên cao cấp, Nhà giáo ưu tú", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Đặng Văn Chuyết", academicrank: "PGS", academicdegree: "TS", schoolEmail: "chuyet.dangvan@hust.edu.vn", homeEmail: "chuyetdv@soict.hust.edu.vn", position: "Phó Giáo sư", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Vũ Đức Vượng", academicrank: null, academicdegree: "ThS", schoolEmail: "vuongvd@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Thị Hoa", academicrank: null, academicdegree: "ThS", schoolEmail: "hoa.lethi@hust.edu.vn", homeEmail: "hoalt@soict.hust.edu.vn", position: "Cán bộ kỹ thuật", department: "Trung tâm Máy tính và Thực hành" },

  // Page 4 (20)
  { name: "Nguyễn Kiêm Hiếu", academicrank: null, academicdegree: "TS", schoolEmail: "hieunk@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Bình Minh", academicrank: "PGS", academicdegree: "TS", schoolEmail: "minhnb@soict.hust.edu.vn", homeEmail: null, position: "Giám đốc TT BK Fintech", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Bá Ngọc", academicrank: null, academicdegree: "TS", schoolEmail: "ngocnb@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Duy Hiệp", academicrank: null, academicdegree: "ThS", schoolEmail: "hiepnd@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Tiến Thành", academicrank: null, academicdegree: "ThS", schoolEmail: "nguyenthanh@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trịnh Thành Trung", academicrank: null, academicdegree: "TS", schoolEmail: "trungtt@soict.hust.edu.vn", homeEmail: null, position: "Phó Trưởng Văn phòng, Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Đỗ Bá Lâm", academicrank: null, academicdegree: "TS", schoolEmail: "lam.doba@hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Việt Trung", academicrank: null, academicdegree: "TS", schoolEmail: "trungtv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Đinh Viết Sang", academicrank: null, academicdegree: "TS", schoolEmail: "sangdv@soict.hust.edu.vn", homeEmail: null, position: "Phó Giám đốc TT Nghiên cứu AI", department: "Khoa Khoa học Máy tính" },
  { name: "Trịnh Tuấn Đạt", academicrank: null, academicdegree: "TS", schoolEmail: "dattt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Kim Khánh", academicrank: null, academicdegree: "TS", schoolEmail: "khanh.nguyenkim@hust.edu.vn", homeEmail: "khanhnk@soict.hust.edu.vn", position: "Giảng viên chính", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Trần Đình Khang", academicrank: "PGS", academicdegree: "TS", schoolEmail: "khangtd@soict.hust.edu.vn", homeEmail: null, position: "Phó Giáo sư", department: "Khoa Khoa học Máy tính" },
  { name: "Bùi Quốc Trung", academicrank: null, academicdegree: "TS", schoolEmail: "trungbq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Ngô Văn Linh", academicrank: null, academicdegree: "TS", schoolEmail: "linhnv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Thị Thu Hương", academicrank: null, academicdegree: "TS", schoolEmail: "huongnt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Phạm Huy Hoàng", academicrank: null, academicdegree: "TS", schoolEmail: "hoang.phamhuy@hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Tạ Duy Hoàng", academicrank: null, academicdegree: "TS", schoolEmail: "hoang.taduy@hust.edu.vn", homeEmail: "hoangtd@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Ngô Quỳnh Thu", academicrank: "PGS", academicdegree: "TS", schoolEmail: "thunq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên Cao cấp", department: "Bộ môn Truyền thông và Mạng máy tính" },
  { name: "Nhữ Thị Nga", academicrank: null, academicdegree: "ThS", schoolEmail: "nga.nhuthi@hust.edu.vn", homeEmail: "ngant@soict.hust.edu.vn", position: "Cán bộ kỹ thuật", department: "Trung tâm Máy tính và Thực hành" },
  { name: "Trần Thị Dung", academicrank: null, academicdegree: "ThS", schoolEmail: "dung.tranthi@hust.edu.vn", homeEmail: "dungtt@soict.hust.edu.vn", position: "Cán bộ kỹ thuật", department: "Trung tâm Máy tính và Thực hành" },

  // Page 5 (20)
  { name: "Nguyễn Thị Kim Anh", academicrank: "PGS", academicdegree: "TS", schoolEmail: "anhnk@soict.hust.edu.vn", homeEmail: null, position: "Phó Giáo sư", department: "Khoa Khoa học Máy tính" },
  { name: "Michel Toulouse", academicrank: null, academicdegree: "TS", schoolEmail: "michel.toulouse@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Trương Thị Diệu Linh", academicrank: "PGS", academicdegree: "TS", schoolEmail: "linhtd@soict.hust.edu.vn", homeEmail: null, position: "Điều phối viên Global ICT", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Huỳnh Quyết Thắng", academicrank: "PGS", academicdegree: "TS", schoolEmail: "thang.huynhquyet@hust.edu.vn", homeEmail: "thanghq@soict.hust.edu.vn", position: "Phó Giáo sư", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Hồng Quang", academicrank: null, academicdegree: "TS", schoolEmail: "quang.nguyenhong@hust.edu.vn", homeEmail: "quangnh@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Lê Đức Trung", academicrank: null, academicdegree: "ThS", schoolEmail: "trungld@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên chính", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Đức Hậu", academicrank: "PGS", academicdegree: "TS", schoolEmail: "hauld@soict.hust.edu.vn", homeEmail: null, position: "Trưởng PTN Tin sinh học", department: "Khoa Khoa học Máy tính" },
  { name: "Trần Văn Đặng", academicrank: null, academicdegree: "TS", schoolEmail: "dang.tranvan1@hust.edu.vn", homeEmail: "dangtv@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn Quốc Tuấn", academicrank: null, academicdegree: "TS", schoolEmail: "tuannq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Nguyễn An Hưng", academicrank: null, academicdegree: "TS", schoolEmail: "hung.nguyenan@hust.edu.vn", homeEmail: "hungna@soict.hust.edu.vn", position: "Phó Giám đốc TT Đổi mới Sáng tạo", department: "Trung tâm Đổi mới Sáng tạo" },
  { name: "Đàm Quang Tuấn", academicrank: null, academicdegree: "TS", schoolEmail: "tuandq@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Tống Văn Vạn", academicrank: null, academicdegree: "TS", schoolEmail: "vantv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Văn Hiên", academicrank: null, academicdegree: "ThS", schoolEmail: "hiennv@soict.hust.edu.vn", homeEmail: null, position: "Cán bộ kỹ thuật", department: "Trung tâm Máy tính và Thực hành" },
  { name: "Nguyễn Thị Hiền", academicrank: null, academicdegree: "CVC", schoolEmail: "hiennt@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên Giáo vụ", department: "Văn phòng Trường" },
  { name: "Đinh Thị Thu Hương", academicrank: null, academicdegree: "CN", schoolEmail: "huongdtt@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên", department: "Văn phòng Trường" },
  { name: "Nguyễn Văn Sơn", academicrank: null, academicdegree: "TS", schoolEmail: "sonnv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Lê Thu Giang", academicrank: null, academicdegree: "ThS", schoolEmail: "gianglt@soict.hust.edu.vn", homeEmail: null, position: "Kế toán trưởng", department: "Văn phòng Trường" },
  { name: "Trương Thị Vân Thu", academicrank: null, academicdegree: "ThS", schoolEmail: "thuttv@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên", department: "Văn phòng Trường" },
  { name: "Nguyễn Thanh Nguyệt", academicrank: null, academicdegree: "KSC", schoolEmail: "nguyetnt@soict.hust.edu.vn", homeEmail: null, position: "Trợ lý Giáo vụ", department: "Văn phòng Trường" },
  { name: "Nguyễn Đức Anh", academicrank: null, academicdegree: "TS", schoolEmail: "anh.nguyenduc@hust.edu.vn", homeEmail: "anhnd@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Khoa học Máy tính" },

  // Page 6 (7)
  { name: "Đinh Thị Hà Ly", academicrank: null, academicdegree: "TS", schoolEmail: "lydth@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Đỗ Tiến Dũng", academicrank: null, academicdegree: "TS", schoolEmail: "dungdt@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Đoàn Phong Tùng", academicrank: null, academicdegree: "TS", schoolEmail: "tung.doanphong@hust.edu.vn", homeEmail: "tungdp@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Dương Quang Huy", academicrank: null, academicdegree: "TS", schoolEmail: "huy.duongquang@hust.edu.vn", homeEmail: "huydq2@soict.hust.edu.vn", position: "Giảng viên", department: "Khoa Khoa học Máy tính" },
  { name: "Tưởng Văn Đạt", academicrank: null, academicdegree: "TS", schoolEmail: "dattv@soict.hust.edu.vn", homeEmail: null, position: "Giảng viên", department: "Khoa Kỹ thuật Máy tính" },
  { name: "Nguyễn Thị Hà Phương", academicrank: null, academicdegree: "ThS", schoolEmail: "phuongnth@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên", department: "Văn phòng Trường" },
  { name: "Đàm Mạnh Đạt", academicrank: null, academicdegree: "ThS", schoolEmail: "datdm@soict.hust.edu.vn", homeEmail: null, position: "Chuyên viên", department: "Văn phòng Trường" },
];

// Map department names to organization unit names for upsert
const departmentMapping: Record<string, string> = {
  "Khoa Kỹ thuật Máy tính": "Khoa Kỹ thuật Máy tính",
  "Khoa Khoa học Máy tính": "Khoa Khoa học Máy tính",
  "Bộ môn Hệ thống Thông tin": "Bộ môn Hệ thống Thông tin",
  "Bộ môn Truyền thông và Mạng máy tính": "Bộ môn Truyền thông và Mạng máy tính",
  "Trung tâm Máy tính và Thực hành": "Trung tâm Máy tính và Thực hành",
  "Trung tâm Mạng thông tin": "Trung tâm Mạng thông tin",
  "Trung tâm Đổi mới Sáng tạo": "Trung tâm Đổi mới Sáng tạo",
  "Văn phòng Trường": "Văn phòng Trường",
};

async function importStaff() {
  console.log(`Importing ${soictStaff.length} staff from SOICT HUST...\n`);

  // 1. Create/update organization units
  const uniqueDepts = [...new Set(soictStaff.map(s => departmentMapping[s.department] || s.department))];
  console.log(`Creating ${uniqueDepts.length} organization units...`);

  const orgUnitMap = new Map<string, number>();
  for (const name of uniqueDepts) {
    const unit = await prisma.organizationUnit.upsert({
      where: { id: orgUnitMap.get(name) || 0 },
      update: { name },
      create: { name },
    });
    orgUnitMap.set(name, unit.id);
  }

  // Re-fetch all org units to build map correctly
  const allUnits = await prisma.organizationUnit.findMany();
  for (const u of allUnits) {
    orgUnitMap.set(u.name, u.id);
  }
  console.log(`  ✓ ${orgUnitMap.size} organization units ready\n`);

  // 2. Create/update staff — use schoolEmail as unique identifier
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const s of soictStaff) {
    const orgUnitId = orgUnitMap.get(departmentMapping[s.department] || s.department) || null;

    // Generate a staffcode from the school email prefix
    const emailPrefix = (s.schoolEmail || s.homeEmail || '').split('@')[0];
    const staffcode = emailPrefix.toUpperCase();

    // Check if staff with this email already exists
    const existing = await prisma.staff.findFirst({
      where: {
        OR: [
          { schoolEmail: s.schoolEmail },
          ...(s.homeEmail ? [{ homeEmail: s.homeEmail }] : []),
        ],
      },
    });

    const data = {
      name: s.name,
      schoolEmail: s.schoolEmail,
      homeEmail: s.homeEmail,
      staffcode,
      academicrank: s.academicrank,
      academicdegree: s.academicdegree,
      position: s.position,
      organizationunitid: orgUnitId,
    };

    if (existing) {
      await prisma.staff.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      try {
        await prisma.staff.create({ data });
        created++;
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`  ⚠ Skipped duplicate: ${s.name} (${staffcode})`);
          skipped++;
        } else {
          throw error;
        }
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Import completed!`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total:   ${soictStaff.length}`);
  console.log(`========================================\n`);

  await prisma.$disconnect();
}

importStaff().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
