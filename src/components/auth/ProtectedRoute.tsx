import { Navigate } from "react-router-dom";
import { useMe } from "@/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute component - guards routes that require authentication
 * Optionally can require admin role
 *
 * @example
 * ```tsx
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 *
 * <Route path="/admin" element={
 *   <ProtectedRoute requireAdmin>
 *     <AdminPanel />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useMe();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or if there's an error (401/403)
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin) {
    const isAdmin = user.roles?.includes("admin") ?? false;
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

