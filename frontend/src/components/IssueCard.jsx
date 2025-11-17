import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import MapComponent from "./MapComponent";
import { useAuth } from "../context/AuthContext";

export default function IssueCard({ issue, onUpvote }) {
  const { user } = useAuth();

  const lat = issue?.location?.coordinates?.[1] || 0;
  const lng = issue?.location?.coordinates?.[0] || 0;

  const isAdmin = user?.role === "admin";

  const priorityColor = {
    High: "error",
    Medium: "warning",
    Low: "success",
  };

  return (
    <Card
      elevation={4}
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      {/* Issue Image */}
      {issue.imageUrl && (
        <CardMedia
          component="img"
          height="220"
          sx={{ objectFit: "cover" }}
          image={issue.imageUrl}
          alt={issue.title}
        />
      )}

      <CardContent sx={{ p: 2.5 }}>
        {/* Title + Tags */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
            {issue.title}
          </Typography>

          <Chip label={issue.category} color="secondary" size="small" />

          <Chip
            label={issue.status}
            color={
              issue.status === "Solved"
                ? "success"
                : issue.status === "In Progress"
                ? "warning"
                : "info"
            }
            size="small"
          />

          {issue.priority && (
            <Chip
              label={issue.priority}
              color={priorityColor[issue.priority] || "default"}
              size="small"
            />
          )}
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6 }}
        >
          {issue.description}
        </Typography>

        {/* Map */}
        <Box sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
          <MapComponent lat={lat} lng={lng} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Upvote Button */}
        {!isAdmin ? (
          <Button
            onClick={() => onUpvote(issue._id)}
            variant="contained"
            color="success"
            fullWidth
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              py: 1,
              textTransform: "none",
            }}
          >
            👍 Upvote ({issue.upvotes?.length || 0})
          </Button>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center" }}
          >
            Admins cannot upvote issues.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
