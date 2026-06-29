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
  TextField
} from "@mui/material";

import {
  getCustomers,
  createCustomer
} from "../../api/customer.api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    try {
      await createCustomer(form);

      setForm({
        name: "",
        email: "",
        phone: "",
        address: ""
      });

      setOpen(false);
      loadCustomers();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3
        }}
      >
        <Typography variant="h5">
          Customers
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Customer
        </Button>
      </Box>

      {/* CUSTOMER LIST */}
      {/* <Grid container spacing={3}>
        {customers.map((c) => (
          <Grid item xs={12} md={4} key={c.id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>

                <Typography variant="h6">
                  {c.name}
                </Typography>

                <Typography>
                  {c.email}
                </Typography>

                <Typography>
                  {c.phone}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {c.address}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}
      {/* CUSTOMER TABLE STYLE */}
<Box sx={{ mt: 2, overflowX: "auto" }}>

  {/* HEADER */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 2fr",
      fontWeight: 800,
      p: 2,
      bgcolor: "#f1f5f9",
      borderRadius: 2,
      minWidth: 800,
    }}
  >
    <Box>Name</Box>
    <Box>Email</Box>
    <Box>Phone</Box>
    <Box>Address</Box>
  </Box>

  {/* ROWS */}
  {customers.map((c) => (
    <Box
      key={c.id}
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 2fr",
        p: 2,
        borderBottom: "1px solid #e2e8f0",
        alignItems: "center",
        minWidth: 800,
        "&:hover": {
          bgcolor: "#f8fafc",
        },
      }}
    >
      <Box sx={{ fontWeight: 700 }}>
        {c.name}
      </Box>

      <Box>
        {c.email}
      </Box>

      <Box>
        {c.phone}
      </Box>

      <Box sx={{ color: "text.secondary" }}>
        {c.address}
      </Box>
    </Box>
  ))}
</Box>

      {/* CREATE CUSTOMER DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Create Customer
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleCreate}>
            Save
          </Button>

        </DialogActions>
      </Dialog>

    </Box>
  );
}
