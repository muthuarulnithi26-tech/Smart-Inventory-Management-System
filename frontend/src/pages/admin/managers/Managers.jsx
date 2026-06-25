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
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

import {
  createManager,
  getManagers,
  deleteManager,
} from "../../../api/manager.api";

import api from "../../../api/axios";

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    warehouse_id: "",
  });

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [mRes, wRes] = await Promise.all([
        getManagers(),
        api.get("/warehouses"),
      ]);

      setManagers(Array.isArray(mRes) ? mRes : []);
      setWarehouses(Array.isArray(wRes.data) ? wRes.data : []);
    } catch (err) {
      console.log(err);
      setManagers([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return managers;

    return managers.filter((m) =>
      `${m.name} ${m.email} ${m.role} ${m.warehouse_id}`
        .toLowerCase()
        .includes(q)
    );
  }, [search, managers]);

  /* ---------------- CREATE ---------------- */

  const handleCreate = async () => {
    try {
      await createManager(form);

      setForm({
        name: "",
        email: "",
        password: "",
        warehouse_id: "",
      });

      setOpen(false);
      load();
    } catch (err) {
      console.log(err);
      alert("Failed to create manager");
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async () => {
    try {
      await deleteManager(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.log(err);
      alert("Failed to delete manager");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Box sx={{ p: 2 }}>

      {/* HEADER (compact) */}
      <Box sx={header}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Managers
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Manage warehouse managers
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
      </Box>

      {/* SEARCH + STATS (compact row) */}
      <Box sx={topRow}>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Chip label={`Total: ${managers.length}`} />
        <Chip label={`Results: ${filtered.length}`} />
        <Chip
          label={loading ? "Loading" : "Active"}
          color={loading ? "warning" : "success"}
        />
      </Box>

      {/* CONTENT */}
      {loading ? (
        <Box sx={center}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={center}>
          <Typography color="text.secondary">
            No managers found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((m) => (
            <Grid item xs={12} md={4} key={m.id}>
              <Card sx={card}>
                <CardContent sx={{ p: 2 }}>

                  {/* top row */}
                  <Box sx={row}>
                    <Avatar sx={{ bgcolor: "#2563eb" }}>
                      <PersonIcon />
                    </Avatar>

                    <IconButton
                      color="error"
                      onClick={() => setDeleteTarget(m)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {/* info */}
                  <Typography fontWeight={700}>
                    {m.name || "Unnamed"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {m.email}
                  </Typography>

                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Chip size="small" label={m.role || "Manager"} />
                    <Chip
                      size="small"
                      label={m.warehouse_id || "No warehouse"}
                      color={m.warehouse_id ? "success" : "warning"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CREATE DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Manager</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <TextField
            fullWidth
            select
            size="small"
            margin="dense"
            label="Warehouse"
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({ ...form, warehouse_id: e.target.value })
            }
          >
            <MenuItem value="">None</MenuItem>
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Delete Manager?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <b>{deleteTarget?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

/* ---------------- STYLES ---------------- */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

const topRow = {
  display: "flex",
  gap: 1,
  alignItems: "center",
  mb: 2,
  flexWrap: "wrap",
};

const card = {
  borderRadius: 2,
  boxShadow: 2,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
};

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 200,
};
