import api from "./axios";

// monthly revenue
export const getMonthlyRevenue = async (month, year) => {
  const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
  return res.data;
};

// shipment profit
export const getShipmentProfit = async (id) => {
  const res = await api.get(`/reports/shipment/${id}/profit`);
  return res.data;
};

// warehouse report
export const getWarehouseReport = async (id) => {
  const res = await api.get(`/reports/warehouse/${id}`);
  return res.data;
};
