// routes/patientRoutes.tsx
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedRoutes";
import PatientLayout from "../layouts/patientLayout";

// Pages
import CheckinPage from "../components/patientdashboard/checkinpage";
import PatientDashboard from "../components/patientdashboard/PatientDashboard";
import ScorePage from "../components/patientdashboard/scorepage";
import SupportCircle from "../components/patientdashboard/supportcircle";

// Import the profile page we just finished updating
import UserProfilePage from "../components/profile/profile"; 

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
        // Default landing is the visual dashboard
        { index: true, element: <PatientDashboard /> },

        // Core Recovery Features
        { path: "dashboard", element: <PatientDashboard /> },
        { path: "check-in", element: <CheckinPage /> },
        { path: "support-circle", element: <SupportCircle /> },
        { path: "scores", element: <ScorePage /> },

        /**
         * Profile Route
         * Matches the UserProfilePage.tsx we updated with Cloudinary,
         * Streaks, and the Edit/Password modals.
         */
        { path: "profile", element: <UserProfilePage /> },

        // Fallback
        { path: "*", element: <Navigate to="dashboard" replace /> }
      ]
    }
  ]
};