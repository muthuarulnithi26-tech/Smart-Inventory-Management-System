import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getOrders, approveOrder, rejectOrder } from "../../api/order.api";

export default function OrdersList() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.log(err);
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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Orders</Typography>

        {/* <Button variant="contained" onClick={() => navigate("/orders/create")}>
          Create Order
        </Button> */}
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography>Customer ID: {order.customer_id}</Typography>
                <Typography>Warehouse ID: {order.warehouse_id}</Typography>
                <Typography>Total: ₹{order.total_amount}</Typography>

                <Chip
                  label={order.status}
                  sx={{ mt: 1, mb: 2 }}
                  color={
                    order.status === "APPROVED"
                      ? "success"
                      : order.status === "REJECTED"
                      ? "error"
                      : "warning"
                  }
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>

                  {role === "manager" && order.status === "PENDING" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(order.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(order.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
