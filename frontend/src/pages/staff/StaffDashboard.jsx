import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

import api from "../../api/axios";
import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/staff/dashboard");
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton cardCount={5} />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <ErrorOutlineIcon
          sx={{ fontSize: 48, color: "error.main", mb: 1 }}
        />

        <Typography color="error" fontWeight={600}>
          {error}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={load}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: data.total_orders,
      icon: <ShoppingCartIcon sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    },
    {
      label: "Pending Orders",
      value: data.pending_orders,
      icon: <PendingActionsIcon sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    },
    {
      label: "Approved Orders",
      value: data.approved_orders,
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg,#16a34a,#4ade80)",
    },
    {
      label: "Rejected Orders",
      value: data.rejected_orders,
      icon: <CancelIcon sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg,#dc2626,#f87171)",
    },
    {
      label: "Stock Items",
      value: data.stock_items,
      icon: <Inventory2Icon sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    },
  ];

  const quickActions = [
    {
      label: "Create Order",
      icon: <AddShoppingCartIcon />,
      path: "/staff/orders",
    },
    {
      label: "View Stock",
      icon: <InventoryIcon />,
      path: "/staff/inventory",
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg,#0f172a,#334155)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Staff Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 1, opacity: 0.85 }}
          >
            Manage orders, monitor stock, and track your daily work.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="contained"
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.22)",
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
