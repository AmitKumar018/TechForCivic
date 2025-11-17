import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsightsIcon from "@mui/icons-material/Insights";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mr: 3, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            TechForCivic
          </Typography>
        </Box>

        {/* Desktop Nav Buttons */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            <HomeIcon sx={{ mr: 1 }} /> Home
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/dashboard">
              <DashboardIcon sx={{ mr: 1 }} /> Citizen
            </Button>
          )}

          {user && (
            <Button color="inherit" component={Link} to="/analytics">
              <InsightsIcon sx={{ mr: 1 }} /> Analytics
            </Button>
          )}

          {user?.role === "admin" && (
            <Button color="inherit" component={Link} to="/admin">
              <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin
            </Button>
          )}

          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                <LoginIcon sx={{ mr: 1 }} /> Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                <PersonAddIcon sx={{ mr: 1 }} /> Signup
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </Button>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={openMenu}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem component={Link} to="/" onClick={closeMenu}>
            Home
          </MenuItem>

          {user && (
            <MenuItem component={Link} to="/dashboard" onClick={closeMenu}>
              Citizen Dashboard
            </MenuItem>
          )}

          {user && (
            <MenuItem component={Link} to="/analytics" onClick={closeMenu}>
              Analytics
            </MenuItem>
          )}

          {user?.role === "admin" && (
            <MenuItem component={Link} to="/admin" onClick={closeMenu}>
              Admin Dashboard
            </MenuItem>
          )}

          {!user ? (
            <>
              <MenuItem component={Link} to="/login" onClick={closeMenu}>
                Login
              </MenuItem>
              <MenuItem component={Link} to="/signup" onClick={closeMenu}>
                Signup
              </MenuItem>
            </>
          ) : (
            <MenuItem
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
