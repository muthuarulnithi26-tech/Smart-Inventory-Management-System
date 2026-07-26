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
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";

import {
  getCustomers,
  createCustomer,
} from "../../api/customer.api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createCustomer(form);

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setOpen(false);

      loadCustomers();
    } catch (err) {
      console.log(err);
      alert("Failed to create customer");
    }
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return customers;

    return customers.filter((c) =>
      `${c.name} ${c.email} ${c.phone} ${c.address}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [customers, search]);

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
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Customers
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage customer information
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Customer
        </Button>
      </Box>

      {/* KPI */}
      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
      >
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Total Customers
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
              >
                {customers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Search Results
              </Typography>

              <Typography
                variant="h4"
                fontWeight={800}
              >
                {filteredCustomers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Status
              </Typography>

              <Chip
                label="Active"
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SEARCH */}
      <TextField
        fullWidth
        placeholder="Search customer..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
            {/* ================= CUSTOMER TABLE ================= */}

      {filteredCustomers.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            py: 6,
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
              No Customers Found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              {search
                ? "No customer matches your search."
                : "Start by adding your first customer."}
            </Typography>

            {!search && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
              >
                Add Customer
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          {/* TABLE HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1.5fr 1fr 2fr",
              bgcolor: "#f8fafc",
              fontWeight: 700,
              minWidth: 900,
              px: 3,
              py: 2,
            }}
          >
            <Box>Name</Box>
            <Box>Email</Box>
            <Box>Phone</Box>
            <Box>Address</Box>
          </Box>

          {/* TABLE ROWS */}
          {filteredCustomers.map((customer) => (
            <Box
              key={customer.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1.5fr 1fr 2fr",
                minWidth: 900,
                px: 3,
                py: 2,
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                transition: ".2s",
                "&:hover": {
                  bgcolor: "#f8fafc",
                },
              }}
            >
              {/* NAME */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <PersonIcon color="primary" />

                <Typography fontWeight={700}>
                  {customer.name}
                </Typography>
              </Box>

              {/* EMAIL */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EmailIcon
                  fontSize="small"
                  color="action"
                />

                <Typography>
                  {customer.email}
                </Typography>
              </Box>

              {/* PHONE */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PhoneIcon
                  fontSize="small"
                  color="action"
                />

                <Typography>
                  {customer.phone}
                </Typography>
              </Box>

              {/* ADDRESS */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HomeIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  color="text.secondary"
                >
                  {customer.address}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ================= CREATE CUSTOMER DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Customer
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
            label="Customer Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
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
                <strong>Name:</strong>{" "}
                {form.name || "--"}
              </Typography>

              <Typography variant="body2">
                <strong>Email:</strong>{" "}
                {form.email || "--"}
              </Typography>

              <Typography variant="body2">
                <strong>Phone:</strong>{" "}
                {form.phone || "--"}
              </Typography>

              <Typography variant="body2">
                <strong>Address:</strong>{" "}
                {form.address || "--"}
              </Typography>
            </CardContent>
          </Card>
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
            disabled={
              !form.name.trim() ||
              !form.email.trim() ||
              !form.phone.trim() ||
              !form.address.trim()
            }
          >
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
