import { useState } from "react";
import { TextField, Typography } from "@mui/material";
import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/common/Button";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await api.post("/auth/register", form);
    alert("Registered successfully");
  };

  return (
    <AuthLayout>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button fullWidth onClick={handleSubmit}>
        Register
      </Button>
    </AuthLayout>
  );
}
