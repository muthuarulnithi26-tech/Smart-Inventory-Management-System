import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { getShipments, dispatchShipment } from "../../api/shipment.api";

export default function ShipmentsList() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    const data = await getShipments();
    setShipments(data);
  };

  const handleDispatch = async (id) => {
    await dispatchShipment(id);
    loadShipments(); // refresh
  };

  return (
    <Box>

      <Typography variant="h5" mb={2}>
        Shipments
      </Typography>

      {shipments.map((s) => (
        <Card key={s.id} sx={{ mb: 2 }}>
          <CardContent>

            <Typography>
              Shipment #{s.id}
            </Typography>

            <Typography>
              Order ID: {s.order_id}
            </Typography>

            <Typography>
              Status: {s.status}
            </Typography>

            <Typography>
              Vehicle: {s.vehicle_type} - {s.vehicle_number}
            </Typography>

            <Button
              variant="contained"
              onClick={() => handleDispatch(s.id)}
              disabled={s.status === "dispatched"}
              sx={{ mt: 1 }}
            >
              Dispatch
            </Button>

          </CardContent>
        </Card>
      ))}

    </Box>
  );
}
