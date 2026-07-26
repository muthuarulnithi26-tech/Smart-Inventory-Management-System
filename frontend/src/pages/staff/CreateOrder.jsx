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
import {
  createOrder,
  addOrderItem,
} from "../../api/order.api";

export default function OrderCreate() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    payment_type: "cash",
    warehouse_id:
      localStorage.getItem("warehouse_id") || "",
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
      (p) =>
        String(p.id) ===
        String(itemForm.product_id)
    );

    setItems([
      ...items,
      {
        product_id: Number(itemForm.product_id),
        product_name:
          product?.name || "Product",
        quantity: Number(itemForm.quantity),
        selling_price: Number(
          itemForm.selling_price
        ),
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
      alert(
        "Warehouse ID missing. Store it in localStorage after login."
      );
      return;
    }

    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }

    try {
      const order = await createOrder({
        customer_id: Number(
          orderForm.customer_id
        ),
        warehouse_id: Number(
          orderForm.warehouse_id
        ),
        payment_type:
          orderForm.payment_type,
      });

      for (const item of items) {
        await addOrderItem(order.id, {
          product_id: item.product_id,
          quantity: item.quantity,
          selling_price:
            item.selling_price,
        });
      }

      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Order creation failed");
    }
  };

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.selling_price,
    0
  );

  return (
    <Box>

      <Typography variant="h5" mb={3}>
        Create Order
      </Typography>

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>

          <Grid container spacing={2}>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Customer"
                value={orderForm.customer_id}
                onChange={(e) =>
                  setOrderForm({
                    ...orderForm,
                    customer_id:
                      e.target.value,
                  })
                }
              >
                {customers.map((c) => (
                  <MenuItem
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
           </Grid>

          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Order Items
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Add products to this order
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setItemOpen(true)}
        >
          Add Item
        </Button>
      </Box>

      {/* ================= EMPTY STATE ================= */}

      {items.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            py: 5,
            textAlign: "center",
            bgcolor: "#fafafa",
            border: "1px dashed #cbd5e1",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Items Added
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Click the button above to add products.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setItemOpen(true)}
            >
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={index}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  transition: ".25s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                  >
                    {item.product_name}
                  </Typography>

                  <Typography color="text.secondary">
                    Quantity
                  </Typography>

                  <Typography mb={2}>
                    {item.quantity}
                  </Typography>

                  <Typography color="text.secondary">
                    Unit Price
                  </Typography>

                  <Typography mb={2}>
                    ₹ {item.selling_price}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                  >
                    ₹ {item.quantity * item.selling_price}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ================= ORDER SUMMARY ================= */}

      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>

          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
          >
            Order Summary
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <Typography color="text.secondary">
                Total Items
              </Typography>

              <Typography variant="h6">
                {items.length}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography color="text.secondary">
                Grand Total
              </Typography>

              <Typography
                variant="h5"
                color="primary"
                fontWeight={800}
              >
                ₹ {total}
              </Typography>
            </Grid>

          </Grid>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/orders")}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Create Order
            </Button>
          </Box>

        </CardContent>
      </Card>

      {/* ================= ADD ITEM DIALOG ================= */}

      <Dialog
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Order Item
        </DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            mt: 1,
          }}
        >
                    <TextField
            fullWidth
            select
            label="Product"
            value={itemForm.product_id}
            onChange={(e) =>
              setItemForm({
                ...itemForm,
                product_id: e.target.value,
              })
            }
          >
            {products.map((p) => (
              <MenuItem
                key={p.id}
                value={p.id}
              >
                {p.name} — ₹{p.selling_price}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={itemForm.quantity}
            onChange={(e) =>
              setItemForm({
                ...itemForm,
                quantity: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label="Selling Price"
            type="number"
            value={itemForm.selling_price}
            onChange={(e) =>
              setItemForm({
                ...itemForm,
                selling_price: e.target.value,
              })
            }
          />

          <Card
            variant="outlined"
            sx={{
              bgcolor: "#f8fafc",
            }}
          >
            <CardContent>

              <Typography
                variant="subtitle2"
                gutterBottom
              >
                Preview
              </Typography>

              <Typography variant="body2">
                Product:
                {" "}
                {products.find(
                  (p) =>
                    String(p.id) ===
                    String(itemForm.product_id)
                )?.name || "--"}
              </Typography>

              <Typography variant="body2">
                Quantity:
                {" "}
                {itemForm.quantity || 0}
              </Typography>

              <Typography variant="body2">
                Price:
                {" "}
                ₹{itemForm.selling_price || 0}
              </Typography>

              <Typography
                variant="h6"
                color="primary"
                fontWeight={700}
                sx={{ mt: 2 }}
              >
                Total: ₹
                {(
                  Number(itemForm.quantity || 0) *
                  Number(itemForm.selling_price || 0)
                ).toFixed(2)}
              </Typography>

            </CardContent>
          </Card>
                  </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setItemOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddItem}
            disabled={
              !itemForm.product_id ||
              !itemForm.quantity ||
              !itemForm.selling_price
            }
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}