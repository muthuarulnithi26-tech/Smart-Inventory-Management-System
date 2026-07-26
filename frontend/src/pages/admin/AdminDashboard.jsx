import { useEffect, useState } from "react";
import { Box, Grid, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BadgeIcon from "@mui/icons-material/Badge";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GroupsIcon from "@mui/icons-material/Groups";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";

import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import MiniBarChart from "../../components/common/MiniBarChart";
import { getAdminDashboard } from "../../api/dashboard.api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <DashboardSkeleton cardCount={6} />;

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
        <Typography color="error" fontWeight={600}>{error}</Typography>
        <Button startIcon={<RefreshIcon />} onClick={load} sx={{ mt: 2 }} variant="outlined">
          Retry
        </Button>
      </Box>
    );
  }

  const cards = [
    { label: "Total Users", value: data.total_users, icon: <PeopleAltIcon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #1976d2, #42a5f5)" },
    { label: "Warehouses", value: data.total_warehouses, icon: <WarehouseIcon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #7b1fa2, #ba68c8)" },
    { label: "Managers", value: data.total_managers, icon: <SupervisorAccountIcon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #388e3c, #66bb6a)" },
    { label: "Staff", value: data.total_staff, icon: <BadgeIcon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
    { label: "Products", value: data.total_products, icon: <Inventory2Icon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #f57c00, #ffb74d)" },
    { label: "Customers", value: data.total_customers, icon: <GroupsIcon sx={{ fontSize: 30 }} />, gradient: "linear-gradient(135deg, #ef4444, #f87171)" },
  ];

  const quickActions = [
    { label: "Add Warehouse", icon: <AddBusinessIcon />, path: "/admin/warehouses" },
    { label: "Add Manager", icon: <PersonAddIcon />, path: "/admin/managers" },
    { label: "View Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #1e293b, #334155)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
            Monitor users, warehouses, managers and orders from one place.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {quickActions.map((a) => (
            <Button
              key={a.label}
              variant="contained"
              startIcon={a.icon}
              onClick={() => navigate(a.path)}
              sx={{ bgcolor: "rgba(255,255,255,0.12)", "&:hover": { bgcolor: "rgba(255,255,255,0.22)" } }}
            >
              {a.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={card.label}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Order Status</Typography>
              <MiniBarChart
                data={[
                  { label: "Pending", value: data.pending_orders ?? 0, color: "#f59e0b" },
                  { label: "Approved", value: data.approved_orders ?? 0, color: "#22c55e" },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Shipment Status</Typography>
              <MiniBarChart
                data={[
                  { label: "Total", value: data.total_shipments ?? 0, color: "#2563eb" },
                  { label: "Dispatched", value: data.dispatched_shipments ?? 0, color: "#f59e0b" },
                  { label: "Delivered", value: data.delivered_shipments ?? 0, color: "#22c55e" },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
