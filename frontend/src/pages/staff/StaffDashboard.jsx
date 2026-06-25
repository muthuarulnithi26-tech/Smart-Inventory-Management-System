import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from "@mui/material";
import api from "../../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/staff/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { label: "Total Orders", value: data.total_orders },
    { label: "Pending Orders", value: data.pending_orders },
    { label: "Approved Orders", value: data.approved_orders },
    { label: "Rejected Orders", value: data.rejected_orders },
    { label: "Stock Items", value: data.stock_items },
  ];

  return (
    <Box>
      <Typography variant="h5" mb={3} sx={{ fontWeight: 700 }}>
        Staff Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
                  {card.value ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
