import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import api from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    purchase_price: "",
    selling_price: "",
  });

  // ---------------- FETCH ----------------
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- CREATE ----------------
  const handleCreate = async () => {
    try {
      await api.post("/products/", form);
      setOpen(false);
      setForm({
        name: "",
        sku: "",
        unit: "",
        purchase_price: "",
        selling_price: "",
      });
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Products</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </Box>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Selling Price</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell>{p.unit}</TableCell>
                <TableCell>{p.purchase_price}</TableCell>
                <TableCell>{p.selling_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="white"
          p={3}
          width={450}
        >
          <Typography variant="h6" mb={2}>
            Add Product
          </Typography>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="SKU"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Unit (kg / pcs / liters)"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, unit: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Purchase Price"
            margin="normal"
            type="number"
            onChange={(e) =>
              setForm({ ...form, purchase_price: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Selling Price"
            margin="normal"
            type="number"
            onChange={(e) =>
              setForm({ ...form, selling_price: e.target.value })
            }
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleCreate}
          >
            Create
          </Button>
        </Box>
      </Modal>

    </Box>
  );
};

export default Products;
