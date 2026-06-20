import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { getProducts } from "../../api/product.api";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Price", field: "price" },
    { label: "Stock", field: "stock" }
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Products
      </Typography>

      <Button sx={{ mb: 2 }}>
        Add Product
      </Button>

      <Table columns={columns} data={products} />
    </Box>
  );
}
