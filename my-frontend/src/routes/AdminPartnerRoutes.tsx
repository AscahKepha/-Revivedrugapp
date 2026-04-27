import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import UnifiedDashboardLayout from "../layouts/AdminPartnerLayout";

// Shared Components
import AdminProfile from "../components/profile/profile";
import AllPatients from "../components/shared/Allpatients";
import ActionLogs from "../components/shared/ActionLogs";
import CheckinHistory from "../components/shared/CheckinHistory";
import PatientDetailView from "../components/shared/PatientDetailView";

// Admin Specific Pages
import ManagementHub from "../components/Admin/ManagementHub";
import AllSupportPartners from "../components/Admin/AllSupportpartners";
import SupportNetwork from "../components/Admin/SupportNetwork";

// Partner Specific Pages
import SupportPartnerProfile from "../components/profile/profile";
import ActionCenter from "../components/shared/Actioncenter";
import SupportPartnerDashboard from "../components/support-Partner/supportpartnerdashboard";

/**
 * 🛡️ Role Guards
 */
const AdminGuard = () => <ProtectedRoute allowedRole="admin" />;
const PartnerGuard = () => <ProtectedRoute allowedRole="support_partner" />;

/**
 * 👑 ADMIN ROUTES
 * Blue Theme - Global Oversight
 */
export const adminRoutes = {
  path: "/admin",
  element: <AdminGuard />,
  children: [
    {
      element: <UnifiedDashboardLayout />,
      children: [
        { index: true, element: <ManagementHub /> },
        { path: "hub", element: <ManagementHub /> },
        { path: "logs", element: <ActionLogs /> },
        { path: "profile", element: <AdminProfile /> },
        { path: "patients", element: <AllPatients /> },
        { path: "patients/:id", element: <PatientDetailView /> },
        { path: "partners", element: <AllSupportPartners /> },
        { path: "network", element: <SupportNetwork /> },
        { path: "checkin-history", element: <CheckinHistory /> },
        { path: "*", element: <Navigate to="hub" replace /> },
        { path: "charts", element: <div className="p-10 font-bold">Analytics Page Coming Soon</div> },
  // { path: "audit-logs", element: <ActionLogs /> }, // Mapping 'audit-logs' to ActionLogs
  // { path: "history", element: <CheckinHistory /> }, // Mapping 'history' to CheckinHistory
  // { path: "security", element: <div className="p-10 font-bold">Security Center Coming Soon</div> },
  // { path: "settings", element: <div className="p-10 font-bold">Global Settings Coming Soon</div> },
      ]
    }
  ]
};

/**
 * 🤝 SUPPORT PARTNER ROUTES
 * Emerald Theme - Focused Patient Care
 */
export const supportPartnerRoutes = {
  path: "/partner",
  element: <PartnerGuard />,
  children: [
    {
      element: <UnifiedDashboardLayout />,
      children: [
        { index: true, element: <SupportPartnerDashboard /> },
        { path: "dashboard", element: <SupportPartnerDashboard /> },

        // 🔄 Directory and Detailed View
        { path: "my-patients", element: <AllPatients /> },
        { path: "patients/:id", element: <PatientDetailView /> }, // 🆕 Dynamic route for details

        { path: "action-center", element: <ActionCenter /> },

        // Logs for partner's assigned patients
        { path: "patient-history", element: <CheckinHistory /> },

        { path: "profile", element: <SupportPartnerProfile /> },
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};