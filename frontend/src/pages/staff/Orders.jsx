import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  InputAdornment,
  Chip,
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

import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/staff/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return orders;

    return orders.filter((o) =>
      `${o.id} ${o.customer_id} ${o.status}`
        .toLowerCase()
        .includes(q)
    );
  }, [orders, search]);

  return (
    <Box>

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            My Orders
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage and track all created orders
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => navigate("/staff/orders/create")}
        >
          Create Order
        </Button>
      </Box>

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

        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography color="text.secondary">
              Total Orders
            </Typography>

            <Typography
              variant="h6"
              fontWeight={800}
            >
              {orders.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography color="text.secondary">
              Visible
            </Typography>

            <Typography
              variant="h6"
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
        }}
      >
        <Table>

          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#f8fafc",
              }}
            >
              <TableCell>
                <b>Order ID</b>
              </TableCell>

              <TableCell>
                <b>Customer</b>
              </TableCell>

              <TableCell>
                <b>Warehouse</b>
              </TableCell>

              <TableCell>
                <b>Total</b>
              </TableCell>

              <TableCell>
                <b>Status</b>
              </TableCell>

              <TableCell align="right">
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.map((o) => (
              <TableRow hover key={o.id}>
                <TableCell>
                  #{o.id}
                </TableCell>

                <TableCell>
                  {o.customer_id}
                </TableCell>

                <TableCell>
                  {o.warehouse_id}
                </TableCell>

                <TableCell>
                  ₹{o.total_amount}
                </TableCell>

                <TableCell>
                  <Chip
                    label={o.status}
                    color={
                      o.status === "APPROVED"
                        ? "success"
                        : o.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      navigate(`/staff/orders/${o.id}`)
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {filteredOrders.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
          }}
        >
          <ReceiptLongIcon
            sx={{
              fontSize: 60,
              color: "#cbd5e1",
            }}
          />

          <Typography
            color="text.secondary"
            mt={1}
          >
            No orders found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
