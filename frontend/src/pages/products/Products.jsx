import { useEffect, useMemo, useState } from "react";

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
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import {
  getProducts,
  createProduct,
} from "../../api/product.api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    purchase_price: "",
    selling_price: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;

    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.unit}`.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleCreate = async () => {
    await createProduct(form);
    setOpen(false);
    setForm({
      name: "",
      sku: "",
      unit: "",
      purchase_price: "",
      selling_price: "",
    });
    loadProducts();
  };

  const totalProfit = filtered.reduce((acc, p) => {
    return (
      acc +
      (Number(p.selling_price || 0) - Number(p.purchase_price || 0))
    );
  }, 0);

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
            Product Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage inventory products and pricing
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      {/* SEARCH + KPI */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
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
              Total Products
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {filtered.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography color="text.secondary">
              Total Profit
            </Typography>
            <Typography variant="h6" fontWeight={800} color="success.main">
              ₹{totalProfit}
            </Typography>
          </CardContent>
        </Card>

      </Box>

      {/* LOADING */}
      {loading ? (
        <Box
          sx={{
            height: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>

          {filtered.map((product) => {
            const profit =
              Number(product.selling_price || 0) -
              Number(product.purchase_price || 0);

            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
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

                    {/* HEADER */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight={800}>
                        {product.name}
                      </Typography>

                      <Inventory2Icon color="primary" />
                    </Box>

                    <Typography color="text.secondary">
                      SKU: {product.sku}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      Unit: {product.unit}
                    </Typography>

                    <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        icon={<LocalOfferIcon />}
                        label={`Buy ₹${product.purchase_price}`}
                        size="small"
                      />

                      <Chip
                        icon={<AttachMoneyIcon />}
                        label={`Sell ₹${product.selling_price}`}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 2,
                        fontWeight: 800,
                        color: profit >= 0 ? "success.main" : "error.main",
                      }}
                    >
                      Profit: ₹{profit}
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}

        </Grid>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="SKU"
            value={form.sku}
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />

          <TextField
            label="Unit"
            value={form.unit}
            onChange={(e) =>
              setForm({ ...form, unit: e.target.value })
            }
          />

          <TextField
            label="Purchase Price"
            type="number"
            value={form.purchase_price}
            onChange={(e) =>
              setForm({ ...form, purchase_price: e.target.value })
            }
          />

          <TextField
            label="Selling Price"
            type="number"
            value={form.selling_price}
            onChange={(e) =>
              setForm({ ...form, selling_price: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
