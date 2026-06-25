import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";

import {
  getAdminReport,
  getStockReport,
  getOrderReport,
} from "../../api/report.api";

export default function ReportsDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stock, setStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [a, s, o] = await Promise.all([
        getAdminReport(),
        getStockReport(),
        getOrderReport(),
      ]);

      setAdmin(a || null);
      setStock(Array.isArray(s) ? s : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch (err) {
      console.log("Report error:", err);
      setStock([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Reports Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analytics for orders, stock and revenue performance
        </Typography>
      </Box>

      {/* KPI ROW (same pattern as warehouse/managers) */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary">Total Orders</Typography>
            <Typography variant="h5" fontWeight={800}>
              {admin?.total_orders || 0}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary">Stock Items</Typography>
            <Typography variant="h5" fontWeight={800}>
              {admin?.total_stock || stock.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary">Revenue</Typography>
            <Typography variant="h5" fontWeight={800}>
              ₹{admin?.total_revenue || 0}
            </Typography>
          </CardContent>
        </Card>

      </Box>

      {/* STOCK SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Stock Report
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                <TableCell><b>Product ID</b></TableCell>
                <TableCell><b>Warehouse</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stock.slice(0, 8).map((item) => (
                <TableRow key={item.id} hover>

                  <TableCell>{item.product_id}</TableCell>

                  <TableCell>{item.warehouse_id}</TableCell>

                  <TableCell>
                    <Chip
                      label={item.quantity}
                      color="primary"
                      size="small"
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {stock.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography color="text.secondary">
              No stock data available
            </Typography>
          </Box>
        )}
      </Box>

      {/* ORDERS SECTION */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Recent Orders
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>

            <TableHead>
              <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.slice(0, 8).map((o) => (
                <TableRow key={o.id} hover>

                  <TableCell>{o.id}</TableCell>

                  <TableCell>{o.customer_id}</TableCell>

                  <TableCell>₹{o.total_amount}</TableCell>

                  <TableCell>
                    <Chip
                      label={o.status}
                      color={
                        o.status === "completed"
                          ? "success"
                          : o.status === "pending"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        {orders.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography color="text.secondary">
              No orders found
            </Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}

