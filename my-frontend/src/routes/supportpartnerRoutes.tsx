import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import SupportPartnerLayout from "../layouts/SupportpartnerLayout";

// Pages
import SupportPartnerProfile from "../components/support-Partnerdashboard/supportpartnerprofile";
import ActionCenter from "../components/support-Partnerdashboard/Actioncenter";
import PatientHistory from "../components/support-Partnerdashboard/patienthistory";
import SupportPartnerDashboard from "../components/support-Partnerdashboard/supportpartnerdashboard";

// ✅ FIXED: Guard wrapper (no children, Outlet handled inside ProtectedRoute)
const SupportPartnerGuard = () => {
  return <ProtectedRoute allowedRole="support_partner" />;
};

export const supportPartnerRoutes = {
  path: "/partner",
  element: <SupportPartnerGuard />,
  children: [
    {
      element: <SupportPartnerLayout />,
      children: [
        // Default landing
        { index: true, element: <SupportPartnerDashboard /> },

        // Core Features
        { path: "dashboard", element: <SupportPartnerDashboard /> },
        { path: "action-center", element: <ActionCenter /> },
        { path: "patient-history", element: <PatientHistory /> },

        // Profile
        { path: "profile", element: <SupportPartnerProfile /> },

        // Fallback
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};