// Teacher avatar lookup utility
// Maps teacher names to their avatar image paths in /teacher-avatars/

// Raw data from crawled SOICT teachers
const teacherAvatars: Record<string, string> = {};

// Academic title prefixes to strip when matching
const TITLE_PREFIXES = [
    'GS.TS.', 'PGS.TS.', 'PSG.TS.', 'PGS. TS.', 'TS.', 'ThS.', 'KS.', 'KSC.', 'CN.', 'CVC.',
];

/**
 * Remove Vietnamese diacritical marks for fuzzy matching
 */
function removeDiacritics(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/**
 * Strip academic title prefix from a full name
 * e.g., "PGS.TS. Nguyễn Văn An" -> "Nguyễn Văn An"
 */
function stripTitle(fullName: string): string {
    let name = fullName.trim();
    for (const prefix of TITLE_PREFIXES) {
        if (name.startsWith(prefix)) {
            name = name.substring(prefix.length).trim();
            break;
        }
    }
    return name;
}

/**
 * Normalize a name for comparison: strip title, lowercase, remove diacritics, collapse spaces
 */
function normalizeName(name: string): string {
    return removeDiacritics(stripTitle(name)).toLowerCase().replace(/\s+/g, ' ').trim();
}

// Build the lookup from file names
// File names follow the pattern: Title._Name_Parts.ext (e.g., "TS._Nguyen_Van_An.jpg")
const avatarFiles: string[] = [
    "CN._Dinh_Thi_Thu_Huong.jpg",
    "CVC._Nguyen_Thi_Hien.jpg",
    "GS.TS._Huynh_Thi_Thanh_Binh.jpg",
    "KS._Pham_Duy_Dat.jpg",
    "KSC._Nguyen_Thanh_Nguyet.jpg",
    "PGS.TS._Ban_Ha_Bang.jpg",
    "PGS.TS._Cao_Tuan_Dung.jpg",
    "PGS.TS._Dang_Van_Chuyet.jpg",
    "PGS.TS._La_The_Vinh.jpg",
    "PGS.TS._Le_Duc_Hau.jpg",
    "PGS.TS._Le_Thanh_Huong.jpg",
    "PGS.TS._Ngo_Quynh_Thu.jpg",
    "PGS.TS._Nguyen_Khanh_Van.jpg",
    "PGS.TS._Nguyen_Linh_Giang.jpg",
    "PGS.TS._Nguyen_Phi_Le.jpeg",
    "PGS.TS._Nguyen_Thi_Hoang_Lan.jpg",
    "PGS.TS._Nguyen_Thi_Kim_Anh.jpg",
    "PGS.TS._Pham_Van_Hai.jpg",
    "PGS.TS._Ta_Hai_Tung.jpg",
    "PGS.TS._Tran_Dinh_Khang.jpg",
    "PGS.TS._Tran_Quang_Duc.jpg",
    "PGS.TS._Trinh_Van_Loan.jpg",
    "PGS.TS._Truong_Thi_Dieu_Linh.jpg",
    "PGS._TS._Than_Quang_Khoat.jpg",
    "PSG.TS._Huynh_Quyet_Thang.jpg",
    "TS._Bui_Quoc_Trung.jpg",
    "TS._Bui_Thi_Mai_Anh.jpg",
    "TS._Dam_Quang_Tuan.jpg",
    "TS._Dang_Tuan_Linh.jpg",
    "TS._Dinh_Thi_Ha_Ly.jpg",
    "TS._Dinh_Viet_Sang.jpg",
    "TS._Do_Ba_Lam.jpg",
    "TS._Do_Cong_Thuan.jpg",
    "TS._Do_Quoc_Huy.jpg",
    "TS._Do_Tien_Dung.jpg",
    "TS._Do_Tuan_Anh.jpg",
    "TS._Doan_Phong_Tung.jpg",
    "TS._Duong_Quang_Huy.png",
    "TS._Hoang_Van_Hiep.jpg",
    "TS._Le_Xuan_Thanh.jpg",
    "TS._Michel_Toulouse.jpg",
    "TS._Ngo_Lam_Trung.jpg",
    "TS._Ngo_Thanh_Trung.jpg",
    "TS._Ngo_Van_Linh.jpg",
    "TS._Nguyen_An_Hung.jpg",
    "TS._Nguyen_Ba_Ngoc.jpg",
    "TS._Nguyen_Binh_Minh.jpg",
    "TS._Nguyen_Dinh_Thuan.jpg",
    "TS._Nguyen_Duc_Anh.jpg",
    "TS._Nguyen_Duc_Toan.jpg",
    "TS._Nguyen_Hong_Quang.jpg",
    "TS._Nguyen_Huu_Duc.jpg",
    "TS._Nguyen_Khanh_Phuong.jpg",
    "TS._Nguyen_Kiem_Hieu.jpg",
    "TS._Nguyen_Kim_Khanh.jpg",
    "TS._Nguyen_Nhat_Hai.jpg",
    "TS._Nguyen_Quoc_Tuan.jpg",
    "TS._Nguyen_Thanh_Hung.jpg",
    "TS._Nguyen_Thi_Oanh.jpg",
    "TS._Nguyen_Thi_Thanh_Nga.jpg",
    "TS._Nguyen_Thi_Thu_Huong.jpg",
    "TS._Nguyen_Thi_Thu_Trang.jpg",
    "TS._Nguyen_Tuan_Dung.jpg",
    "TS._Nguyen_Van_Son.jpg",
    "TS._Pham_Dang_Hai.jpg",
    "TS._Pham_Huy_Hoang.jpg",
    "TS._Pham_Ngoc_Hung.jpg",
    "TS._Pham_Quang_Dung.jpg",
    "TS._Ta_Duy_Hoang.jpg",
    "TS._Tong_Van_Van.jpg",
    "TS._Tran_Hai_Anh.jpg",
    "TS._Tran_Hoang_Hai.jpg",
    "TS._Tran_Nguyen_Ngoc.jpg",
    "TS._Tran_Nhat_Hoa.jpg",
    "TS._Tran_Van_Dang.jpg",
    "TS._Tran_Viet_Trung.jpg",
    "TS._Tran_Vinh_Duc.jpg",
    "TS._Trinh_Anh_Phuc.jpg",
    "TS._Trinh_Thanh_Trung.jpg",
    "TS._Trinh_Tuan_Dat.jpg",
    "TS._Trinh_Van_Chien.jpg",
    "TS._Tuong_Van_Dat.jpg",
    "TS._Vu_Thi_Huong_Giang.jpg",
    "TS._Vu_Tuyet_Trinh.jpg",
    "TS._Vu_Van_Thieu.jpg",
    "ThS._Banh_Thi_Quynh_Mai.jpg",
    "ThS._Bui_Trong_Tung.jpg",
    "ThS._Dam_Manh_Dat.jpg",
    "ThS._Le_Ba_Vui.jpg",
    "ThS._Le_Duc_Trung.jpg",
    "ThS._Le_Huy_Cuong.jpg",
    "ThS._Le_Tan_Hung.jpg",
    "ThS._Le_Thi_Hoa.jpg",
    "ThS._Le_Thu_Giang.jpg",
    "ThS._Nguyen_Duc_Tien.jpg",
    "ThS._Nguyen_Duy_Hiep.jpg",
    "ThS._Nguyen_Hong_Phuong.jpg",
    "ThS._Nguyen_Manh_Tuan.jpg",
    "ThS._Nguyen_Thi_Ha_Phuong.jpg",
    "ThS._Nguyen_Tien_Thanh.jpg",
    "ThS._Nguyen_Van_Hien.jpg",
    "ThS._Nhu_Thi_Nga.jpg",
    "ThS._Pham_Thanh_Liem.png",
    "ThS._Pham_Thi_Phuong_Giang.jpg",
    "ThS._Tran_Thi_Dung.jpg",
    "ThS._Truong_Thi_Van_Thu.jpg",
    "ThS._Vu_Duc_Vuong.jpg",
];

// Build the normalized name -> file path map
const normalizedNameMap = new Map<string, string>();

for (const file of avatarFiles) {
    // Extract name from filename: "TS._Nguyen_Van_An.jpg" -> "Nguyen Van An"
    const nameWithoutExt = file.replace(/\.(jpg|jpeg|png)$/i, '');
    // Remove title prefix (everything before and including the first "._")
    const parts = nameWithoutExt.split('._');
    const namePart = parts.length > 1 ? parts.slice(1).join('._') : parts[0];
    const nameWithSpaces = namePart.replace(/_/g, ' ');
    const normalized = nameWithSpaces.toLowerCase().trim();
    normalizedNameMap.set(normalized, `/teacher-avatars/${file}`);
}

/**
 * Get avatar URL for a teacher by their name.
 * The name can include or exclude academic titles.
 * Returns the image path or null if not found.
 */
export function getTeacherAvatar(name: string | null | undefined): string | null {
    if (!name) return null;

    const normalized = normalizeName(name);

    // Direct match
    const direct = normalizedNameMap.get(normalized);
    if (direct) return direct;

    // Try matching by last name parts (partial match)
    for (const [key, path] of normalizedNameMap.entries()) {
        if (key === normalized || normalized.endsWith(key) || key.endsWith(normalized)) {
            return path;
        }
    }

    return null;
}
