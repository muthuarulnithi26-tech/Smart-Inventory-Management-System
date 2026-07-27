import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Avatar,
  Checkbox,
  FormControlLabel,
  Divider,
  InputAdornment,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PasswordField from "../../components/common/PasswordField";
import { loginUser } from "../../api/auth.api";

import truckImage from "../../assets/login-truck.jpg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_HOME = {
  admin: "/admin",
  manager: "/manager",
  staff: "/staff",
};

// ─── Global keyframes injected once ───────────────────────────────────────────
const globalStyles = `
  @keyframes float {
    0%   { transform: translateY(0px); }
    50%  { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }

  @keyframes blobMove1 {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.08); }
    66%  { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  @keyframes blobMove2 {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(-35px, 25px) scale(1.06); }
    66%  { transform: translate(25px, -20px) scale(0.97); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
`;

const featureCards = [
  {
    icon: <WarehouseRoundedIcon sx={{ fontSize: 38, color: "#7dd3fc" }} />,
    title: "Inventory Tracking",
    desc: "Monitor stock levels across all warehouses.",
    delay: "0s",
  },
  {
    icon: <LocalShippingRoundedIcon sx={{ fontSize: 38, color: "#7dd3fc" }} />,
    title: "Shipment Management",
    desc: "Track dispatch, transport and delivery status.",
    delay: "2s",
  },
  {
    icon: <InsightsRoundedIcon sx={{ fontSize: 38, color: "#7dd3fc" }} />,
    title: "Business Analytics",
    desc: "Real-time reports and performance insights.",
    delay: "4s",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Inject keyframes once
  useEffect(() => {
    const id = "login-keyframes";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = globalStyles;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && ROLE_HOME[role]) navigate(ROLE_HOME[role], { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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
      const res = await loginUser({ email: form.email.trim(), password: form.password });
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("role", res.role);
      navigate(ROLE_HOME[res.role] || "/login", { replace: true });
    } catch (err) {
      if (!err.response) {
        setError("Cannot connect to the server. Please check your internet connection.");
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
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#eef4ff" }}>

      {/* ═══════════════ LEFT HERO ═══════════════ */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "48%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src={truckImage}
          alt="Smart Inventory Management"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* ── Enhancement 4: Richer 3-stop gradient overlay ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #020617ee 0%, #1e3a8add 55%, #2563ebbb 100%)",
          }}
        />

        {/* ── Enhancement 2: Animated background blobs ── */}
        <Box
          sx={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 280,
            height: 280,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.10)",
            filter: "blur(30px)",
            animation: "blobMove1 12s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "rgba(56,189,248,.20)",
            filter: "blur(30px)",
            animation: "blobMove2 15s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 5,
            color: "#fff",
            p: 7,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#fff", color: "#2563eb", width: 64, height: 64 }}>
              <Inventory2RoundedIcon sx={{ fontSize: 34 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800}>Smart Inventory</Typography>
              <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
                Warehouse • Logistics • Distribution
              </Typography>
            </Box>
          </Stack>

          {/* Main Text */}
          <Box sx={{ mt: 6 }}>
            <Typography sx={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.15 }}>
              Manage Your Entire<br />Supply Chain<br />From One Dashboard
            </Typography>
            <Typography sx={{ mt: 3, maxWidth: 520, fontSize: "1.08rem", opacity: 0.92, lineHeight: 1.8 }}>
              Monitor inventory, warehouses, products, shipments, orders, staff and business
              reports through one modern enterprise platform.
            </Typography>
          </Box>

          {/* ── Enhancement 1: Floating Feature Cards ── */}
          <Stack spacing={2} sx={{ mt: 6, maxWidth: 520 }}>
            {featureCards.map(({ icon, title, desc, delay }) => (
              <Paper
                key={title}
                elevation={0}
                sx={{
                  bgcolor: "rgba(255,255,255,.12)",
                  backdropFilter: "blur(18px)",
                  color: "#fff",
                  borderRadius: 4,
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid rgba(255,255,255,.18)",
                  // ── float animation with staggered delay ──
                  animation: `float 6s ease-in-out ${delay} infinite`,
                }}
              >
                {icon}
                <Box>
                  <Typography fontWeight={700}>{title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>{desc}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* ═══════════════ RIGHT LOGIN ═══════════════ */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, md: 6 },
          bgcolor: "#f8fafc",
        }}
      >
        {/* ── Enhancement 3: Framer Motion fade-in + slide-up ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 500 }}
        >
          {/* ── Enhancement 5: Glass login card ── */}
          <Paper
            elevation={8}
            sx={{
              width: "100%",
              borderRadius: 6,
              p: { xs: 4, md: 5 },
              // Glass morphism
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,.92)",
              border: "1px solid rgba(255,255,255,.5)",
              boxShadow: "0 20px 60px rgba(15,23,42,.12)",
            }}
          >
            {/* LOGO */}
            <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#2563eb",
                  boxShadow: "0 10px 25px rgba(37,99,235,.35)",
                }}
              >
                <Inventory2RoundedIcon sx={{ fontSize: 38 }} />
              </Avatar>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={800}>Welcome Back</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Sign in to continue managing your inventory, warehouse and logistics operations.
                </Typography>
              </Box>
            </Stack>

            {/* ERROR */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* LOGIN FORM */}
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>

                {/* EMAIL */}
                <TextField
                  fullWidth
                  autoFocus
                  inputRef={emailRef}
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={handleChange}
                  error={Boolean(fieldErrors.email)}
                  helperText={fieldErrors.email}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* PASSWORD */}
                <PasswordField
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  error={Boolean(fieldErrors.password)}
                  helperText={fieldErrors.password}
                  disabled={loading}
                  fullWidth
                />

                {/* REMEMBER + FORGOT */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                    }
                    label="Remember Me"
                  />
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: ".25s",
                      "&:hover": { color: "#1d4ed8" },
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  variant="contained"
                  sx={{
                    mt: 1,
                    py: 1.7,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                    boxShadow: "0 12px 30px rgba(37,99,235,.35)",
                    transition: ".3s",
                    "&:hover": {
                      background: "linear-gradient(135deg,#1d4ed8,#0284c7)",
                      transform: "translateY(-2px)",
                    },
                  }}
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

                <Divider>
                  <Typography variant="caption" color="text.secondary">
                    SMART INVENTORY MANAGEMENT
                  </Typography>
                </Divider>

                {/* FOOTER */}
                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Secure ERP Platform for
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontWeight: 700, color: "#2563eb" }}>
                    Warehouse • Inventory • Logistics
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 2, color: "#94a3b8" }}>
                    © {new Date().getFullYear()} Smart Inventory Management
                  </Typography>
                </Box>

              </Stack>
            </Box>

          </Paper>
        </motion.div>
      </Box>

    </Box>
  );
}
