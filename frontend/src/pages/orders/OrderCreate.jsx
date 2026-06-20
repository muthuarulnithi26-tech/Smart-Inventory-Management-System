import { useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import { createOrder } from "../../api/order.api";
import { useNavigate } from "react-router-dom";

export default function OrderCreate() {
  const [customerId, setCustomerId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    const res = await createOrder({
      customer_id: customerId,
      warehouse_id: warehouseId
    });

    navigate("/orders");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 3, width: 400 }}>

        <TextField
          fullWidth
          label="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Warehouse ID"
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleCreate}
        >
          Create Order
        </Button>

      </Paper>
    </Box>
  );
}
