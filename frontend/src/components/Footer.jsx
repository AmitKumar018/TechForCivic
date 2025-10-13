import { Typography, Container, Box, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#1976d2", 
        color: "white",
      }}
    >
      <Container maxWidth="lg" className="text-center">
        <Typography variant="body1">
          © {new Date().getFullYear()} Tech for Civic — Empowering Communities
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Link href="/dashboard" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Citizen Dashboard
          </Link>
          <Link href="/admin" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Admin Dashboard
          </Link>
          <Link href="https://github.com/" target="_blank" color="inherit" underline="hover" sx={{ mx: 1 }}>
            GitHub
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
