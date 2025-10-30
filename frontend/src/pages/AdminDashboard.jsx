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
} from "@mui/material";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]); // staff list
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

  const load = async (selectedCategory = "All", selectedPriority = "All") => {
    try {
      setLoading(true);

      // fetch issues
      let a;
      if (selectedCategory === "All") {
        a = await api.get("/api/admin/issues");
      } else {
        a = await api.get(`/api/issues/category/${selectedCategory}`);
      }

      let issuesData = a.data.data || [];

      if (selectedPriority !== "All") {
        issuesData = issuesData.filter(
          (i) =>
            (i.priority || "").toLowerCase() ===
            selectedPriority.toLowerCase()
        );
      }

      setIssues(issuesData);

      // fetch stats
      const b = await api.get("/api/admin/stats");
      setStats(b.data.data);

      // fetch users (staff)
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

    const interval = setInterval(() => {
      load(category, priority);
    },300000);

    return () => clearInterval(interval);
  }, [category, priority]);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/issues/status/${id}`, { status });
      load(category, priority);
    } catch (err) {
      console.error(" Failed to update status", err);
    }
  };

  const assignStaff = async (id, staffId) => {
    try {
      await api.put(`/api/admin/issues/assign/${id}`, { staffId });
      load(category, priority);
    } catch (err) {
      console.error(" Failed to assign staff", err);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete issue?")) return;
    try {
      await api.delete(`/api/admin/issues/${id}`);
      load(category, priority);
    } catch (err) {
      console.error(" Failed to delete issue", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <CircularProgress />
        <Typography variant="body1" className="mt-2">
          Loading Admin Dashboard...
        </Typography>
      </div>
    );
  }

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h5" className="mb-3">
        Admin Dashboard
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} className="mb-3">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={category}
              label="Filter by Category"
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
            <InputLabel>Filter by Priority</InputLabel>
            <Select
              value={priority}
              label="Filter by Priority"
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
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Stats Section */}
      {!stats ? (
        <Typography>No statistics available</Typography>
      ) : (
        <Grid container spacing={2} className="mb-3">
          <Grid item xs={6} md={3}>
            <Paper className="p-3 text-center" elevation={3}>
              <Typography>Total</Typography>
              <h3>{stats.total ?? "-"}</h3>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper className="p-3 text-center" elevation={3}>
              <Typography>Pending</Typography>
              <h3 style={{ color: "orange" }}>{stats.pending ?? "-"}</h3>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper className="p-3 text-center" elevation={3}>
              <Typography>Solved</Typography>
              <h3 style={{ color: "green" }}>{stats.solved ?? "-"}</h3>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper className="p-3 text-center" elevation={3}>
              <Typography>Top Category</Typography>
              <h5>{stats.mostUpvotedCategory ?? "-"}</h5>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <Typography>No issues found.</Typography>
      ) : (
        filteredIssues.map((i) => (
          <Paper
            key={i._id}
            className="p-3 mb-3 d-flex align-items-start justify-content-between"
            elevation={4}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <div>
              <Typography variant="subtitle1">
                <strong>{i.title}</strong> — <small>{i.category}</small>
              </Typography>

              {/* Priority Chip */}
              <Chip
                label={`Priority: ${i.priority || "N/A"}`}
                size="small"
                className="me-2"
                color={
                  i.priority === "High"
                    ? "error"
                    : i.priority === "Medium"
                    ? "warning"
                    : i.priority === "Low"
                    ? "success"
                    : "default"
                }
              />

              {/* Status Chip */}
              <Chip
                label={i.status}
                size="small"
                className="mb-2"
                color={
                  i.status === "Solved"
                    ? "success"
                    : i.status === "In Progress"
                    ? "warning"
                    : "default"
                }
              />

              <Typography variant="body2" className="mt-1">
                {i.description}
              </Typography>
              {i.imageUrl && (
                <img
                  src={i.imageUrl}
                  alt="issue"
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    marginTop: "8px",
                    borderRadius: "4px",
                  }}
                />
              )}
              <Typography variant="caption" display="block" className="mt-1">
                Upvotes: {i.upvotes?.length || 0}
              </Typography>

              {i.assignedTo ? (
                <Typography variant="caption" color="primary" display="block">
                  Assigned to: {i.assignedTo.name} ({i.assignedTo.email})
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary" display="block">
                  Not assigned
                </Typography>
              )}

              {i.location?.coordinates && (
                <Typography variant="caption" display="block">
                  {i.location.coordinates[1]}, {i.location.coordinates[0]}
                </Typography>
              )}
            </div>

            {/* Action Buttons + Staff Assignment */}
            <div>
              {/* Assign Staff */}
              <FormControl fullWidth size="small" className="mb-2">
                <InputLabel>Assign Staff</InputLabel>
                <Select
                  value={i.assignedTo?._id || ""}
                  onChange={(e) => assignStaff(i._id, e.target.value)}
                >
                  {users.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                className="me-2"
                size="small"
                variant="outlined"
                onClick={() => setStatus(i._id, "Pending")}
              >
                Pending
              </Button>
              <Button
                className="me-2"
                size="small"
                variant="outlined"
                onClick={() => setStatus(i._id, "In Progress")}
              >
                In Progress
              </Button>
              <Button
                className="me-2"
                size="small"
                variant="contained"
                color="success"
                onClick={() => setStatus(i._id, "Solved")}
              >
                Solved
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => del(i._id)}
              >
                Delete
              </Button>
            </div>
          </Paper>
        ))
      )}
    </div>
  );
}
