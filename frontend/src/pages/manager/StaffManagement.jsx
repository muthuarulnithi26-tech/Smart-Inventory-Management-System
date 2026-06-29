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
  TextField,
  Chip,
  CircularProgress,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";

import { createStaff, getMyStaff } from "../../api/manager.api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await getMyStaff();
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    await createStaff(form);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setOpen(false);
    loadStaff();
  };

  const total = staff.length;

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
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* <Box>
          <Typography variant="h5" fontWeight={800}>
            Staff Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your warehouse staff members
          </Typography>
        </Box> */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Staff
        </Button>
      </Box>

      {/* KPI */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <GroupIcon sx={{ fontSize: 35, color: "#2563eb" }} />
              <Box>
                <Typography color="text.secondary">
                  Total Staff
                </Typography>
                <Typography variant="h5" fontWeight={800}>
                  {total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                System Status
              </Typography>
              <Chip label="Active" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary">
                Role
              </Typography>
              <Chip label="Staff Users" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STAFF LIST */}
      <Grid container spacing={3}>
        {staff.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
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
                  <PersonIcon color="primary" />

                  <Chip
                    label={user.role || "staff"}
                    size="small"
                    color="secondary"
                  />
                </Box>

                {/* NAME */}
                <Typography variant="h6" fontWeight={800} mt={1}>
                  {user.name}
                </Typography>

                {/* EMAIL */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <EmailIcon fontSize="small" />
                  <Typography color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* EMPTY STATE */}
      {!staff.length && (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography color="text.secondary">
            No staff members found
          </Typography>
        </Box>
      )}

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Staff</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
