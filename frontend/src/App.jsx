import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container my-4 flex-fill">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Citizen Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="citizen" allowAdmins={true}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {}
          {}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="citizen" allowAdmins={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Not Found */}
          <Route
            path="*"
            element={
              <div>
                Not Found. <Link to="/">Go Home</Link>
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
