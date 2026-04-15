// Keep in sync with staffEvaluation-api/src/staff/staff.controller.ts (ALLOWED_MIME_TYPES / MAX_FILE_SIZE)
export const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
export const AVATAR_ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const AVATAR_ACCEPT_ATTR = AVATAR_ALLOWED_MIME.join(',');

export function formatMaxSize(bytes: number = AVATAR_MAX_SIZE_BYTES): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
}

export function validateAvatarFile(file: File): string | null {
  if (!(AVATAR_ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return 'Chỉ chấp nhận file ảnh (JPG, PNG, WebP)';
  }
  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return `File ảnh không được vượt quá ${formatMaxSize()}`;
  }
  return null;
}
