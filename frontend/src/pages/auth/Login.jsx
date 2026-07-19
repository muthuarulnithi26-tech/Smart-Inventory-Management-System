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

       console.log("✅ Login Response:", res);
       console.log("✅ Access Token:", res.access_token);
       console.log("✅ Role:", res.role);

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);

      console.log("✅ Stored Token:", localStorage.getItem("token"));
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
    <Box
     sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography
      variant="h4"
      fontWeight={800}
      textAlign="center"
      sx={{ mb: 1 }}
    >
      Welcome Back
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      textAlign="center"
      sx={{ mb: 4 }}
    >
      Sign in to continue
    </Typography>

    {error && (
      <Alert
        severity="error"
        sx={{
          width: "100%",
          mb: 3,
        }}
      >
        {error}
      </Alert>
    )}

    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <TextField
        label="Email Address"
        name="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        autoComplete="email"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
      />

      <TextField
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        fullWidth
        autoComplete="current-password"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        onClick={handleLogin}
        sx={{
          mt: 1,
          height: 50,
          fontWeight: 700,
          fontSize: "1rem",
          borderRadius: 2,
          textTransform: "none",
        }}
      >
        {loading ? (
          <>
            <CircularProgress
              size={20}
              color="inherit"
              sx={{ mr: 1 }}
            />
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
