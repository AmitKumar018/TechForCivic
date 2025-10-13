import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="container">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TechforCivic
        </Typography>

        {/* ✅ Home (always visible) */}
        <Link className="btn btn-light me-2" to="/">
          Home
        </Link>

        {/* Citizen Dashboard visible if logged in */}
        {user && (
          <Link className="btn btn-light me-2" to="/dashboard">
            Citizen
          </Link>
        )}

        {/* Analytics visible for both citizen & admin */}
        {user && (
          <Link className="btn btn-info me-2" to="/analytics">
            Analytics
          </Link>
        )}

        {/* Admin Dashboard only if admin */}
        {user?.role === "admin" && (
          <Link className="btn btn-warning me-2" to="/admin">
            Admin
          </Link>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <>
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-success" to="/signup">
              Signup
            </Link>
          </>
        ) : (
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
