import api from "./axios";

/* ===========================
   STAFF DASHBOARD
=========================== */

export const getStaffDashboard = async () => {
  const res = await api.get("/staff/dashboard");
  return res.data;
};

/* ===========================
   MY ORDERS
=========================== */

export const getMyOrders = async () => {
  const res = await api.get("/staff/orders");
  return res.data;
};

/* ===========================
   ORDER DETAILS
=========================== */

export const getOrderDetails = async (orderId) => {
  const res = await api.get(`/staff/orders/${orderId}`);
  return res.data;
};

/* ===========================
   WAREHOUSE STOCK
=========================== */

export const getWarehouseStock = async () => {
  const res = await api.get("/staff/stock");
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const addOrderItem = async (orderId, data) => {
  const res = await api.post(`/orders/${orderId}/items`, data);
  return res.data;
};
