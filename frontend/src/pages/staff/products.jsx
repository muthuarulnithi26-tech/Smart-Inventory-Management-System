import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
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
      `${p.name} ${p.sku} ${p.unit}`
        .toLowerCase()
        .includes(q)
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

  const totalProfit = filtered.reduce(
    (acc, p) =>
      acc +
      (Number(p.selling_price || 0) -
        Number(p.purchase_price || 0)),
    0
  );

  return (
    <Box sx={{ width: "100%" }}>

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
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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
            minWidth: 190,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Total Products
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
            >
              {filtered.length}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            minWidth: 190,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Total Profit
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
              color="success.main"
            >
              ₹{totalProfit}
            </Typography>
          </CardContent>
        </Card>
      </Box>
            {/* LOADING */}
      {loading ? (
        <Box
          sx={{
            height: "45vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  <TableCell>Name</TableCell>

                  <TableCell>SKU</TableCell>

                  <TableCell>Unit</TableCell>

                  <TableCell>Purchase Price</TableCell>

                  <TableCell>Selling Price</TableCell>

                  <TableCell align="right">
                    Profit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((product) => {
                  const profit =
                    Number(product.selling_price || 0) -
                    Number(product.purchase_price || 0);

                  return (
                    <TableRow
                      hover
                      key={product.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f8fafc",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>
                        {product.name}
                      </TableCell>

                      <TableCell>
                        {product.sku}
                      </TableCell>

                      <TableCell>
                        {product.unit}
                      </TableCell>

                      <TableCell>
                        ₹{product.purchase_price}
                      </TableCell>

                      <TableCell>
                        ₹{product.selling_price}
                      </TableCell>

                      <TableCell align="right">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </TableContainer>
                    {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                mt: 6,
                py: 6,
              }}
            >
              <Inventory2Icon
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
                No Products Found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                No products match your current search.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </Box>
          )}
        </>
      )}

      {/* ADD PRODUCT DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Product
        </DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
          <TextField
            label="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            fullWidth
          />

          <TextField
            label="SKU"
            value={form.sku}
            onChange={(e) =>
              setForm({
                ...form,
                sku: e.target.value,
              })
            }
            fullWidth
          />

          <TextField
            label="Unit"
            value={form.unit}
            onChange={(e) =>
              setForm({
                ...form,
                unit: e.target.value,
              })
            }
            fullWidth
          />
                    <TextField
            label="Purchase Price"
            type="number"
            value={form.purchase_price}
            onChange={(e) =>
              setForm({
                ...form,
                purchase_price: e.target.value,
              })
            }
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Selling Price"
            type="number"
            value={form.selling_price}
            onChange={(e) =>
              setForm({
                ...form,
                selling_price: e.target.value,
              })
            }
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOfferIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
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
