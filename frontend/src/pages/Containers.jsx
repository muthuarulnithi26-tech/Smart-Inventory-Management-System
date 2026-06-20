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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import api from "../api/axios";

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [form, setForm] = useState({
    container_number: "",
    source_warehouse_id: "",
    destination_warehouse_id: "",
  });

  // ---------------- FETCH ----------------
  const fetchContainers = async () => {
    try {
      const res = await api.get("/containers/");
      setContainers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/warehouses/");
      setWarehouses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchContainers();
    fetchWarehouses();
  }, []);

  // ---------------- CREATE CONTAINER ----------------
  const handleCreate = async () => {
    try {
      await api.post("/containers/", form);
      setForm({
        container_number: "",
        source_warehouse_id: "",
        destination_warehouse_id: "",
      });
      fetchContainers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>

      <Typography variant="h5" mb={2}>
        Containers (Logistics Movement)
      </Typography>

      {/* CREATE FORM */}
      <Paper sx={{ p: 2, mb: 3 }}>

        <Box display="flex" gap={2}>

          <TextField
            label="Container Number"
            value={form.container_number}
            onChange={(e) =>
              setForm({ ...form, container_number: e.target.value })
            }
          />

          {/* SOURCE */}
          <FormControl fullWidth>
            <InputLabel>Source Warehouse</InputLabel>
            <Select
              value={form.source_warehouse_id}
              onChange={(e) =>
                setForm({ ...form, source_warehouse_id: e.target.value })
              }
            >
              {warehouses.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* DESTINATION */}
          <FormControl fullWidth>
            <InputLabel>Destination Warehouse</InputLabel>
            <Select
              value={form.destination_warehouse_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  destination_warehouse_id: e.target.value,
                })
              }
            >
              {warehouses.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>

        </Box>
      </Paper>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Container</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {containers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.container_number}</TableCell>
                <TableCell>{c.source_warehouse_name}</TableCell>
                <TableCell>{c.destination_warehouse_name}</TableCell>
                <TableCell>{c.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

    </Box>
  );
};

export default Containers;
