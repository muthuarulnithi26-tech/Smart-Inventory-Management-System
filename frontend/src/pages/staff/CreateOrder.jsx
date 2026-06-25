import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { createOrder, addOrderItem } from "../../api/order.api";

export default function OrderCreate() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    payment_type: "cash",
    warehouse_id: localStorage.getItem("warehouse_id") || "",
  });

  const [items, setItems] = useState([]);
  const [itemOpen, setItemOpen] = useState(false);

  const [itemForm, setItemForm] = useState({
    product_id: "",
    quantity: "",
    selling_price: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
      ]);

      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddItem = () => {
    const product = products.find(
      (p) => String(p.id) === String(itemForm.product_id)
    );

    setItems([
      ...items,
      {
        product_id: Number(itemForm.product_id),
        product_name: product?.name || "Product",
        quantity: Number(itemForm.quantity),
        selling_price: Number(itemForm.selling_price),
      },
    ]);

    setItemForm({
      product_id: "",
      quantity: "",
      selling_price: "",
    });

    setItemOpen(false);
  };

  const handleSubmit = async () => {
    if (!orderForm.customer_id) {
      alert("Customer is required");
      return;
    }

    if (!orderForm.warehouse_id) {
      alert("Warehouse ID missing. Store it in localStorage after login.");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }

    try {
      const order = await createOrder({
        customer_id: Number(orderForm.customer_id),
        warehouse_id: Number(orderForm.warehouse_id),
        payment_type: orderForm.payment_type,
      });

      for (const item of items) {
        await addOrderItem(order.id, {
          product_id: item.product_id,
          quantity: item.quantity,
          selling_price: item.selling_price,
        });
      }

      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Order creation failed");
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.selling_price,
    0
  );

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Create Order
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Customer"
                value={orderForm.customer_id}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, customer_id: e.target.value })
                }
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Warehouse ID"
                value={orderForm.warehouse_id}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, warehouse_id: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Payment Type"
                value={orderForm.payment_type}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, payment_type: e.target.value })
                }
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Order Items</Typography>

        <Button variant="contained" onClick={() => setItemOpen(true)}>
          Add Item
        </Button>
      </Box>

      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.product_name}</Typography>
                <Typography>Qty: {item.quantity}</Typography>
                <Typography>Price: ₹{item.selling_price}</Typography>
                <Typography sx={{ fontWeight: 700, mt: 1 }}>
                  Subtotal: ₹{item.quantity * item.selling_price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">Total: ₹{total}</Typography>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            Save Order
          </Button>
        </CardContent>
      </Card>

      <Dialog open={itemOpen} onClose={() => setItemOpen(false)} fullWidth>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            margin="normal"
            label="Product"
            value={itemForm.product_id}
            onChange={(e) =>
              setItemForm({ ...itemForm, product_id: e.target.value })
            }
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} - ₹{p.selling_price}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            type="number"
            value={itemForm.quantity}
            onChange={(e) =>
              setItemForm({ ...itemForm, quantity: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Selling Price"
            type="number"
            value={itemForm.selling_price}
            onChange={(e) =>
              setItemForm({ ...itemForm, selling_price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddItem}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
