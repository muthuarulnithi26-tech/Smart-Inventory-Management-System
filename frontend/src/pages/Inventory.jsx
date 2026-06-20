import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import api from "../api/axios";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    warehouse_id: "",
    product_id: "",
    quantity: "",
  });

  // ---------------- FETCH INVENTORY ----------------
  const fetchInventory = async () => {
    try {
      const res = await api.get("/stock/");
      setInventory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- FETCH MASTER DATA ----------------
  const fetchData = async () => {
    try {
      const w = await api.get("/warehouses/");
      const p = await api.get("/products/");

      setWarehouses(w.data);
      setProducts(p.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchData();
  }, []);

  // ---------------- ADD STOCK ----------------
  const handleAddStock = async () => {
    try {
      await api.post("/stock/add", form);
      setForm({ warehouse_id: "", product_id: "", quantity: "" });
      fetchInventory();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>

      <Typography variant="h5" mb={2}>
        Inventory (Warehouse Stock)
      </Typography>

      {/* ADD STOCK FORM */}
      <Paper sx={{ p: 2, mb: 3 }}>

        <Box display="flex" gap={2}>

          {/* WAREHOUSE */}
          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={form.warehouse_id}
              onChange={(e) =>
                setForm({ ...form, warehouse_id: e.target.value })
              }
            >
              {warehouses.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* PRODUCT */}
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={form.product_id}
              onChange={(e) =>
                setForm({ ...form, product_id: e.target.value })
              }
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* QUANTITY */}
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <Button variant="contained" onClick={handleAddStock}>
            Add
          </Button>
        </Box>

      </Paper>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.warehouse_name}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>

    </Box>
  );
};

export default Inventory;
