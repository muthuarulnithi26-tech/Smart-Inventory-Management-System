import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

export const SIDEBAR_WIDTH = 280;

const MENUS = {
  admin: {
    section: "ADMINISTRATION",
    portal: "Administrator Portal",
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
      { label: "Warehouses", path: "/admin/warehouses", icon: <WarehouseIcon /> },
      { label: "Managers", path: "/admin/managers", icon: <PeopleIcon /> },
      { label: "Users", path: "/admin/users", icon: <PersonAddIcon /> },
      { label: "Reports", path: "/admin/reports", icon: <AssessmentIcon /> },
    ],
  },
  manager: {
    section: "WAREHOUSE OPERATIONS",
    portal: "Manager Portal",
    items: [
      { label: "Dashboard", path: "/manager/dashboard", icon: <DashboardIcon /> },
      { label: "Order Approval", path: "/manager/orders-approval", icon: <ReceiptLongIcon /> },
      { label: "Staff", path: "/manager/staff", icon: <PersonAddIcon /> },
      { label: "Products", path: "/manager/products", icon: <InventoryIcon /> },
      { label: "Shipments", path: "/manager/shipments", icon: <LocalShippingIcon /> },
      { label: "Stock", path: "/manager/stock", icon: <WarehouseIcon /> },
      { label: "Reports", path: "/manager/reports", icon: <AssessmentIcon /> },
    ],
  },
  staff: {
    section: "DAILY OPERATIONS",
    portal: "Staff Portal",
    items: [
      { label: "Dashboard", path: "/staff", icon: <DashboardIcon /> },
      { label: "Customers", path: "/staff/customers", icon: <PeopleIcon /> },
      { label: "Products", path: "/staff/products", icon: <InventoryIcon /> },
      { label: "Create Order", path: "/staff/orders/create", icon: <AddShoppingCartIcon /> },
      { label: "Orders", path: "/staff/orders", icon: <ReceiptLongIcon /> },
      { label: "Create Shipment", path: "/staff/shipments/create", icon: <AddBoxIcon /> },
      { label: "Stock", path: "/staff/stock", icon: <WarehouseIcon /> },
    ],
  },
};

function SidebarContent({ role, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const config = MENUS[role] || { section: "", portal: "", items: [] };

  const go = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        bgcolor: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Inventory2Icon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          Smart Inventory
        </Typography>

        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          {config.portal}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* MENU */}
      <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 1, px: 1 }}
        >
          {config.section}
        </Typography>

        <List sx={{ mt: 1 }}>
          {config.items.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <ListItemButton
                key={item.path}
                onClick={() => go(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  minHeight: 48,
                  bgcolor: active ? "#2563eb" : "transparent",
                  color: active ? "#ffffff" : "#cbd5e1",
                  boxShadow: active ? "0 4px 12px rgba(37,99,235,0.35)" : "none",
                  transition: "all .2s ease",
                  "&:hover": {
                    bgcolor: active ? "#2563eb" : "#1e293b",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 42, color: active ? "#ffffff" : "#94a3b8" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* FOOTER */}
      <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600 }}>
          {config.portal}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          Smart Inventory v1.0
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Renders as a permanent, always-visible drawer on desktop (md+) and as a
 * slide-over overlay drawer on mobile, controlled by SidebarContext so the
 * Navbar's hamburger button can open/close it. Used by AdminLayout,
 * ManagerLayout, and StaffLayout — one component instead of three copies.
 */
export default function AppSidebar({ role }) {
  const { mobileOpen, closeSidebar } = useSidebar();

  return (
    <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile: temporary overlay drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box", border: "none" },
        }}
      >
        <SidebarContent role={role} onNavigate={closeSidebar} />
      </Drawer>

      {/* Desktop: permanent fixed drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: "none",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          },
        }}
        open
      >
        <SidebarContent role={role} />
      </Drawer>
    </Box>
  );
}
