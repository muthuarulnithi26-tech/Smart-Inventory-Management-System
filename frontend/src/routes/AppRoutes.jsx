import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import RoleHomeRedirect from "../components/RoleHomeRedirect";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import StaffLayout from "../layouts/StaffLayout";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Warehouses from "../pages/admin/warehouses/Warehouses";
import Managers from "../pages/admin/managers/Managers";

import StaffManagement from "../pages/manager/StaffManagement";
import OrderApproval from "../pages/manager/OrderApproval";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerStock from "../pages/manager/Stock";
import ManagerProducts from "../pages/manager/Products";
import ManagerShipments from "../pages/manager/Shipments";
import ManagerReports from "../pages/manager/Reports";

import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffCustomers from "../pages/staff/Customers";
import StaffProducts from "../pages/staff/products";
import StaffOrders from "../pages/staff/Orders";
import StaffCreateOrder from "../pages/staff/CreateOrder";
import StaffStock from "../pages/staff/Stock";
import OrdersList from "../pages/staff/OrdersList";
// import OrderCreate from "../pages/orders/OrderCreate";
// import OrderDetails from "../pages/orders/OrderDetails";

import StockPage from "../pages/stock/StockPage";
import Products from "../pages/products/Products";
import ShipmentsList from "../pages/shipments/ShipmentsList";
import ReportsDashboard from "../pages/reports/ReportsDashboard";

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

      {/* MAIN PROTECTED AREA */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route index element={<RoleHomeRedirect />} /> */}

        {/* ORDERS */}
       
      </Route>

      {/* MANAGER AREA */}
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
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>

      {/* STAFF AREA */}
      <Route
        path="/staff"
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
        <Route path="stock" element={<StaffStock />} />
      </Route>

      {/* ADMIN AREA */}
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