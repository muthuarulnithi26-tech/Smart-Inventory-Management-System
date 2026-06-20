import { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.access_token);

      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        sx={{
          p: 4,
          width: 350,
          borderRadius: 3,
          boxShadow: 5,
          position: "relative"
        }}
      >

        {/* TITLE WITH LINE EFFECT */}
        <Typography variant="h5" mb={2} sx={{ fontWeight: 600 }}>
          Login
        </Typography>

        <Box
          sx={{
            width: "100%",
            height: "2px",
            background: "linear-gradient(to right, #1976d2, transparent)",
            mb: 3,
            borderRadius: 2
          }}
        />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

      </Paper>
    </Box>
  );
}
