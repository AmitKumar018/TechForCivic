import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // stats and issues
  const [stats, setStats] = useState({ total: 0, pending: 0, solved: 0 });
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNav = (path) => {
    if (!user) {
      navigate("/login"); // ask login if not authenticated
    } else {
      navigate(path);
    }
  };

  const drawer = (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tech for Civic
      </Typography>
      <List>
        {["Home", "Citizen Dashboard", "Admin Dashboard"].map((text) => (
          <ListItem
            button
            key={text}
            onClick={() =>
              handleNav(
                text.includes("Citizen")
                  ? "/dashboard"
                  : text.includes("Admin")
                  ? "/admin"
                  : "/"
              )
            }
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Fetch live issues
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/issues");
        const all = data.data || [];
        const total = all.length;
        const pending = all.filter((i) => i.status === "Pending").length;
        const solved = all.filter((i) => i.status === "Solved").length;
        setStats({ total, pending, solved });
        setIssues(all);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  // filter issues
  const filteredIssues =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar with toggle button */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tech for Civic
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer Sidebar */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Container sx={{ textAlign: "center", mt: 12, flexGrow: 1 }}>
        <Typography variant="h3" gutterBottom>
          🏙️ Tech for Civic
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          Welcome to our Civic Issue Reporting Platform.  
          Citizens can report local problems like potholes, water issues, waste management, or street lights —  
          and the administration can track, prioritize, and resolve them efficiently.
        </Typography>

        <Box mt={3}>
          {!user ? (
            <>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                color="secondary"
              >
                Signup
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1" color="success.main">
               Welcome back, {user.name}! Go to your dashboard.
            </Typography>
          )}
        </Box>

        {/* Quick Stats Section */}
        <Container sx={{ py: 4 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
                onClick={() => setFilter("All")}
              >
                <Typography variant="h6">Total Issues</Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
                onClick={() => setFilter("Pending")}
              >
                <Typography variant="h6">Pending</Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.pending}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{ p: 3, textAlign: "center", cursor: "pointer" }}
                onClick={() => setFilter("Solved")}
              >
                <Typography variant="h6">Solved</Typography>
                <Typography variant="h4" color="success.main">
                  {stats.solved}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Showing: {filter} Issues
          </Typography>
        </Container>

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
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px) scale(1.03)",
                        boxShadow: "0px 8px 20px rgba(0,0,0,0.25)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {issue.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {issue.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Category: {issue.category} | Status: {issue.status}
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
