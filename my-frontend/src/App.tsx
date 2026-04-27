import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Route Modules
import { patientRoutes } from './routes/patientRoutes';
// Consolidated imports from your shared Admin/Partner route file
import { supportPartnerRoutes, adminRoutes } from './routes/AdminPartnerRoutes';

// Public Pages
import { Services } from './pages/OurMission';
import { Locations } from './pages/Location';
import Testimonials from './pages/Testimonials';
import Support from './pages/Support';
import Login from './pages/Login';
import Signin from './pages/Signin';
import { Home } from './pages/Home';

const router = createBrowserRouter([
  // 1. Public Routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/location",
    element: <Locations />,
  },
  {
    path: "/contact",
    element: <Support />,
  },
  {
    path: "/testimonials",
    element: <Testimonials />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },

  // 2. Specialized Dashboard Routes
  adminRoutes,
  patientRoutes,
  supportPartnerRoutes,

  // 3. Global Fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return (
    <div className="antialiased">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;