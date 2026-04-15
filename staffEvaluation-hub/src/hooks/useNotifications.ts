import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from './useAuth';

export interface GroupProgress {
  groupId: number;
  groupName: string;
  totalColleagues: number;
  evaluatedColleagues: number;
  isComplete: boolean;
}

export interface MyProgressResponse {
  periodId: number | null;
  periodName: string | null;
  groups: GroupProgress[];
}

export interface PendingStaff {
  staffId: number;
  staffName: string;
  groupId: number;
  groupName: string;
  totalColleagues: number;
  evaluatedColleagues: number;
}

export interface PendingEvaluationsResponse {
  periodId: number | null;
  periodName: string | null;
  pending: PendingStaff[];
}

export function useMyProgress() {
  const { staffId } = useAuth();
  return useQuery({
    queryKey: queryKeys.myProgress,
    queryFn: () => api.get<MyProgressResponse>('/evaluations/my-progress'),
    enabled: !!staffId,
    refetchInterval: 5 * 60 * 1000, // refresh every 5 minutes
  });
}

export function usePendingEvaluations() {
  const { isAdmin, isModerator } = useAuth();
  return useQuery({
    queryKey: queryKeys.pendingEvaluations,
    queryFn: () => api.get<PendingEvaluationsResponse>('/evaluations/pending'),
    enabled: isAdmin || isModerator,
    refetchInterval: 5 * 60 * 1000,
  });
}
