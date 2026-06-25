import api from "./axios";

// Admin dashboard stats
export const getAdminReport = async () => {
  const res = await api.get("/reports/admin");
  return res.data;
};

// Manager warehouse report
export const getManagerReport = async () => {
  const res = await api.get("/reports/manager");
  return res.data;
};

// Stock movement report
export const getStockReport = async () => {
  const res = await api.get("/reports/stock");
  return res.data;
};

// Order report
export const getOrderReport = async () => {
  const res = await api.get("/reports/orders");
  return res.data;
};
