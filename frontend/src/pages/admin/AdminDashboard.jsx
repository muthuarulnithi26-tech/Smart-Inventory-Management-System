import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { getAdminDashboard } from "../../api/dashboard.api";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (!data) {
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
        <CircularProgress size={50} />
        <Typography color="text.secondary">
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: data.total_users,
      icon: <PeopleAltIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #1976d2, #42a5f5)",
    },
    {
      label: "Warehouses",
      value: data.total_warehouses,
      icon: <WarehouseIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #7b1fa2, #ba68c8)",
    },
    {
      label: "Managers",
      value: data.total_managers,
      icon: <SupervisorAccountIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #388e3c, #66bb6a)",
    },
    {
      label: "Pending Orders",
      value: data.pending_orders,
      icon: <PendingActionsIcon sx={{ fontSize: 40 }} />,
      gradient: "linear-gradient(135deg, #f57c00, #ffb74d)",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #1e293b, #334155)",
          color: "#fff",
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 1,
            opacity: 0.85,
          }}
        >
          Monitor users, warehouses, managers and orders from one place.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 4,
                color: "#fff",
                background: card.gradient,
                boxShadow: 6,
                transition: "all 0.3s ease",
                cursor: "pointer",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 10,
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                      }}
                    >
                      {card.label}
                    </Typography>

                    <Typography
                      variant="h3"
                      sx={{
                        mt: 1,
                        fontWeight: 800,
                      }}
                    >
                      {card.value ?? 0}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      p: 1.5,
                      borderRadius: "50%",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Section */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Quick Summary
        </Typography>

        <Typography color="text.secondary">
          Total Users: <strong>{data.total_users ?? 0}</strong> | Warehouses:{" "}
          <strong>{data.total_warehouses ?? 0}</strong> | Managers:{" "}
          <strong>{data.total_managers ?? 0}</strong> | Pending Orders:{" "}
          <strong>{data.pending_orders ?? 0}</strong>
        </Typography>
      </Box>
    </Box>
  );
}
