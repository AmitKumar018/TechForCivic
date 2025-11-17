import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [stats, setStats] = useState({ total: 0, pending: 0, solved: 0 });
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  // Sidebar toggle
  const handleDrawerToggle = () => setOpen(!open);

  // Navigation guard
  const handleNav = (path) => {
    user ? navigate(path) : navigate("/login");
  };

  // Sidebar Items
  const drawerItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Citizen Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Admin Dashboard", icon: <AdminPanelSettingsIcon />, path: "/admin" },
  ];

  const drawer = (
    <Box sx={{ mt: 4, width: 240 }}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Tech for Civic
      </Typography>
      <List>
        {drawerItems.map((item) => (
          <ListItemButton key={item.label} onClick={() => handleNav(item.path)}>
            {item.icon}
            <ListItemText sx={{ ml: 1 }} primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  // Fetch Stats + Issues
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/issues");
        const all = data.data || [];
        setIssues(all);
        setStats({
          total: all.length,
          pending: all.filter((i) => i.status === "Pending").length,
          solved: all.filter((i) => i.status === "Solved").length,
        });
      } catch (err) {
        console.error("Failed to fetch landing stats", err);
      }
    };
    load();
  }, []);

  const filteredIssues =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <AppBar position="fixed" elevation={2}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tech for Civic
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer open={open} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Container sx={{ textAlign: "center", mt: 13, mb: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: 6,
            borderRadius: 4,
            background: "linear-gradient(135deg, #1976d2, #0d47a1)",
            color: "white",
            mb: 6,
            px: 2,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            🏙️ Tech for Civic
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, opacity: 0.9, maxWidth: 700, mx: "auto" }}>
            A simple, powerful platform for citizens to report civic issues and for administrators
            to track, manage, and resolve them efficiently.
          </Typography>

          <Box mt={4}>
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="outlined" size="large" sx={{ color: "white", borderColor: "white" }}>
                  Signup
                </Button>
              </>
            ) : (
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                Welcome back, {user.name}!  
                <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => handleNav("/dashboard")}>
                  Go to Dashboard →
                </span>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: "Total Issues", value: stats.total },
            { label: "Pending", value: stats.pending, color: "warning.main" },
            { label: "Solved", value: stats.solved, color: "success.main" },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 6px 18px rgba(0,0,0,0.25)",
                  },
                }}
                onClick={() => setFilter(stat.label.replace(" Issues", ""))}
              >
                <Typography variant="h6">{stat.label}</Typography>
                <Typography variant="h4" sx={{ color: stat.color || "primary.main" }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 2, fontStyle: "italic" }}>
          Showing: {filter} Issues
        </Typography>

        {/* Issue Preview Cards */}
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            🔍 Recent Civic Issues
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {filteredIssues.length === 0 ? (
              <Typography>No issues found for {filter}</Typography>
            ) : (
              filteredIssues.map((issue, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      p: 1,
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0px 8px 20px rgba(0,0,0,0.25)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {issue.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                        {issue.description}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                        Category: <b>{issue.category}</b> | Status: <b>{issue.status}</b>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
