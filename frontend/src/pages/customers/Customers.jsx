import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import api from "../../api/axios";
import Table from "../../components/common/Table";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const columns = [
    { label: "ID", field: "id" },
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" }
  ];

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Customers
      </Typography>

      <Table columns={columns} data={customers} />
    </Box>
  );
}
