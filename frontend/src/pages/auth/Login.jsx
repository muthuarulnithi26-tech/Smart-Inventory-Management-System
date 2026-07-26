import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PasswordField from "../../components/common/PasswordField";
import { loginUser } from "../../api/auth.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_HOME = {
  admin: "/admin",
  manager: "/manager",
  staff: "/staff",
};

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If someone is already logged in and lands on /login (bookmark, back
  // button, typing the URL directly), send them straight to their
  // dashboard instead of showing the form again.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && ROLE_HOME[role]) {
      navigate(ROLE_HOME[role], { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((f) => ({ ...f, [name]: "" }));
    if (error) setError("");
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
      const res = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

      navigate(ROLE_HOME[res.role] || "/login", { replace: true });
    } catch (err) {
      if (!err.response) {
        // No response at all -> network/server unreachable, not bad credentials
        setError("Can't reach the server. Check your connection and try again.");
      } else if (err.response.status === 401 || err.response.status === 400) {
        setError("Incorrect email or password.");
      } else {
        setError(err.response?.data?.detail || "Login failed. Please try again.");
      }
      emailRef.current?.focus();
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
          inputRef={emailRef}
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
