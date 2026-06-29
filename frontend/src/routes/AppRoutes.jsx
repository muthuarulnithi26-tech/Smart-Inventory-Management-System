import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import StaffLayout from "../layouts/StaffLayout";

import Login from "../pages/auth/Login";

/* ADMIN */
import AdminDashboard from "../pages/admin/AdminDashboard";
import Warehouses from "../pages/admin/warehouses/Warehouses";
import Managers from "../pages/admin/managers/Managers";

/* MANAGER */
import StaffManagement from "../pages/manager/StaffManagement";
import OrderApproval from "../pages/manager/OrderApproval";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import StockPage from "../pages/stock/StockPage";
import Products from "../pages/products/Products";
import ShipmentsList from "../pages/manager/ShipmentsList";
import CreateShipment from "../pages/manager/CreateShipment";
import ReportsDashboard from "../pages/reports/ReportsDashboard";

/* STAFF */
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffCustomers from "../pages/staff/Customers";
import StaffProducts from "../pages/staff/products";
import StaffOrders from "../pages/staff/Orders";
import StaffCreateOrder from "../pages/staff/CreateOrder";
import StaffStock from "../pages/staff/Stock";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route path="/logout" element={<Navigate to="/login" replace />} />

      {/* WRAPPER */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* ================= MANAGER ================= */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <ManagerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="orders-approval" element={<OrderApproval />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="products" element={<Products />} />
        <Route path="shipments" element={<ShipmentsList />} />
        {/* <Route path="shipments/create" element={<CreateShipment />} /> */}
        {/* <Route path="create-shipment" element={<CreateShipment />} /> */}
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>

      {/* ================= STAFF ================= */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="customers" element={<StaffCustomers />} />
        <Route path="products" element={<StaffProducts />} />
        <Route path="orders" element={<StaffOrders />} />
        <Route path="orders/create" element={<StaffCreateOrder />} />
        <Route path="shipments/create" element={<CreateShipment />}/>
        <Route path="stock" element={<StaffStock />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="managers" element={<Managers />} />
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>

    </Routes>
  );
}
