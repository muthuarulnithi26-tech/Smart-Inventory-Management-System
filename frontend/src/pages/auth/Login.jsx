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

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(true);

  const [fieldErrors, setFieldErrors] = useState({});

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && ROLE_HOME[role]) {
      navigate(ROLE_HOME[role], {
        replace: true,
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errs.email = "Enter a valid email address";
    }

    if (!form.password) {
      errs.password = "Password is required";
    }

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

      navigate(
        ROLE_HOME[res.role] || "/login",
        {
          replace: true,
        }
      );
    } catch (err) {
      if (!err.response) {
        setError(
          "Cannot connect to the server. Please check your internet connection."
        );
      } else if (
        err.response.status === 401 ||
        err.response.status === 400
      ) {
        setError("Incorrect email or password.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Login failed. Please try again."
        );
      }

      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };
  return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      bgcolor: "#eef4ff",
    }}
  >
    {/* ================= LEFT HERO SECTION ================= */}
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
        src="/images/login-warehouse.jpg"
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

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(15,23,42,.92), rgba(37,99,235,.72))",
        }}
      />

      {/* Decorative Blur */}
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
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "#2563eb",
              width: 64,
              height: 64,
            }}
          >
            <Inventory2RoundedIcon sx={{ fontSize: 34 }} />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Smart Inventory
            </Typography>

            <Typography
              sx={{
                opacity: .85,
                mt: .5,
              }}
            >
              Warehouse • Logistics • Distribution
            </Typography>
          </Box>
        </Stack>

        {/* Main Text */}
        <Box sx={{ mt: 6 }}>
          <Typography
            sx={{
              fontSize: "3rem",
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Manage Your Entire
            <br />
            Supply Chain
            <br />
            From One Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 520,
              fontSize: "1.08rem",
              opacity: .92,
              lineHeight: 1.8,
            }}
          >
            Monitor inventory, warehouses, products,
            shipments, orders, staff and business reports
            through one modern enterprise platform.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Stack
          spacing={2}
          sx={{
            mt: 6,
            maxWidth: 520,
          }}
        >
          <Paper
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
            }}
          >
            <WarehouseRoundedIcon
              sx={{
                fontSize: 38,
                color: "#7dd3fc",
              }}
            />

            <Box>
              <Typography fontWeight={700}>
                Inventory Tracking
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: .85 }}
              >
                Monitor stock levels across all warehouses.
              </Typography>
            </Box>
          </Paper>

          <Paper
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
            }}
          >
            <LocalShippingRoundedIcon
              sx={{
                fontSize: 38,
                color: "#7dd3fc",
              }}
            />

            <Box>
              <Typography fontWeight={700}>
                Shipment Management
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: .85 }}
              >
                Track dispatch, transport and delivery status.
              </Typography>
            </Box>
          </Paper>

          <Paper
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
            }}
          >
            <InsightsRoundedIcon
              sx={{
                fontSize: 38,
                color: "#7dd3fc",
              }}
            />

            <Box>
              <Typography fontWeight={700}>
                Business Analytics
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: .85 }}
              >
                Real-time reports and performance insights.
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>

    {/* ================= RIGHT LOGIN SECTION ================= */}

    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: {
          xs: 3,
          md: 6,
        },
        bgcolor: "#f8fafc",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 6,
          p: {
            xs: 4,
            md: 5,
          },
          boxShadow:
            "0 20px 60px rgba(15,23,42,.12)",
        }}
      >
                {/* LOGO */}
        <Stack
          spacing={2}
          alignItems="center"
          sx={{ mb: 4 }}
        >
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
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Welcome Back
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Sign in to continue managing your inventory,
              warehouse and logistics operations.
            </Typography>
          </Box>
        </Stack>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* LOGIN FORM */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
        >
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
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
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
                  "&:hover": {
                    color: "#1d4ed8",
                  },
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
                background:
                  "linear-gradient(135deg,#2563eb,#0ea5e9)",

                boxShadow:
                  "0 12px 30px rgba(37,99,235,.35)",

                transition: ".3s",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#1d4ed8,#0284c7)",

                  transform: "translateY(-2px)",
                },
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

            <Divider>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                SMART INVENTORY MANAGEMENT
              </Typography>
            </Divider>
                        {/* FOOTER */}

            <Box
              sx={{
                textAlign: "center",
                mt: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Secure ERP Platform for
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                  color: "#2563eb",
                }}
              >
                Warehouse • Inventory • Logistics
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "#94a3b8",
                }}
              >
                © {new Date().getFullYear()} Smart Inventory Management
              </Typography>
            </Box>

          </Stack>

        </Box>

      </Paper>

    </Box>

  </Box>
);
}