import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import SupportPartnerLayout from "../layouts/SupportpartnerLayout";

// Pages
/** * Importing the unified profile component.
 * We alias it as SupportPartnerProfile to maintain consistency with your naming convention.
 */
import SupportPartnerProfile from "../components/profile/profile";
import ActionCenter from "../components/support-Partnerdashboard/Actioncenter";
import PatientHistory from "../components/support-Partnerdashboard/patienthistory";
import SupportPartnerDashboard from "../components/support-Partnerdashboard/supportpartnerdashboard";

// ✅ SupportPartnerGuard ensures only partners can access these routes
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
        // Default landing: The Support Partner's main dashboard
        { index: true, element: <SupportPartnerDashboard /> },

        // Core Features
        { path: "dashboard", element: <SupportPartnerDashboard /> },
        { path: "action-center", element: <ActionCenter /> },
        { path: "patient-history", element: <PatientHistory /> },

        /**
         * Support Partner Profile
         * Now uses the central profile component which handles:
         * - Cloudinary image uploads
         * - Password updates via UserApi
         * - Identity verification badges
         */
        { path: "profile", element: <SupportPartnerProfile /> },

        // Fallback: Redirect to dashboard if route is unrecognized
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};