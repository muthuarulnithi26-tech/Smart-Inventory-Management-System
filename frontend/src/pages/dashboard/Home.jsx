import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

import { getDashboardData } from "../../api/dashboard.api";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import MiniBarChart from "../../components/common/MiniBarChart";

export default function Home() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getDashboardData();
      setData(res);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSkeleton cardCount={3} />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <ErrorOutlineIcon
          sx={{
            fontSize: 48,
            color: "error.main",
            mb: 2,
          }}
        />

        <Typography
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const revenue = data?.revenue?.revenue ?? 0;

  const cards = [
    {
      label: "Orders",
      value: data?.orders?.length ?? 0,
      icon: (
        <ShoppingCartIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },
    {
      label: "Shipments",
      value: data?.shipments?.length ?? 0,
      icon: (
        <LocalShippingIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#7b1fa2,#ba68c8)",
    },
    {
      label: "Revenue",
      value: `₹${revenue}`,
      icon: (
        <CurrencyRupeeIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#16a34a,#4ade80)",
    },
  ];

  return (
    <Box>
            {/* PAGE HEADER */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of orders, shipments and revenue"
      />

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={card.label}
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* REVENUE OVERVIEW */}
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Dashboard Overview
        </Typography>

        <MiniBarChart
          data={[
            {
              label: "Orders",
              value: data?.orders?.length ?? 0,
              color: "#2563eb",
            },
            {
              label: "Shipments",
              value: data?.shipments?.length ?? 0,
              color: "#7c3aed",
            },
            {
              label: "Revenue",
              value: revenue,
              color: "#16a34a",
            },
          ]}
        />
      </Box>

    </Box>
  );
}
