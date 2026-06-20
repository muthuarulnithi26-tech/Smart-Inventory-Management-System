import { useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import { createShipment } from "../../api/shipment.api";
import { useNavigate } from "react-router-dom";

export default function CreateShipment() {
  const [orderId, setOrderId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    await createShipment({
      order_id: orderId,
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber,
      driver_name: driverName
    });

    navigate("/shipments");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 3, width: 400 }}>

        <TextField
          fullWidth
          label="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Vehicle Type"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Driver Name"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleCreate}
          sx={{ mt: 2 }}
        >
          Create Shipment
        </Button>

      </Paper>
    </Box>
  );
}
