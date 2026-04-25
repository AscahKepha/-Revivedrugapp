// routes/patientRoutes.tsx
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import PatientLayout from "../layouts/patientLayout";

// Pages
// import PatientProfile from "../components/patientdashboard/patientprofile";
import CheckinPage from "../components/patientdashboard/checkinpage";
import PatientDashboard from "../components/patientdashboard/PatientDashboard"; // New Component
import ScorePage from "../components/patientdashboard/scorepage";
import SupportCircle from "../components/patientdashboard/supportcircle";

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
        // Default landing is now the visual dashboard
        { index: true, element: <PatientDashboard /> },

        // Core Recovery Features
        { path: "dashboard", element: <PatientDashboard /> },
        { path: "check-in", element: <CheckinPage /> },
        { path: "support-circle", element: <SupportCircle /> },
        { path: "scores", element: <ScorePage /> },

        // Profile
        // { path: "profile", element: <PatientProfile /> },

        // Fallback
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};