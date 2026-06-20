import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboard
import Home from "../pages/dashboard/Home";

// Orders
import OrdersList from "../pages/orders/OrdersList";
import OrderCreate from "../pages/orders/OrderCreate";
import OrderDetails from "../pages/orders/OrderDetails";

// Stock
import StockPage from "../pages/stock/StockPage";

// Products & Customers
import Products from "../pages/products/Products";
import Customers from "../pages/customers/Customers";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import OrdersApproval from "../pages/admin/OrdersApproval";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* MAIN DASHBOARD */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/* HOME */}
        <Route index element={<Home />} />

        {/* STOCK */}
        <Route
          path="stock"
          element={
            <RoleRoute allowedRoles={["admin", "manager", "staff"]}>
              <StockPage />
            </RoleRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="products"
          element={
            <RoleRoute allowedRoles={["admin", "manager"]}>
              <Products />
            </RoleRoute>
          }
        />

        {/* CUSTOMERS */}
        <Route
          path="customers"
          element={
            <RoleRoute allowedRoles={["admin", "manager"]}>
              <Customers />
            </RoleRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="orders"
          element={
            <RoleRoute allowedRoles={["admin", "manager"]}>
              <OrdersList />
            </RoleRoute>
          }
        />

        <Route
          path="orders/create"
          element={
            <RoleRoute allowedRoles={["admin", "manager"]}>
              <OrderCreate />
            </RoleRoute>
          }
        />

        <Route
          path="orders/:id"
          element={
            <RoleRoute allowedRoles={["admin", "manager"]}>
              <OrderDetails />
            </RoleRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="admin/orders-approval"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <OrdersApproval />
            </RoleRoute>
          }
        />

      </Route>

    </Routes>
  );
}
