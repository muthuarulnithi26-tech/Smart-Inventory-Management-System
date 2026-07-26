import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.get("/staff/orders");

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return orders;

    return orders.filter((order) =>
      `${order.id}
       ${order.customer_id}
       ${order.warehouse_id}
       ${order.status}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [orders, search]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING"
  ).length;

  const approvedOrders = orders.filter(
    (o) => o.status === "APPROVED"
  ).length;

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
          >
            My Orders
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View and manage warehouse orders.
          </Typography>
        </Box>

        {/* Enable if required */}
        {/*
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() =>
            navigate("/staff/orders/create")
          }
        >
          Create Order
        </Button>
        */}
      </Box>

      {/* KPI CARDS */}
      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Total Orders
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
              >
                {totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Pending Orders
              </Typography>

              <Chip
                icon={<PendingActionsIcon />}
                label={pendingOrders}
                color="warning"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Approved Orders
              </Typography>

              <Chip
                icon={<CheckCircleIcon />}
                label={approvedOrders}
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SEARCH */}
      <TextField
        fullWidth
        placeholder="Search by Order ID, Customer, Warehouse or Status..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
            {/* SEARCH + KPI */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 250,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Card
          sx={{
            minWidth: 180,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Total Orders
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {orders.length}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            minWidth: 180,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Visible Results
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {filteredOrders.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Table>

          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#2563eb",
                "& th": {
                  color: "#fff",
                  fontWeight: 700,
                },
              }}
            >
              <TableCell>Order ID</TableCell>

              <TableCell>Customer</TableCell>

              <TableCell>Warehouse</TableCell>

              <TableCell>Total</TableCell>

              <TableCell>Status</TableCell>

              <TableCell align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
                        {filteredOrders.map((o) => (
              <TableRow
                hover
                key={o.id}
                sx={{
                  "&:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  #{o.id}
                </TableCell>

                <TableCell>
                  {o.customer_id}
                </TableCell>

                <TableCell>
                  {o.warehouse_id}
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  ₹{o.total_amount}
                </TableCell>

                <TableCell>
                  <Chip
                    label={o.status}
                    size="small"
                    color={
                      o.status === "APPROVED"
                        ? "success"
                        : o.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(`/staff/orders/${o.id}`)
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
            {/* EMPTY STATE */}
      {filteredOrders.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 6,
            py: 6,
          }}
        >
          <ReceiptLongIcon
            sx={{
              fontSize: 70,
              color: "#cbd5e1",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
          >
            No Orders Found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            No orders match your search criteria.
          </Typography>

          <Button
            variant="outlined"
            onClick={() => setSearch("")}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </Box>
  );
}
