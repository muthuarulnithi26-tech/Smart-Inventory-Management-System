import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { getOrders } from "../../api/order.api";
import { useNavigate } from "react-router-dom";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  return (
    <Box>

      <Button
        variant="contained"
        onClick={() => navigate("/orders/create")}
        sx={{ mb: 2 }}
      >
        + Create Order
      </Button>

      {orders.map((order) => (
        <Card key={order.id} sx={{ mb: 2 }}>
          <CardContent>

            <Typography variant="h6">
              Order #{order.id}
            </Typography>

            <Typography>
              Status: {order.status}
            </Typography>

            <Typography>
              Total: ₹ {order.total_amount}
            </Typography>

            <Button
              size="small"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              View Details
            </Button>

          </CardContent>
        </Card>
      ))}

    </Box>
  );
}
