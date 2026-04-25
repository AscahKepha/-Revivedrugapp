import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import PatientLayout from "../layouts/patientLayout";

// Pages
import PatientProfile from "../components/patientdashboard/patientprofile";
import CheckinPage from "../components/patientdashboard/checkinpage";
import ScorePage from "../components/patientdashboard/scorepage";
import SupportCircle from "../components/patientdashboard/supportcircle";

// ✅ FIXED: Guard wrapper (NO children, uses Outlet inside ProtectedRoute)
const PatientGuard = () => {
  return <ProtectedRoute allowedRole="patient" />;
};

export const patientRoutes = {
  path: "/patient",
  element: <PatientGuard />,
  children: [
    {
      element: <PatientLayout />,
      children: [
        // Default landing
        { index: true, element: <CheckinPage /> },

        // Core Recovery Features
        { path: "dashboard", element: <CheckinPage /> },
        { path: "check-in", element: <CheckinPage /> },
        { path: "support-circle", element: <SupportCircle /> },
        { path: "scores", element: <ScorePage /> },

        // Profile
        { path: "profile", element: <PatientProfile /> },

        // Fallback
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};