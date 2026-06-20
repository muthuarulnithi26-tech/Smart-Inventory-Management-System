import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField
} from "@mui/material";

import { getStock, updateStock } from "../../api/stock.api";

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    const data = await getStock();
    setStock(data);
    setLoading(false);
  };

  const handleUpdate = async (id, qty) => {
    await updateStock(id, { quantity: qty });
    loadStock();
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Stock Management
      </Typography>

      {stock.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>

            <Typography variant="h6">
              {item.product_name}
            </Typography>

            <Typography>
              Available: {item.quantity}
            </Typography>

            <TextField
              size="small"
              label="Update Qty"
              type="number"
              sx={{ mt: 1 }}
              onChange={(e) =>
                (item.newQty = e.target.value)
              }
            />

            <Button
              sx={{ mt: 1, ml: 2 }}
              variant="contained"
              onClick={() =>
                handleUpdate(item.id, item.newQty || item.quantity)
              }
            >
              Update
            </Button>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
