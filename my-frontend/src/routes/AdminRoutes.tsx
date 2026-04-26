import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import AdminLayout from "../layouts/AdminLayout";

// Pages
/** * We use the same central profile component. 
 * The logic inside will automatically adapt to the "admin" role.
 */
import AdminProfile from "../components/profile/profile"; 
import ManagementHub from "../components/Admindashboard/ManagementHub";
import AllPatients from "../components/Admindashboard/Allpatients";
import AllSupportPartners from "../components/Admindashboard/AllSupportpartners";
import ActionLogs from "../components/Admindashboard/ActionLogs";
import CheckinHistory from "../components/Admindashboard/CheckinHistory";
import SupportNetwork from "../components/Admindashboard/SupportNetwork";

// ✅ AdminGuard handles the role-based protection
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
        
        /**
         * Admin Profile Route
         * Points to the refined UserProfilePage (imported as AdminProfile)
         */
        { path: "profile", element: <AdminProfile /> },

        // User Management
        { path: "patients", element: <AllPatients /> },
        { path: "partners", element: <AllSupportPartners /> },
        { path: "network", element: <SupportNetwork /> },

        // Data & History
        { path: "checkin-history", element: <CheckinHistory /> },

        // Fallback: Redirects back to the main management hub if route not found
        { path: "*", element: <Navigate to="." replace /> }
      ]
    }
  ]
};