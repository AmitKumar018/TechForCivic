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
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState(""); // search state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Potholes",
    priority: "Medium",
    image: null,
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");

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

    // Auto-refresh every 10s
    const interval = setInterval(() => {
      load();
    }, 10000);

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
      Object.entries(form).forEach(([k, v]) => v != null && fd.append(k, v));
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
      setError(
        e?.response?.data?.error || "Failed to create issue (login required?)"
      );
    }
  };

  // Filter issues by search keyword
  const filteredIssues = issues.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row">
      {/* Left Panel - Issue Report Form */}
      <div className="col-lg-5">
        <Paper className="p-3 mb-4">
          <Typography variant="h6" className="mb-2">
            Report an Issue
          </Typography>

          {user?.role === "admin" ? (
            <Typography color="text.secondary">
              Admins cannot create or upvote issues.
            </Typography>
          ) : (
            <form onSubmit={submit}>
              <TextField
                fullWidth
                className="mb-2"
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <TextField
                fullWidth
                className="mb-2"
                label="Description"
                multiline
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* Category */}
              <FormControl fullWidth className="mb-2">
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
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
              <FormControl fullWidth className="mb-2">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={form.priority}
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
              <div className="mb-2">
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files[0] })
                  }
                />
              </div>

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
                className="mt-2 me-2"
                variant="outlined"
              >
                Use my location
              </Button>
              <Button type="submit" className="mt-2" variant="contained">
                Submit Issue
              </Button>
              {error && <div className="text-danger mt-2">{error}</div>}
            </form>
          )}
        </Paper>
      </div>

      {/* Right Panel - Issues List */}
      <div className="col-lg-7">
        {/*  Search bar */}
        <TextField
          fullWidth
          label="Search Issues"
          variant="outlined"
          className="mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredIssues.map((iss) => (
          <IssueCard key={iss._id} issue={iss} onUpvote={onUpvote} />
        ))}
      </div>
    </div>
  );
}
