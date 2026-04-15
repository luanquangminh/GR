import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAdminOnly?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, requireAdminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isModerator } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Allows admin + moderator
  if (requireAdmin && !isAdmin && !isModerator) {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin only (not moderator)
  if (requireAdminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
