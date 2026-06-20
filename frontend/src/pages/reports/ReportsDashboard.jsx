import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getMonthlyRevenue } from "../../api/report.api";

export default function ReportsDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getMonthlyRevenue(6, 2026);

    // backend returns { revenue: x } → convert for chart
    setData([
      { name: "Revenue", value: res.revenue }
    ]);
  };

  return (
    <Box>

      <Typography variant="h5" mb={2}>
        Reports Dashboard
      </Typography>

      {/* KPI CARDS */}
      <Box display="flex" gap={2} mb={3}>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Monthly Revenue</Typography>
            <Typography variant="h6">₹ {data[0]?.value || 0}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Profit</Typography>
            <Typography variant="h6">Calculated in backend</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography>Shipments</Typography>
            <Typography variant="h6">Live Data</Typography>
          </CardContent>
        </Card>

      </Box>

      {/* CHART */}
      <Card>
        <CardContent>
          <Typography mb={2}>Revenue Chart</Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>

              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="value" stroke="#1976d2" />

            </LineChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

    </Box>
  );
}
