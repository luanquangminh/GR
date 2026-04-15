import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useMyProgress, usePendingEvaluations } from '@/hooks/useNotifications';

export function NotificationBell() {
  const { isAdmin, isModerator, staffId } = useAuth();
  const { data: progressData } = useMyProgress();
  const { data: pendingData } = usePendingEvaluations();

  const incompleteGroups = progressData?.groups?.filter((g) => !g.isComplete) ?? [];
  const pendingCount = incompleteGroups.length;
  const adminPendingCount = pendingData?.pending?.length ?? 0;

  const totalBadge = (isAdmin || isModerator) ? pendingCount + adminPendingCount : pendingCount;

  // Don't render if user has no staff link and is not admin
  if (!staffId && !isAdmin && !isModerator) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={totalBadge > 0 ? `Thông báo (${totalBadge > 99 ? '99+' : totalBadge} chưa đọc)` : 'Thông báo'}>
          <Bell className="h-5 w-5" aria-hidden="true" />
          {totalBadge > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
            >
              {totalBadge > 99 ? '99+' : totalBadge}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Thông báo đánh giá</h4>

          {/* User's own progress */}
          {staffId && progressData?.periodId && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Kỳ đánh giá: {progressData.periodName}
              </p>
              {incompleteGroups.length > 0 ? (
                <>
                  <p className="text-sm">
                    Bạn còn <span className="font-bold text-destructive">{incompleteGroups.length}</span> nhóm chưa hoàn thành đánh giá:
                  </p>
                  <ul className="space-y-1">
                    {incompleteGroups.map((g) => (
                      <li key={g.groupId} className="text-sm bg-muted rounded px-2 py-1">
                        <span className="font-medium">{g.groupName}</span>
                        <span className="text-muted-foreground ml-1">
                          ({g.evaluatedColleagues}/{g.totalColleagues})
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-green-600">
                  Bạn đã hoàn thành đánh giá tất cả các nhóm!
                </p>
              )}
            </div>
          )}

          {!staffId && !(isAdmin || isModerator) && (
            <p className="text-sm text-muted-foreground">
              Tài khoản chưa liên kết với nhân sự.
            </p>
          )}

          {/* Admin/moderator section */}
          {(isAdmin || isModerator) && pendingData?.periodId && (
            <div className="space-y-2 border-t pt-2">
              <p className="text-xs text-muted-foreground font-medium">Quản trị</p>
              {adminPendingCount > 0 ? (
                <>
                  <p className="text-sm">
                    <span className="font-bold text-destructive">{adminPendingCount}</span> nhân sự chưa hoàn thành đánh giá:
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {pendingData.pending.slice(0, 20).map((p) => (
                      <div key={`${p.staffId}-${p.groupId}`} className="text-sm bg-muted rounded px-2 py-1">
                        <span className="font-medium">{p.staffName}</span>
                        <span className="text-muted-foreground ml-1">
                          - {p.groupName} ({p.evaluatedColleagues}/{p.totalColleagues})
                        </span>
                      </div>
                    ))}
                    {pendingData.pending.length > 20 && (
                      <p className="text-xs text-muted-foreground">
                        ...và {pendingData.pending.length - 20} nhân sự khác
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-green-600">
                  Tất cả nhân sự đã hoàn thành đánh giá!
                </p>
              )}
            </div>
          )}

          {/* No active period */}
          {!progressData?.periodId && !pendingData?.periodId && (
            <p className="text-sm text-muted-foreground">
              Không có kỳ đánh giá nào đang hoạt động.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
