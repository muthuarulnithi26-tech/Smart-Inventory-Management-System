import { useState } from "react";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PasswordField from "../../components/common/PasswordField";
import { loginUser } from "../../api/auth.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await loginUser(form);

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

      if (res.role === "admin") navigate("/admin");
      else if (res.role === "manager") navigate("/manager");
      else navigate("/staff");
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4" fontWeight={800} textAlign="center" sx={{ mb: 1 }}>
        Welcome Back
      </Typography>

      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Sign in to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          autoFocus
          autoComplete="email"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          disabled={loading}
        />

        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          autoComplete="current-password"
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 1, height: 50, fontWeight: 700, fontSize: "1rem", borderRadius: 2, textTransform: "none" }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>
    </Box>
  );
}
