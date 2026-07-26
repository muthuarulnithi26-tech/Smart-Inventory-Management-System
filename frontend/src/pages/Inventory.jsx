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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import api from "../api/axios";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import DashboardSkeleton from "../components/common/DashboardSkeleton";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    warehouse_id: "",
    product_id: "",
    quantity: "",
  });

  // ---------------- FETCH INVENTORY ----------------
  const fetchInventory = async () => {
    try {
      const res = await api.get("/stock/");
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setInventory([]);
      throw err;
    }
  };

  // ---------------- FETCH MASTER DATA ----------------
  const fetchData = async () => {
    try {
      const [warehouseRes, productRes] = await Promise.all([
        api.get("/warehouses/"),
        api.get("/products/"),
      ]);

      setWarehouses(
        Array.isArray(warehouseRes.data)
          ? warehouseRes.data
          : []
      );

      setProducts(
        Array.isArray(productRes.data)
          ? productRes.data
          : []
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchInventory(),
        fetchData(),
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------- ADD STOCK ----------------
  const handleAddStock = async () => {
    try {
      await api.post("/stock/add", {
        ...form,
        quantity: Number(form.quantity),
      });

      setOpen(false);

      setForm({
        warehouse_id: "",
        product_id: "",
        quantity: "",
      });

      fetchInventory();
    } catch (err) {
      console.log(err);
    }
  };

  const totalQuantity = inventory.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
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
            mb: 2,
          }}
        />

        <Typography
          color="error"
          fontWeight={600}
        >
          {error}
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={load}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const cards = [
    {
      label: "Inventory Records",
      value: inventory.length,
      icon: (
        <InventoryIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#1976d2,#42a5f5)",
    },
    {
      label: "Warehouses",
      value: warehouses.length,
      icon: (
        <WarehouseIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#7b1fa2,#ba68c8)",
    },
    {
      label: "Products",
      value: products.length,
      icon: (
        <CategoryIcon sx={{ fontSize: 30 }} />
      ),
      gradient:
        "linear-gradient(135deg,#16a34a,#4ade80)",
    },
  ];

  return (
    <Box>
            {/* PAGE HEADER */}
      <PageHeader
        title="Inventory Management"
        subtitle="Manage warehouse inventory and stock allocation"
      />

      {/* ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddBoxIcon />}
          onClick={() => setOpen(true)}
        >
          Add Stock
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

      {/* ADD STOCK DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>

            <Select
              label="Warehouse"
              value={form.warehouse_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  warehouse_id: e.target.value,
                })
              }
            >
              {warehouses.map((warehouse) => (
                <MenuItem
                  key={warehouse.id}
                  value={warehouse.id}
                >
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>

            <Select
              label="Product"
              value={form.product_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  product_id: e.target.value,
                })
              }
            >
              {products.map((product) => (
                <MenuItem
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            onClick={() => setOpen(false)}
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

      {/* INVENTORY TABLE */}
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
          Inventory Records
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 800,
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
                  "Warehouse",
                  "Product",
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
                            {inventory.map((item, index) => (
                <Box
                  component="tr"
                  key={item.id ?? index}
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
                      fontWeight: 600,
                    }}
                  >
                    {item.warehouse_name}
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
                        minWidth: 50,
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
        {inventory.length === 0 && (
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
              No Inventory Records
            </Typography>

            <Typography color="text.secondary">
              No inventory has been added yet.
            </Typography>
          </Box>
        )}
      </Box>
          </Box>
  );
};

export default Inventory;
