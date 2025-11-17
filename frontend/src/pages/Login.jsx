import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  Box,
  Alert,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const u = await login(email, password, role);
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #E3F2FD, #E8EAF6)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography variant="h4" fontWeight={600} align="center" gutterBottom>
          Welcome Back 
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Login to continue reporting or managing civic issues.
        </Typography>

        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Role"
            variant="outlined"
            sx={{ mb: 2 }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="citizen">Citizen</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {err && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {err}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              py: 1.2,
              fontSize: "1rem",
            }}
          >
            Login
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }} variant="body2">
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#1976d2", fontWeight: 600 }}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
