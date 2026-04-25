import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import AdminProfile from "../components/Admindashboard/adminprofile";
import ManagementHub from "../components/Admindashboard/ManagementHub";
import AllPatients from "../components/Admindashboard/Allpatients";
import AllSupportPartners from "../components/Admindashboard/AllSupportpartners";
import ActionLogs from "../components/Admindashboard/ActionLogs";
import CheckinHistory from "../components/Admindashboard/CheckinHistory";
import SupportNetwork from "../components/Admindashboard/SupportNetwork";

// ✅ FIXED: AdminGuard (no children, Outlet handled inside ProtectedRoute)
const AdminGuard = () => {
  return <ProtectedRoute allowedRole="admin" />;
};

export const adminRoutes = {
  path: "/admindashboard",
  element: <AdminGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        // Default dashboard landing
        { index: true, element: <ManagementHub /> },

        // Core Management
        { path: "management", element: <ManagementHub /> },
        { path: "logs", element: <ActionLogs /> },
        { path: "profile", element: <AdminProfile /> },

        // User Management
        { path: "patients", element: <AllPatients /> },
        { path: "partners", element: <AllSupportPartners /> },
        { path: "network", element: <SupportNetwork /> },

        // Data & History
        { path: "checkin-history", element: <CheckinHistory /> },

        // Fallback
        { path: "*", element: <Navigate to="." replace /> }
      ]
    }
  ]
};