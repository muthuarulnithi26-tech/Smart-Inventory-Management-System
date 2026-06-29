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

          <Button
            variant="outlined"
            color="error"
            startIcon={<RemoveCircleIcon />}
            onClick={() => setOpenRemove(true)}
          >
            Remove Stock
          </Button>
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
              <Chip label="System Active" color="success" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STOCK TABLE (CLEAN VERSION) */}
        {/* STOCK TABLE (CLEAN TABLE VIEW) */}
<Box sx={{ mt: 2, overflowX: "auto" }}>

  {/* HEADER */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "80px 1fr 1fr 120px",
      fontWeight: 800,
      p: 2,
      bgcolor: "#f1f5f9",
      borderRadius: 2,
      minWidth: 700,
    }}
  >
    <Box>ID</Box>
    <Box>Product Name</Box>
    <Box>Warehouse</Box>
    <Box>Quantity</Box>
  </Box>

  {stock.map((s) => (
  <Box
    key={s.id}
    sx={{
      display: "grid",
      gridTemplateColumns: "80px 1fr 1fr 120px",
      p: 2,
      borderBottom: "1px solid #e2e8f0",
      alignItems: "center",
      minWidth: 700,
      "&:hover": { bgcolor: "#f8fafc" },
    }}
  >
    <Box sx={{ fontWeight: 700 }}>
      #{s.id}
    </Box>

    <Box sx={{ fontWeight: 600 }}>
      {s.product_name}
    </Box>

    <Box>
      {s.warehouse_id}
    </Box>

    <Box>
      <Chip label={s.quantity} color="primary" size="small" />
    </Box>
  </Box>
))}
</Box>
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

      {/* REMOVE STOCK */}
      <Dialog open={openRemove} onClose={() => setOpenRemove(false)} fullWidth>
        <DialogTitle>Remove Stock</DialogTitle>

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
          <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRemoveStock}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
