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

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { getShipments, dispatchShipment } from "../../api/shipment.api";

export default function ShipmentsList() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await getShipments();
      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (id) => {
    await dispatchShipment(id);
    loadShipments();
  };

  const total = shipments.length;
  const dispatched = shipments.filter((s) => s.status === "dispatched").length;
  const pending = total - dispatched;

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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Shipments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage dispatch and delivery tracking
        </Typography>
      </Box>

      {/* KPI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Total Shipments
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Dispatched
              </Typography>
              <Typography variant="h5" fontWeight={800} color="success.main">
                {dispatched}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Pending
              </Typography>
              <Typography variant="h5" fontWeight={800} color="warning.main">
                {pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* LIST */}
      <Grid container spacing={3}>
        {shipments.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>

                {/* HEADER ROW */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalShippingIcon color="primary" />
                    <Typography fontWeight={800}>
                      Shipment #{s.id}
                    </Typography>
                  </Box>

                  <Chip
                    label={s.status}
                    color={s.status === "dispatched" ? "success" : "warning"}
                    size="small"
                  />
                </Box>

                {/* DETAILS */}
                <Box sx={{ mt: 2 }}>
                  <Typography color="text.secondary">
                    Order ID: {s.order_id}
                  </Typography>

                  <Typography color="text.secondary">
                    Vehicle: {s.vehicle_type} - {s.vehicle_number}
                  </Typography>
                </Box>

                {/* ACTION */}
                <Button
                  variant="contained"
                  onClick={() => handleDispatch(s.id)}
                  disabled={s.status === "dispatched"}
                  startIcon={<CheckCircleIcon />}
                  sx={{ mt: 2 }}
                >
                  Dispatch
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* EMPTY */}
      {!shipments.length && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary">
            No shipments found
          </Typography>
        </Box>
      )}

    </Box>
  );
}
