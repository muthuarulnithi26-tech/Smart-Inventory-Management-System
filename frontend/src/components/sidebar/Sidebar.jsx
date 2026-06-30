import {
  Box,
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

import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

  const menus = {
    admin: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: <DashboardIcon />,
      },
      {
        label: "Warehouses",
        path: "/admin/warehouses",
        icon: <WarehouseIcon />,
      },
      {
        label: "Managers",
        path: "/admin/managers",
        icon: <PeopleIcon />,
      },
      {
        label: "Order Approval",
        path: "/admin/orders-approval",
        icon: <ReceiptLongIcon />,
      },
      {
        label: "Reports",
        path: "/admin/reports",
        icon: <AssessmentIcon />,
      },
    ],

    manager: [
      {
        label: "Dashboard",
        path: "/manager/dashboard",
        icon: <DashboardIcon />,
      },
      {
        label: "Staff",
        path: "/manager/staff",
        icon: <PersonAddIcon />,
      },
      {
        label: "Products",
        path: "/manager/products",
        icon: <InventoryIcon />,
      },
      {
        label: "Shipments",
        path: "/manager/shipments",
        icon: <LocalShippingIcon />,
      },
      {
        label: "Reports",
        path: "/manager/reports",
        icon: <AssessmentIcon />,
      },
    ],

    staff: [
      {
        label: "Dashboard",
        path: "/staff",
        icon: <DashboardIcon />,
      },
      {
        label: "Customers",
        path: "/customers",
        icon: <PeopleIcon />,
      },
      {
        label: "Products",
        path: "/products",
        icon: <InventoryIcon />,
      },
      {
        label: "Create Order",
        path: "/orders/create",
        icon: <AddShoppingCartIcon />,
      },
      {
        label: "Orders",
        path: "/orders",
        icon: <ReceiptLongIcon />,
      },
      {
        label: "Warehouse Stock",
        path: "/stock",
        icon: <WarehouseIcon />,
      },
    ],
  };

  const menu = menus[role] || [];

  return (
    <Box
      sx={{
        width: 280,
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "white",
        p: 2,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* LOGO AREA */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            color: "white",
            lineHeight: 1.2,
          }}
        >
          Smart Inventory
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#94a3b8",
            mt: 0.5,
            textTransform: "capitalize",
          }}
        >
          {role} Portal
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.08)",
          mb: 2,
        }}
      />

      <List>
        {menu.map((item) => {
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                mb: 1,
                minHeight: 52,
                color: "#e2e8f0",

                bgcolor: active
                  ? "#2563eb"
                  : "transparent",

                boxShadow: active
                  ? "0 4px 12px rgba(37,99,235,.35)"
                  : "none",

                transition: "all .2s ease",

                "&:hover": {
                  bgcolor: active
                    ? "#2563eb"
                    : "#1e293b",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active
                    ? "#ffffff"
                    : "#94a3b8",
                  minWidth: 42,
                }}
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

      <Box sx={{ flexGrow: 1 }} />

      {/* FOOTER */}
      <Box
        sx={{
          pt: 2,
          borderTop:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
          }}
        >
          Smart Inventory v1.0
        </Typography>
      </Box>
    </Box>
  );
}
