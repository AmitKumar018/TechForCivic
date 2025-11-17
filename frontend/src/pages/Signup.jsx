import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Paper,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const { signup } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const u = await signup(name, email, password, role);
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 450,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Typography variant="h4" textAlign="center" sx={{ mb: 3, fontWeight: 700 }}>
          Create Account
        </Typography>

        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            sx={{ mb: 3 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            sx={{ mb: 3 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Select Role"
            variant="outlined"
            sx={{ mb: 3 }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="citizen">Citizen</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {err && (
            <Typography color="error" sx={{ mb: 2, fontWeight: 500 }}>
              {err}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ py: 1.2, borderRadius: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
