import { useEffect, useState } from "react";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Potholes",
    priority: "Medium",
    image: null,
    lat: "",
    lng: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get("/api/issues");
      setIssues(data.data || []);
    } catch (err) {
      console.error("Failed to load issues", err);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const onUpvote = async (id) => {
    try {
      await api.post(`/api/issues/${id}/upvote`);
      load();
    } catch (e) {
      alert("Please login to upvote");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
      },
      () => alert("Unable to fetch location")
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v != null) fd.append(k, v);
      });

      await api.post("/api/issues", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        title: "",
        description: "",
        category: "Potholes",
        priority: "Medium",
        image: null,
        lat: "",
        lng: "",
      });

      load();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to create issue");
    }
  };

  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row">
      {/* LEFT PANEL – FORM */}
      <div className="col-lg-5">
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            background: "#f9fafc",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
             Report an Issue
          </Typography>

          {user?.role === "admin" ? (
            <Typography color="text.secondary">
              Admins cannot create or upvote issues.
            </Typography>
          ) : (
            <form onSubmit={submit}>
              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                sx={{ mb: 2 }}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* Category */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <MenuItem value="Potholes">Potholes</MenuItem>
                  <MenuItem value="Water Problems">Water Problems</MenuItem>
                  <MenuItem value="Street Lights">Street Lights</MenuItem>
                  <MenuItem value="Waste Management">Waste Management</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>

              {/* Priority */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={form.priority}
                  label="Priority"
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>

              {/* File Upload */}
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px dashed #bbb",
                  borderRadius: 2,
                  textAlign: "center",
                  background: "#fff",
                }}
              >
                <input
                  type="file"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                />
              </Box>

              {/* Coordinates */}
              <div className="row g-2">
                <div className="col">
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  />
                </div>
                <div className="col">
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={getLocation}
                variant="outlined"
                sx={{
                  mt: 2,
                  mr: 2,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Use my Location
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Submit Issue
              </Button>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </form>
          )}
        </Paper>
      </div>

      {/* RIGHT PANEL – LIST OF ISSUES */}
      <div className="col-lg-7">
        <TextField
          fullWidth
          label="Search Issues"
          variant="outlined"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredIssues.length === 0 ? (
          <Typography>No issues found.</Typography>
        ) : (
          filteredIssues.map((iss) => (
            <IssueCard key={iss._id} issue={iss} onUpvote={onUpvote} />
          ))
        )}
      </div>
    </div>
  );
}
