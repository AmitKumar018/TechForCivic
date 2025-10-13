import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [solvedMonthly, setSolvedMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  const load = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin") {
        //  Admin: detailed analytics
        const statsRes = await api.get("/api/admin/stats");
        setStats(statsRes.data.data);

        const catRes = await api.get("/api/analytics/category-stats");
        setCategoryStats(catRes.data.data || []);

        const solvedRes = await api.get("/api/analytics/solved-monthly");
        setSolvedMonthly(solvedRes.data.data || []);
      } else {
        // 👤 Citizen: read-only analytics
        const statsRes = await api.get("/api/analytics/stats");
        setStats(statsRes.data.data);

        const catRes = await api.get("/api/analytics/category-stats");
        setCategoryStats(catRes.data.data || []);

        const solvedRes = await api.get("/api/analytics/solved-monthly");
        setSolvedMonthly(solvedRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <CircularProgress />
        <Typography variant="body1" className="mt-2">
          Loading Analytics...
        </Typography>
      </div>
    );
  }

  // Pie chart data
  const pieData = categoryStats.map((i) => ({
    name: i.category,
    value: i.count,
  }));

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        📊 Analytics Dashboard
      </Typography>

      {/* Top Stats */}
      {stats && (
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
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Issues per Category (Bar Chart) */}
        <Grid item xs={12} md={6}>
          <Paper className="p-3">
            <Typography variant="h6">Issues per Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Issues per Category (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Paper className="p-3">
            <Typography variant="h6">Category Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Issues Solved per Month (Line Chart) */}
        <Grid item xs={12}>
          <Paper className="p-3">
            <Typography variant="h6">Issues Solved per Month</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={solvedMonthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
