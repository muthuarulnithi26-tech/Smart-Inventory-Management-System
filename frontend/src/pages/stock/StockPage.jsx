import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getStock,
  addStock,
  removeStock,
} from "../../api/stock.api";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";

export default function StockPage() {
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const [form, setForm] = useState({
    warehouse_id: "",
    product_id: "",
    quantity: "",
  });

  const loadStock = async () => {
    try {
      setLoading(true);
      setError(null);

      const warehouseId = 1;

      const data = await getStock(warehouseId);

      setStock(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
        "Failed to load stock data."
      );

      setStock([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleAddStock = async () => {
    try {
      await addStock({
        ...form,
        quantity: Number(form.quantity),
      });

      setOpenAdd(false);

      setForm({
        warehouse_id: "",
        product_id: "",
        quantity: "",
      });

      loadStock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveStock = async () => {
    try {
      await removeStock({
        ...form,
        quantity: Number(form.quantity),
      });

      setOpenRemove(false);

      setForm({
        warehouse_id: "",
        product_id: "",
        quantity: "",
      });

      loadStock();
    } catch (err) {
      console.log(err);
    }
  };

  const totalItems = stock.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  if (loading) {
    return <DashboardSkeleton cardCount={3} />;
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
          onClick={loadStock}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const cards = [
    {
      label: "Stock Records",
      value: stock.length,
      icon: <InventoryIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },
    {
      label: "Total Quantity",
      value: totalItems,
      icon: <AddBoxIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#16a34a,#4ade80)",
    },
    {
      label: "System Status",
      value: "Active",
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
      gradient:
        "linear-gradient(135deg,#7c3aed,#a78bfa)",
    },
  ];

  return (
    <Box>
            {/* PAGE HEADER */}
      <PageHeader
        title="Inventory Management"
        subtitle="Manage warehouse stock levels and inventory movements"
      />

      {/* ACTION BUTTONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Stock
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<RemoveCircleIcon />}
          onClick={() => setOpenRemove(true)}
        >
          Remove Stock
        </Button>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={card.label}
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* STOCK TABLE */}
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
          Current Inventory
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
                  "ID",
                  "Product",
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
                            {stock.map((item) => (
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
                      fontWeight: 700,
                    }}
                  >
                    #{item.id}
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: 600,
                    }}
                  >
                    {item.product_name}
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
                        alignItems: "center",
                        justifyContent: "center",
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
              py: 8,
              textAlign: "center",
            }}
          >
            <InventoryIcon
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
              No Stock Records Found
            </Typography>

            <Typography color="text.secondary">
              There is currently no inventory available for this warehouse.
            </Typography>
          </Box>
        )}
      </Box>
            {/* ADD STOCK DIALOG */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Stock</DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Warehouse ID"
            fullWidth
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({
                ...form,
                warehouse_id: e.target.value,
              })
            }
          />

          <TextField
            label="Product ID"
            fullWidth
            value={form.product_id}
            onChange={(e) =>
              setForm({
                ...form,
                product_id: e.target.value,
              })
            }
          />

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            color="inherit"
            onClick={() => {
              setOpenAdd(false);

              setForm({
                warehouse_id: "",
                product_id: "",
                quantity: "",
              });
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={handleAddStock}
          >
            Add Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* REMOVE STOCK DIALOG */}
      <Dialog
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Remove Stock</DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Warehouse ID"
            fullWidth
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({
                ...form,
                warehouse_id: e.target.value,
              })
            }
          />

          <TextField
            label="Product ID"
            fullWidth
            value={form.product_id}
            onChange={(e) =>
              setForm({
                ...form,
                product_id: e.target.value,
              })
            }
          />

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            color="inherit"
            onClick={() => {
              setOpenRemove(false);

              setForm({
                warehouse_id: "",
                product_id: "",
                quantity: "",
              });
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<RemoveCircleIcon />}
            onClick={handleRemoveStock}
          >
            Remove Stock
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
