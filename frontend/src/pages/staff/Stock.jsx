import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import {
  getStock,
  addStock,
  removeStock,
} from "../../api/stock.api";

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  const [form, setForm] = useState({
    warehouse_id: "",
    product_id: "",
    quantity: "",
  });

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      setLoading(true);

      const warehouseId = 1;
      const data = await getStock(warehouseId);

      setStock(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setStock([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    await addStock({
      ...form,
      quantity: Number(form.quantity),
    });

    setOpenAdd(false);
    setForm({ warehouse_id: "", product_id: "", quantity: "" });
    loadStock();
  };

  const handleRemoveStock = async () => {
    await removeStock({
      ...form,
      quantity: Number(form.quantity),
    });

    setOpenRemove(false);
    setForm({ warehouse_id: "", product_id: "", quantity: "" });
    loadStock();
  };

  const totalItems = stock.reduce(
    (acc, s) => acc + (Number(s.quantity) || 0),
    0
  );

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
            Inventory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage warehouse stock levels and movements
          </Typography>
        </Box>

        <Box>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            sx={{ mr: 2 }}
            onClick={() => setOpenAdd(true)}
          >
            Add Stock
          </Button>
{/* 
          <Button
            variant="outlined"
            color="error"
            startIcon={<RemoveCircleIcon />}
            onClick={() => setOpenRemove(true)}
          >
            Remove Stock
          </Button> */}
        </Box>
      </Box>

      {/* KPI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", gap: 2 }}>
              <InventoryIcon sx={{ fontSize: 35, color: "#2563eb" }} />
              <Box>
                <Typography color="text.secondary">
                  Total Stock Records
                </Typography>
                <Typography variant="h5" fontWeight={800}>
                  {stock.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Total Quantity
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {totalItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Chip
                label="System Active"
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STOCK GRID */}
      <Grid container spacing={3}>
        {stock.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
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

                <Typography variant="h6" fontWeight={800}>
                  {item.product_name}
                </Typography>

                <Typography color="text.secondary">
                  Product ID: {item.product_id}
                </Typography>

                <Typography color="text.secondary">
                  Warehouse: {item.warehouse_id}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={`Qty: ${item.quantity}`}
                    color="primary"
                  />
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* EMPTY */}
      {!stock.length && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary">
            No stock data found
          </Typography>
        </Box>
      )}

      {/* ADD STOCK */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Add Stock</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Warehouse ID"
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({ ...form, warehouse_id: e.target.value })
            }
          />

          <TextField
            label="Product ID"
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
          />

          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStock}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
