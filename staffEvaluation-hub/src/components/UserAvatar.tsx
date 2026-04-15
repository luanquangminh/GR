import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarUrl } from '@/lib/avatarUtils';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  staff: { avatar?: string | null; name?: string | null } | null | undefined;
  fallbackText?: string;
  className?: string;
  alt?: string;
}

export function UserAvatar({ staff, fallbackText, className, alt }: UserAvatarProps) {
  const url = getAvatarUrl(staff);
  const initial =
    fallbackText?.charAt(0)?.toUpperCase() ||
    staff?.name?.charAt(0)?.toUpperCase() ||
    'U';

  return (
    <Avatar className={cn('h-10 w-10', className)}>
      {url && <AvatarImage src={url} alt={alt ?? staff?.name ?? ''} className="object-cover" />}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
