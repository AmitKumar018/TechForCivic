import { Card, CardContent, CardMedia, Typography, Button, Chip, Stack } from '@mui/material'
import MapComponent from './MapComponent'
import { useAuth } from '../context/AuthContext'

export default function IssueCard({ issue, onUpvote }) {
  const { user } = useAuth()
  const lat = issue?.location?.coordinates?.[1] || 0
  const lng = issue?.location?.coordinates?.[0] || 0

  const isAdmin = user?.role === "admin"
  const priorityColor = {
    High: "error",
    Medium: "warning",
    Low: "success"
  }

  return (
    <Card sx={{ borderRadius: 2, mb: 3 }}>
      {issue.imageUrl && (
        <CardMedia
          component="img"
          height="220"
          image={issue.imageUrl}
          alt={issue.title}
        />
      )}
      <CardContent>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
            {issue.title}
          </Typography>

          {}
          <Chip label={issue.category} color="secondary" size="small" />

          {}
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

          {}
          {issue.priority && (
            <Chip
              label={`Priority: ${issue.priority}`}
              color={priorityColor[issue.priority] || "default"}
              size="small"
            />
          )}
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {issue.description}
        </Typography>

        <div className="mt-3">
          <MapComponent lat={lat} lng={lng} />
        </div>

        {}
        {isAdmin ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Admins cannot upvote issues.
          </Typography>
        ) : (
          <Button
            onClick={() => onUpvote(issue._id)}
            sx={{ mt: 2 }}
            variant="contained"
            color="success"
          >
            👍 Upvote ({issue.upvotes?.length || 0})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
