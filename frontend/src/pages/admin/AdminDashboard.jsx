import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={2}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Total Users</Typography>
              <Typography variant="h6">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Warehouses</Typography>
              <Typography variant="h6">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Pending Approvals</Typography>
              <Typography variant="h6">0</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
