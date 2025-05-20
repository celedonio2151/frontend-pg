import { useAuthContext } from 'context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  roles?: string[]; // Roles requeridos
}

const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { userProfile, token } = useAuthContext();

  const isAuthenticated = !!token;

  if (!isAuthenticated) return <Navigate to="/auth/signin" replace />;

  if (roles && roles.length > 0) {
    const hasRole = userProfile?.roles?.some(
      (role: any) => roles.includes(role.name || role), // Depende de cómo guardes los roles
    );
    if (!hasRole) return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
