import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../src/app/types";
import { type UserRole } from "../src/features/auth/authSlice";

type ProtectedRouteProps = {
    allowedRole?: UserRole;
};

function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
    const { isAuthenticated, userType } = useSelector(
        (state: RootState) => state.auth
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && userType !== allowedRole) {
        return <Navigate to={`/${userType}/dashboard`} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;