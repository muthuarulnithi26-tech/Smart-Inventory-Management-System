import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginUser } from "../../api/auth.api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(form);

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

      if (res.role === "admin") {
        navigate("/admin");
      } else if (res.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/staff");
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={1}
        textAlign="center"
      >
        Welcome Back
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
        textAlign="center"
      >
        Sign in to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "grid", gap: 2 }}>
        <TextField
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={20}
                sx={{ mr: 1 }}
              />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>
    </>
  );
}
