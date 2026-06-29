import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";

import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";

import { getManagerDashboard } from "../../api/dashboard.api";

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getManagerDashboard();
        setData(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading || !data) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  const cards = [
    {
      label: "Warehouse",
      value: data.warehouse_id,
      icon: <StoreIcon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #1976d2, #42a5f5)",
    },
    {
      label: "My Staff",
      value: data.staff_count,
      icon: <PeopleIcon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #7b1fa2, #ba68c8)",
    },
    {
      label: "Pending",
      value: data.pending_orders,
      icon: <PendingActionsIcon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #f57c00, #ffb74d)",
    },
    {
      label: "Approved",
      value: data.approved_orders,
      icon: <CheckCircleIcon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #388e3c, #66bb6a)",
    },
    {
      label: "Stock",
      value: data.stock_items,
      icon: <Inventory2Icon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    },
    {
      label: "Shipments",
      value: data.shipments,
      icon: <LocalShippingIcon sx={{ fontSize: 26 }} />,
      gradient: "linear-gradient(135deg, #ef4444, #f87171)",
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
          <Typography variant="h5" fontWeight={700}>
            Manager Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Warehouse operations overview
          </Typography>
        </Box>

        {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Chip
            label="Manager Panel"
            sx={{
              bgcolor: "#1976d2",
              color: "#fff",
              fontWeight: 700,
            }}
          />

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#115293" },
              fontWeight: 700,
            }}
          >
            Logout
          </Button>
        </Box> */}
      </Box>

      {/* KPI CARDS (FIXED GRID) */}
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={2} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                color: "#fff",
                background: card.gradient,
                height: 120,
                display: "flex",
                alignItems: "center",
                boxShadow: 4,
                transition: "0.25s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  "&:last-child": { pb: 2 },
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontWeight: 600 }}
                  >
                    {card.label}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                  >
                    {card.value ?? 0}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    opacity: 0.9,
                  }}
                >
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* QUICK SUMMARY (compact) */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Quick Summary
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Warehouse: {data.warehouse_id} | Staff: {data.staff_count} | Pending:{" "}
          {data.pending_orders} | Approved: {data.approved_orders}
        </Typography>
      </Box>

    </Box>
  );
}