import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={3} sx={{ fontWeight: 700 }}>
        Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((p) => {
          const profit = (p.selling_price || 0) - (p.purchase_price || 0);

          return (
            <Grid item xs={12} md={4} key={p.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography>SKU: {p.sku}</Typography>
                  <Typography>Unit: {p.unit}</Typography>
                  <Typography>Purchase: ₹{p.purchase_price}</Typography>
                  <Typography>Selling: ₹{p.selling_price}</Typography>
                  <Typography sx={{ mt: 1, fontWeight: 700, color: "success.main" }}>
                    Profit: ₹{profit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
