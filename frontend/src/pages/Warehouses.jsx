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

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  // ---------------- FETCH ----------------
  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/warehouses/");
      setWarehouses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // ---------------- CREATE ----------------
  const handleCreate = async () => {
    try {
      await api.post("/warehouses/", form);
      setOpen(false);
      setForm({ name: "", location: "", capacity: "" });
      fetchWarehouses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Warehouses</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Warehouse
        </Button>
      </Box>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {warehouses.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.id}</TableCell>
                <TableCell>{w.name}</TableCell>
                <TableCell>{w.location}</TableCell>
                <TableCell>{w.capacity}</TableCell>
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
          width={400}
        >
          <Typography variant="h6" mb={2}>
            Add Warehouse
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
            label="Location"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Capacity"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
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

export default Warehouses;
