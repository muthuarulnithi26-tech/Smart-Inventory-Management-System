import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";

import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import {
  getPendingOrders,
  approveOrder,
  rejectOrder,
} from "../../api/orderApproval.api";

export default function OrderApproval() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getPendingOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await approveOrder(id);
    loadOrders();
  };

  const handleReject = async (id) => {
    await rejectOrder(id);
    loadOrders();
  };

  const total = orders.length;

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Order Approval
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Approve or reject incoming warehouse orders
          </Typography>
        </Box>

        <Chip
          icon={<PendingActionsIcon />}
          label={`${total} Pending`}
          color="warning"
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {/* KPI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Pending Orders
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                System Status
              </Typography>
              <Chip label="Active" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Actions Available
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                Approve / Reject
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ORDERS */}
      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                {/* HEADER */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={800}>
                    Order #{order.id}
                  </Typography>

                  <ShoppingCartIcon color="primary" />
                </Box>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Customer: {order.customer_id}
                </Typography>

                <Typography sx={{ mt: 1, fontWeight: 700 }}>
                  ₹{order.total_amount}
                </Typography>

                <Chip
                  label={order.status}
                  color="warning"
                  sx={{ mt: 2, fontWeight: 700 }}
                />

                {/* ACTIONS */}
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleApprove(order.id)}
                  >
                    Approve
                  </Button>

                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(order.id)}
                  >
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* EMPTY STATE */}
      {!orders.length && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary">
            No pending orders
          </Typography>
        </Box>
      )}
    </Box>
  );
}
