import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationBell } from './NotificationBell';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));
vi.mock('@/hooks/useNotifications', () => ({
  useMyProgress: vi.fn(),
  usePendingEvaluations: vi.fn(),
}));

import { useAuth } from '@/hooks/useAuth';
import { useMyProgress, usePendingEvaluations } from '@/hooks/useNotifications';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUseMyProgress = vi.mocked(useMyProgress);
const mockedUsePendingEvaluations = vi.mocked(usePendingEvaluations);

function renderBell() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <NotificationBell />
    </QueryClientProvider>,
  );
}

describe('NotificationBell badge math', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing when user has no staff link and no admin role', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: false, isModerator: false, staffId: null } as any);
    mockedUseMyProgress.mockReturnValue({ data: undefined } as any);
    mockedUsePendingEvaluations.mockReturnValue({ data: undefined } as any);

    const { container } = renderBell();
    expect(container.firstChild).toBeNull();
  });

  it('shows count of incomplete groups for a regular user', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: false, isModerator: false, staffId: 1 } as any);
    mockedUseMyProgress.mockReturnValue({
      data: {
        periodId: 10,
        periodName: '2026',
        groups: [
          { groupId: 1, groupName: 'A', isComplete: false, evaluatedColleagues: 1, totalColleagues: 3 },
          { groupId: 2, groupName: 'B', isComplete: true, evaluatedColleagues: 3, totalColleagues: 3 },
          { groupId: 3, groupName: 'C', isComplete: false, evaluatedColleagues: 0, totalColleagues: 2 },
        ],
      },
    } as any);
    mockedUsePendingEvaluations.mockReturnValue({ data: undefined } as any);

    renderBell();
    expect(screen.getByLabelText(/Thông báo \(2 chưa đọc\)/)).toBeTruthy();
  });

  it('sums own + admin pending counts for admins', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: true, isModerator: false, staffId: 1 } as any);
    mockedUseMyProgress.mockReturnValue({
      data: {
        periodId: 10,
        periodName: '2026',
        groups: [
          { groupId: 1, groupName: 'A', isComplete: false, evaluatedColleagues: 0, totalColleagues: 2 },
        ],
      },
    } as any);
    mockedUsePendingEvaluations.mockReturnValue({
      data: {
        periodId: 10,
        pending: [
          { staffId: 2, groupId: 1, staffName: 'X', groupName: 'A', evaluatedColleagues: 0, totalColleagues: 2 },
          { staffId: 3, groupId: 1, staffName: 'Y', groupName: 'A', evaluatedColleagues: 1, totalColleagues: 2 },
        ],
      },
    } as any);

    renderBell();
    expect(screen.getByLabelText(/Thông báo \(3 chưa đọc\)/)).toBeTruthy();
  });

  it('caps display at 99+', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: false, isModerator: false, staffId: 1 } as any);
    const manyGroups = Array.from({ length: 150 }, (_, i) => ({
      groupId: i,
      groupName: `G${i}`,
      isComplete: false,
      evaluatedColleagues: 0,
      totalColleagues: 1,
    }));
    mockedUseMyProgress.mockReturnValue({
      data: { periodId: 1, periodName: 'x', groups: manyGroups },
    } as any);
    mockedUsePendingEvaluations.mockReturnValue({ data: undefined } as any);

    renderBell();
    expect(screen.getByText('99+')).toBeTruthy();
  });
});
