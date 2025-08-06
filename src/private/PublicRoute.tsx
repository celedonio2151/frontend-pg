import { Navigate } from "react-router-dom";
import { useAuthContext } from "context/AuthContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuthContext();
    return token ? <Navigate to="/" replace /> : <>{children}</>;
}