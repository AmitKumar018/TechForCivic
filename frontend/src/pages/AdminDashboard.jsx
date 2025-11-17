import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Box,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CategoryIcon from "@mui/icons-material/Category";
import FlagIcon from "@mui/icons-material/Flag";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Potholes",
    "Water Problems",
    "Street Lights",
    "Waste Management",
    "Others",
  ];

  const priorities = ["All", "High", "Medium", "Low"];

  const load = async (cat = "All", pri = "All") => {
    try {
      setLoading(true);

      // fetch issues
      let a;
      if (cat === "All") {
        a = await api.get("/api/admin/issues");
      } else {
        a = await api.get(`/api/issues/category/${cat}`);
      }

      let issuesData = a.data.data || [];

      if (pri !== "All") {
        issuesData = issuesData.filter(
          (i) => (i.priority || "").toLowerCase() === pri.toLowerCase()
        );
      }

      setIssues(issuesData);

      // stats
      const b = await api.get("/api/admin/stats");
      setStats(b.data.data);

      // staff
      const c = await api.get("/api/admin/users");
      setUsers(c.data.users || []);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(category, priority);
  }, [category, priority]);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/issues/status/${id}`, { status });
      load(category, priority);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const assignStaff = async (id, staffId) => {
    try {
      await api.put(`/api/admin/issues/assign/${id}`, { staffId });
      load(category, priority);
    } catch (err) {
      console.error("Error assigning staff", err);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete issue?")) return;
    try {
      await api.delete(`/api/admin/issues/${id}`);
      load(category, priority);
    } catch (err) {
      console.error("Error deleting issue", err);
    }
  };

  if (loading) {
    return (
      <Box className="text-center p-5">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Admin Dashboard 
      </Typography>

      {/* FILTERS */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "#f9fafc",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <FilterAltIcon sx={{ mr: 1 }} /> Filters
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Issues"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* STATS */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography>Total Issues</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <PendingActionsIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography>Pending</Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <TaskAltIcon color="success" sx={{ fontSize: 40 }} />
              <Typography>Solved</Typography>
              <Typography variant="h4" color="success.main">
                {stats.solved}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={5} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <FlagIcon color="info" sx={{ fontSize: 40 }} />
              <Typography>Top Category</Typography>
              <Typography variant="h6">
                {stats.mostUpvotedCategory || "N/A"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ISSUE LIST */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Issues List
      </Typography>

      {filteredIssues.length === 0 ? (
        <Typography>No issues found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredIssues.map((i) => (
            <Grid item xs={12} md={6} key={i._id}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  p: 1,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {i.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {i.description}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Chip label={i.category} color="info" sx={{ mr: 1 }} />
                    <Chip
                      label={`Priority: ${i.priority}`}
                      color={
                        i.priority === "High"
                          ? "error"
                          : i.priority === "Medium"
                          ? "warning"
                          : "success"
                      }
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={i.status}
                      color={
                        i.status === "Solved"
                          ? "success"
                          : i.status === "In Progress"
                          ? "warning"
                          : "info"
                      }
                    />
                  </Box>

                  {i.imageUrl && (
                    <img
                      src={i.imageUrl}
                      alt="issue"
                      style={{
                        marginTop: "12px",
                        width: "100%",
                        borderRadius: "8px",
                        height: "160px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                    Upvotes: {i.upvotes?.length}
                  </Typography>

                  <Typography variant="caption" sx={{ display: "block" }}>
                    Assigned:{" "}
                    {i.assignedTo
                      ? `${i.assignedTo.name} (${i.assignedTo.email})`
                      : "Not assigned"}
                  </Typography>
                </CardContent>

                <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Assign Staff</InputLabel>
                    <Select
                      value={i.assignedTo?._id || ""}
                      label="Assign Staff"
                      onChange={(e) => assignStaff(i._id, e.target.value)}
                    >
                      {users.map((u) => (
                        <MenuItem key={u._id} value={u._id}>
                          {u.name} ({u.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <Button
                      size="small"
                      onClick={() => setStatus(i._id, "Pending")}
                    >
                      Pending
                    </Button>

                    <Button
                      size="small"
                      onClick={() => setStatus(i._id, "In Progress")}
                    >
                      Progress
                    </Button>

                    <Button
                      size="small"
                      color="success"
                      onClick={() => setStatus(i._id, "Solved")}
                    >
                      Solved
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => del(i._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
