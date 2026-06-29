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
  MenuItem,
  Divider,
  Chip,
  Stack,
  InputAdornment,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import { useNavigate } from "react-router-dom";

import { dispatchShipment} from "../../api/shipment.api";

export default function CreateShipment() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  const [loading, setLoading] = useState(false);
    const handleCreate = async () => {
    if (
      !orderId ||
      !vehicleType ||
      !vehicleNumber ||
      !driverName
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createShipment({
        order_id: Number(orderId),
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber,
        driver_name: driverName,
      });

      navigate("/manager/shipments");

      
    } catch (err) {
      console.log(err);
      alert("Unable to create shipment.");
    } finally {
      setLoading(false);
    }
  };
  return (
  <Box sx={{ width: "100%" }}>
    {/* Header */}
    <Box
      sx={{
        mb: 4,
        display: "flex",
        // justifyContent: "space-between",
        // alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={800}>
          Create Shipment
        </Typography>

        <Typography color="text.secondary">
          Assign a delivery vehicle and driver for customer orders.
        </Typography>
      </Box>

      <Chip
        icon={<CheckCircleIcon />}
        label="Ready to Dispatch"
        color="success"
        sx={{ fontWeight: 700 }}
      />
    </Box>

    {/* Main Content */}
    <Grid container spacing={3} alignItems="stretch">
      {/* Left Card */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            borderRadius: 3,
            height: "100%",
          }}
        >
          {/* <CardContent>
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingIcon
                    sx={{
                      color: "#fff",
                      fontSize: 34,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Shipment Overview
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Complete all shipment information before dispatch.
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Status
                </Typography>

                <Chip label="Ready" color="success" sx={{ mt: 1 }} />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Warehouse
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <WarehouseIcon color="primary" />
                  <Typography>Main Warehouse</Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Driver
                </Typography>

                <Typography fontWeight={700} mt={1}>
                  {driverName || "Not Assigned"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Vehicle
                </Typography>

                <Typography fontWeight={700} mt={1}>
                  {vehicleNumber || "Not Assigned"}
                </Typography>
              </Box>
            </Stack>
          </CardContent> */}
        </Card>
      </Grid>
          {/* Right Form */}
      <Grid item xs={12} md={8}>
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            boxShadow: 3,
            height: "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptLongIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsCarIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="BIKE">Bike</MenuItem>
                <MenuItem value="VAN">Van</MenuItem>
                <MenuItem value="TRUCK">Truck</MenuItem>
                <MenuItem value="LORRY">Lorry</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalShippingIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dispatch Note"
                value={`Shipment will be created for Order #${orderId || "--"}`}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/manager/shipments")}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading}
                  startIcon={<LocalShippingIcon />}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Create Shipment"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
}