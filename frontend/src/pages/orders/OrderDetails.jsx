import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent } from "@mui/material";
import api from "../../api/axios";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const res = await api.get(`/orders/${id}`);
    setOrder(res.data);
  };

  if (!order) return <div>Loading...</div>;

  return (
    <Box>

      <Card>
        <CardContent>

          <Typography variant="h5">
            Order #{order.id}
          </Typography>

          <Typography>
            Status: {order.status}
          </Typography>

          <Typography>
            Total: ₹ {order.total_amount}
          </Typography>

        </CardContent>
      </Card>

    </Box>
  );
}
