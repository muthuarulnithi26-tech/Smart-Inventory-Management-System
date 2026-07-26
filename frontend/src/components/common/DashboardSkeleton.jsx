import { Box, Grid, Skeleton } from "@mui/material";

export default function DashboardSkeleton({ cardCount = 6 }) {
  return (
    <Box>
      {/* Header Skeleton */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Skeleton variant="text" width={280} height={45} />
        <Skeleton variant="text" width={420} height={25} sx={{ mt: 1 }} />

        <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
          <Skeleton variant="rounded" width={150} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Skeleton
              variant="rounded"
              height={140}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rounded"
            height={320}
            sx={{ borderRadius: 4 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rounded"
            height={320}
            sx={{ borderRadius: 4 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}