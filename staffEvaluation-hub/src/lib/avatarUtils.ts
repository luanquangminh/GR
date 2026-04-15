import { getTeacherAvatar } from './teacherAvatars';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getAvatarUrl(staff: { avatar?: string | null; name?: string | null } | null | undefined): string | null {
  if (!staff) return null;
  if (staff.avatar) return `${API_URL}${staff.avatar}`;
  return getTeacherAvatar(staff.name);
}
