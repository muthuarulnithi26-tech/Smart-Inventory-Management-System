import { useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { createShipment } from "../../api/shipment.api";
import { useNavigate } from "react-router-dom";

export default function CreateShipment() {
  const [orderId, setOrderId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      setLoading(true);

      await createShipment({
        order_id: orderId,
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber,
        driver_name: driverName,
      });

      navigate("/shipments");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Create Shipment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign vehicle and driver for order delivery
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">

        {/* INFO CARD */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalShippingIcon sx={{ fontSize: 40, color: "#2563eb" }} />

                <Box>
                  <Typography fontWeight={800}>
                    Shipment Setup
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill required delivery details
                  </Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* FORM */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>

            <Typography variant="h6" fontWeight={700} mb={2}>
              Shipment Details
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle Type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Driver Name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading}
                  sx={{ py: 1.2 }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Create Shipment"
                  )}
                </Button>
              </Grid>

            </Grid>

          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
