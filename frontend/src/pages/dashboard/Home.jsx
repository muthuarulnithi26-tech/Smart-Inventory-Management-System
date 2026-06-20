import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { getDashboardData } from "../../api/dashboard.api";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.log("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const revenue = data?.revenue?.revenue || 0;

  return (
    <Grid container spacing={3}>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: "5px solid #2563eb" }}>
          <CardContent>
            <Typography>Orders</Typography>
            <Typography variant="h5">
              {data?.orders?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: "5px solid #10b981" }}>
          <CardContent>
            <Typography>Shipments</Typography>
            <Typography variant="h5">
              {data?.shipments?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ borderLeft: "5px solid #f59e0b" }}>
          <CardContent>
            <Typography>Revenue</Typography>
            <Typography variant="h5">
              ₹ {revenue}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
