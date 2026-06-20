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
  Modal,
} from "@mui/material";

import api from "../api/axios";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
  });

  // ---------------- FETCH ----------------
  const fetchDealers = async () => {
    try {
      const res = await api.get("/dealers/");
      setDealers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  // ---------------- CREATE ----------------
  const handleCreate = async () => {
    try {
      await api.post("/dealers/", form);
      setOpen(false);
      setForm({
        name: "",
        phone: "",
        location: "",
      });
      fetchDealers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Dealers (Customers)</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Dealer
        </Button>
      </Box>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dealers.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.location}</TableCell>
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
            Add Dealer
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
            label="Phone"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
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

export default Dealers;
