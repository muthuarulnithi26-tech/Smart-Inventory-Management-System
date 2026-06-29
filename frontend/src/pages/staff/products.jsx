import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return products;

    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.unit}`.toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalProfit = useMemo(() => {
    return products.reduce((sum, p) => {
      return sum + ((p.selling_price || 0) - (p.purchase_price || 0));
    }, 0);
  }, [products]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Products
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Manage all inventory products and pricing
        </Typography>
      </Box>

      {/* SEARCH + STATS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by name, SKU, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Inventory2Icon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Products
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {products.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TrendingUpIcon color="success" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Profit
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  ₹{totalProfit}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((p) => {
            const profit =
              (p.selling_price || 0) - (p.purchase_price || 0);

            return (
              <Grid item xs={12} md={4} key={p.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
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
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        {p.name}
                      </Typography>

                      <Chip
                        label={p.unit}
                        size="small"
                        color="primary"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      SKU: {p.sku}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography>
                        Purchase: ₹{p.purchase_price}
                      </Typography>

                      <Typography>
                        Selling: ₹{p.selling_price}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontWeight: 800,
                          color:
                            profit >= 0
                              ? "success.main"
                              : "error.main",
                        }}
                      >
                        Profit: ₹{profit}
                      </Typography>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

    </Box>
  );
}
