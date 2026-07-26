import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import AssignmentIcon from "@mui/icons-material/Assignment";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";

import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import MiniBarChart from "../../components/common/MiniBarChart";

import { getManagerDashboard } from "../../api/dashboard.api";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getManagerDashboard();
      setData(res);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton cardCount={6} />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <ErrorOutlineIcon
          sx={{
            fontSize: 48,
            color: "error.main",
            mb: 1,
          }}
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
      label: "Warehouse",
      value: data.warehouse_id,
      icon: <StoreIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },
    {
      label: "Staff",
      value: data.staff_count,
      icon: <PeopleIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#7b1fa2,#ba68c8)",
    },
    {
      label: "Pending Orders",
      value: data.pending_orders,
      icon: <PendingActionsIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#f57c00,#ffb74d)",
    },
    {
      label: "Approved Orders",
      value: data.approved_orders,
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#388e3c,#66bb6a)",
    },
    {
      label: "Stock Items",
      value: data.stock_items,
      icon: <Inventory2Icon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    },
    {
      label: "Shipments",
      value: data.shipments,
      icon: <LocalShippingIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#ef4444,#f87171)",
    },
  ];

  const quickActions = [
    {
      label: "Manage Orders",
      icon: <AssignmentIcon />,
      path: "/manager/orders",
    },
    {
      label: "Inventory",
      icon: <WarehouseIcon />,
      path: "/manager/inventory",
    },
  ];

  return (
    <Box>

      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          background:
            "linear-gradient(135deg,#1e293b,#334155)",
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
            Manager Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mt: 1,
              opacity: 0.85,
            }}
          >
            Monitor warehouse operations, staff,
            inventory, and order activities from one place.
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
            {/* STAT CARDS */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={2}
            key={card.label}
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {/* Order Status */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              Order Status
            </Typography>

            <MiniBarChart
              data={[
                {
                  label: "Pending",
                  value: data.pending_orders ?? 0,
                  color: "#f59e0b",
                },
                {
                  label: "Approved",
                  value: data.approved_orders ?? 0,
                  color: "#22c55e",
                },
              ]}
            />
          </Box>
        </Grid>

        {/* Warehouse Overview */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              Warehouse Overview
            </Typography>

            <MiniBarChart
              data={[
                {
                  label: "Staff",
                  value: data.staff_count ?? 0,
                  color: "#7c3aed",
                },
                {
                  label: "Stock",
                  value: data.stock_items ?? 0,
                  color: "#2563eb",
                },
                {
                  label: "Shipments",
                  value: data.shipments ?? 0,
                  color: "#ef4444",
                },
              ]}
            />
          </Box>
        </Grid>
      </Grid>
            {/* QUICK SUMMARY */}
      <Box
        sx={{
          mt: 3,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Quick Summary
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.8 }}
        >
          You are currently managing{" "}
          <strong>Warehouse #{data.warehouse_id}</strong>.
          This warehouse has{" "}
          <strong>{data.staff_count}</strong> staff members,
          <strong> {data.stock_items}</strong> stock items,
          <strong> {data.pending_orders}</strong> pending
          orders,
          <strong> {data.approved_orders}</strong> approved
          orders, and
          <strong> {data.shipments}</strong> shipments.
        </Typography>
      </Box>

    </Box>
  );
}
