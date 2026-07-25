import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Skeleton,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../../api/auth.api";
import { useSidebar } from "../../context/SidebarContext";

function pageTitleFromPath(path) {
  if (path.includes("dashboard") || path === "/staff" || path === "/manager" || path === "/admin")
    return "Dashboard";
  if (path.includes("warehouses")) return "Warehouse Management";
  if (path.includes("managers")) return "Manager Management";
  if (path.includes("users")) return "User Management";
  if (path.includes("staff")) return "Staff Management";
  if (path.includes("products")) return "Product Management";
  if (path.includes("orders-approval")) return "Order Approval";
  if (path.includes("orders")) return "Order Management";
  if (path.includes("shipments")) return "Shipment Tracking";
  if (path.includes("reports")) return "Reports";
  if (path.includes("customers")) return "Customer Management";
  if (path.includes("stock")) return "Warehouse Stock";
  return "Smart Inventory Management";
}

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getMe();
        if (active) setUser(data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 }, gap: 1 }}>
        {/* Mobile hamburger — opens the slide-over sidebar */}
        <IconButton
          onClick={toggleSidebar}
          sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: { xs: "1rem", sm: "1.25rem" } }}
          noWrap
        >
          {pageTitleFromPath(location.pathname)}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* RIGHT: profile menu */}
        {loading ? (
          <Skeleton variant="circular" width={40} height={40} />
        ) : (
          <>
            <Tooltip title="Account">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: "#2563eb", width: 38, height: 38, fontSize: 15 }}>
                  {initials(user?.name)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              onClick={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                <Typography fontWeight={700}>{user?.name || "User"}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate("/settings")}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
