import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getProducts,
  createProduct,
} from "../../api/product.api";

import StatCard from "../../components/common/StatCard";
import DashboardSkeleton from "../../components/common/DashboardSkeleton";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
// import EmptyScreen from "../../components/common/EmptyScreen";
// import DataTable from "../../components/common/DataTable";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    purchase_price: "",
    selling_price: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return products;

    return products.filter((product) =>
      `${product.name} ${product.sku} ${product.unit}`
        .toLowerCase()
        .includes(q)
    );
  }, [products, search]);

  const handleCreate = async () => {
    if (
      !form.name ||
      !form.sku ||
      !form.unit ||
      !form.purchase_price ||
      !form.selling_price
    ) {
      return;
    }

    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  const totalProfit = filtered.reduce((total, product) => {
    return (
      total +
      (Number(product.selling_price || 0) -
        Number(product.purchase_price || 0))
    );
  }, 0);

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
          onClick={loadProducts}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
            {/* PAGE HEADER */}
      <PageHeader
        title="Product Management"
        subtitle="Manage inventory products and pricing"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Product
          </Button>
        }
      />

      {/* SEARCH */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <SearchBar
          placeholder="Search products by name, SKU or unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Products"
            value={filtered.length}
            icon={<Inventory2Icon sx={{ fontSize: 30 }} />}
            gradient="linear-gradient(135deg,#1976d2,#42a5f5)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Total Profit"
            value={`₹${totalProfit}`}
            icon={<AttachMoneyIcon sx={{ fontSize: 30 }} />}
            gradient="linear-gradient(135deg,#16a34a,#4ade80)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Search Results"
            value={filtered.length}
            icon={<LocalOfferIcon sx={{ fontSize: 30 }} />}
            gradient="linear-gradient(135deg,#7c3aed,#a78bfa)"
          />
        </Grid>
      </Grid>

      {/* PRODUCT LIST */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Products
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
                  "Product",
                  "SKU",
                  "Unit",
                  "Purchase Price",
                  "Selling Price",
                  "Profit",
                ].map((header) => (
                  <Box
                    component="th"
                    key={header}
                    sx={{
                      textAlign: "left",
                      p: 2,
                      fontWeight: 700,
                      borderBottom: "1px solid #e5e7eb",
                      color: "text.primary",
                    }}
                  >
                    {header}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TABLE BODY */}
            <Box component="tbody">
              {filtered.map((product) => {
                const profit =
                  Number(product.selling_price || 0) -
                  Number(product.purchase_price || 0);

                return (
                  <Box
                    component="tr"
                    key={product.id}
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
                      {product.name}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {product.sku}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {product.unit}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      ₹{product.purchase_price}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      ₹{product.selling_price}
                    </Box>

                    <Box
                      component="td"
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        color={
                          profit >= 0
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        ₹{profit}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <Box
            sx={{
              py: 8,
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
              No Products Found
            </Typography>

            <Typography color="text.secondary">
              Create your first product or change the search
              keyword.
            </Typography>
          </Box>
        )}
      </Box>
            {/* ADD PRODUCT DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Product Name"
            required
            fullWidth
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <TextField
            label="SKU"
            required
            fullWidth
            value={form.sku}
            onChange={(e) =>
              setForm({
                ...form,
                sku: e.target.value,
              })
            }
          />

          <TextField
            label="Unit"
            required
            fullWidth
            placeholder="pcs / kg / box / litre"
            value={form.unit}
            onChange={(e) =>
              setForm({
                ...form,
                unit: e.target.value,
              })
            }
          />

          <TextField
            label="Purchase Price"
            type="number"
            required
            fullWidth
            value={form.purchase_price}
            onChange={(e) =>
              setForm({
                ...form,
                purchase_price: e.target.value,
              })
            }
          />

          <TextField
            label="Selling Price"
            type="number"
            required
            fullWidth
            value={form.selling_price}
            onChange={(e) =>
              setForm({
                ...form,
                selling_price: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            color="inherit"
            onClick={() => {
              setOpen(false);

              setForm({
                name: "",
                sku: "",
                unit: "",
                purchase_price: "",
                selling_price: "",
              });
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
