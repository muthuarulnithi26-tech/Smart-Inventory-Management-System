import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../../../api/warehouse.api";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getWarehouses();
      setWarehouses(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log(err);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return warehouses;

    return warehouses.filter((w) =>
      `${w.name} ${w.location} ${w.capacity}`
        .toLowerCase()
        .includes(q)
    );
  }, [warehouses, search]);

  const reset = () => {
    setForm({ name: "", location: "", capacity: "" });
    setEditId(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.location || !form.capacity) return;

    const payload = {
      ...form,
      capacity: Number(form.capacity),
    };

    if (editId) {
      await updateWarehouse(editId, payload);
    } else {
      await createWarehouse(payload);
    }

    setOpen(false);
    reset();
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete warehouse?")) return;
    await deleteWarehouse(id);
    load();
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Warehouse Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage storage locations and capacity
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* SEARCH + KPIs */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>

        <TextField
          placeholder="Search warehouses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography color="text.secondary">Total</Typography>
            <Typography fontWeight={800} variant="h6">
              {warehouses.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180 }}>
          <CardContent>
            <Typography color="text.secondary">Capacity</Typography>
            <Typography fontWeight={800} variant="h6">
              {warehouses.reduce((a, b) => a + (Number(b.capacity) || 0), 0)}
            </Typography>
          </CardContent>
        </Card>

      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f1f5f9" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Capacity</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w.id} hover>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarehouseIcon fontSize="small" />
                    {w.name}
                  </Box>
                </TableCell>

                <TableCell>{w.location}</TableCell>

                <TableCell>
                  <Chip
                    label={w.capacity}
                    size="small"
                    color="primary"
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setEditId(w.id);
                      setForm({
                        name: w.name,
                        location: w.location,
                        capacity: w.capacity,
                      });
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(w.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editId ? "Edit Warehouse" : "Add Warehouse"}
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <TextField
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
