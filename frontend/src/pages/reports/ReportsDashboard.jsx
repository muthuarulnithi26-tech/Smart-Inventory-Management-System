import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getAdminReport,
  getStockReport,
  getOrderReport,
} from "../../api/report.api";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import MiniBarChart from "../../components/common/MiniBarChart";

export default function ReportsDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stock, setStock] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [adminData, stockData, orderData] =
        await Promise.all([
          getAdminReport(),
          getStockReport(),
          getOrderReport(),
        ]);

      setAdmin(adminData || null);

      setStock(
        Array.isArray(stockData)
          ? stockData
          : []
      );

      setOrders(
        Array.isArray(orderData)
          ? orderData
          : []
      );
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to load reports"
      );

      setStock([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <DashboardSkeleton cardCount={4} />;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <ErrorOutlineIcon
          sx={{
            fontSize: 48,
            color: "error.main",
            mb: 1,
          }}
        />

        <Typography
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={load}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: admin?.total_orders ?? 0,
      icon: (
        <ShoppingCartIcon
          sx={{ fontSize: 30 }}
        />
      ),
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },

    {
      label: "Stock Items",
      value:
        admin?.total_stock ??
        stock.length,
      icon: (
        <Inventory2Icon
          sx={{ fontSize: 30 }}
        />
      ),
      gradient:
        "linear-gradient(135deg,#7b1fa2,#ba68c8)",
    },

    {
      label: "Revenue",
      value: `₹${admin?.total_revenue ?? 0}`,
      icon: (
        <CurrencyRupeeIcon
          sx={{ fontSize: 30 }}
        />
      ),
      gradient:
        "linear-gradient(135deg,#16a34a,#4ade80)",
    },

    {
      label: "Reports",
      value: stock.length + orders.length,
      icon: (
        <AssessmentIcon
          sx={{ fontSize: 30 }}
        />
      ),
      gradient:
        "linear-gradient(135deg,#f57c00,#ffb74d)",
    },
  ];

  return (
    <Box>
            {/* PAGE HEADER */}
      <PageHeader
        title="Reports Dashboard"
        subtitle="Analytics for orders, stock, and revenue performance"
      />

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={card.label}
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>

        {/* Orders Overview */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              Orders Overview
            </Typography>

            <MiniBarChart
              data={[
                {
                  label: "Orders",
                  value: admin?.total_orders ?? 0,
                  color: "#2563eb",
                },
                {
                  label: "Revenue",
                  value: admin?.total_revenue ?? 0,
                  color: "#22c55e",
                },
              ]}
            />
          </Box>
        </Grid>

        {/* Stock Overview */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              Stock Overview
            </Typography>

            <MiniBarChart
              data={[
                {
                  label: "Stock",
                  value: admin?.total_stock ?? stock.length,
                  color: "#7c3aed",
                },
                {
                  label: "Reports",
                  value: stock.length + orders.length,
                  color: "#f59e0b",
                },
              ]}
            />
          </Box>
        </Grid>

      </Grid>

      {/* STOCK REPORT */}
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Stock Report
        </Typography>
                <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 750,
            }}
          >
            {/* TABLE HEADER */}
            <Box component="thead">
              <Box
                component="tr"
                sx={{
                  backgroundColor: "#f8fafc",
                }}
              >
                {[
                  "Product ID",
                  "Warehouse",
                  "Quantity",
                ].map((header) => (
                  <Box
                    component="th"
                    key={header}
                    sx={{
                      textAlign: "left",
                      p: 2,
                      fontWeight: 700,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {header}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TABLE BODY */}
            <Box component="tbody">
              {stock.slice(0, 8).map((item) => (
                <Box
                  component="tr"
                  key={item.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {item.product_id}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {item.warehouse_id}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 2,
                        py: 0.5,
                        borderRadius: 10,
                        bgcolor: "primary.main",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {item.quantity}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* EMPTY STATE */}
        {stock.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <Inventory2Icon
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Stock Data
            </Typography>

            <Typography color="text.secondary">
              Stock report is currently empty.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ORDERS REPORT */}
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Recent Orders
        </Typography>
                <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 850,
            }}
          >
            {/* TABLE HEADER */}
            <Box component="thead">
              <Box
                component="tr"
                sx={{
                  backgroundColor: "#f8fafc",
                }}
              >
                {[
                  "Order ID",
                  "Customer",
                  "Total Amount",
                  "Status",
                ].map((header) => (
                  <Box
                    component="th"
                    key={header}
                    sx={{
                      textAlign: "left",
                      p: 2,
                      fontWeight: 700,
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {header}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TABLE BODY */}
            <Box component="tbody">
              {orders.slice(0, 8).map((order) => (
                <Box
                  component="tr"
                  key={order.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    #{order.id}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {order.customer_id}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: 600,
                    }}
                  >
                    ₹{order.total_amount}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 2,
                        py: 0.5,
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        bgcolor:
                          order.status === "completed"
                            ? "success.main"
                            : order.status === "approved"
                            ? "success.main"
                            : order.status === "pending"
                            ? "warning.main"
                            : order.status === "rejected"
                            ? "error.main"
                            : "grey.600",
                      }}
                    >
                      {order.status}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
            }}
          >
            <ShoppingCartIcon
              sx={{
                fontSize: 60,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Orders Found
            </Typography>

            <Typography color="text.secondary">
              There are no recent orders to display.
            </Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}
