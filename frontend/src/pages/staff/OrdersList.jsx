import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { useNavigate } from "react-router-dom";

import {
  getOrders,
  approveOrder,
  rejectOrder,
} from "../../api/order.api";

export default function OrdersList() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  const handleApprove = async (id) => {
    await approveOrder(id);
    loadOrders();
  };

  const handleReject = async (id) => {
    await rejectOrder(id);
    loadOrders();
  };

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return orders;

    return orders.filter((o) =>
      `${o.id} ${o.customer_id} ${o.status} ${o.warehouse_id}`
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
            Orders
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            View and manage warehouse orders
          </Typography>
        </Box>
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
            minWidth: 260,
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
              Search Results
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
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
                        {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#f8fafc",
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  #{order.id}
                </TableCell>

                <TableCell>
                  {order.customer_id}
                </TableCell>

                <TableCell>
                  {order.warehouse_id}
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  ₹{order.total_amount}
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    color={
                      order.status === "APPROVED"
                        ? "success"
                        : order.status === "REJECTED"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/orders/${order.id}`)
                      }
                    >
                      View
                    </Button>

                    {role === "manager" &&
                      order.status === "PENDING" && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleApprove(order.id)
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              handleReject(order.id)
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                  </Box>
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
          <AssignmentIcon
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
            No orders match your current search.
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
