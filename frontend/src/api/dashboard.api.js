import api from "./axios";

export const getDashboardData = async () => {
  const orders = await api.get("/orders");
  const shipments = await api.get("/shipments");
  const revenue = await api.get("/reports/monthly?month=6&year=2026");

  return {
    orders: orders.data,
    shipments: shipments.data,
    revenue: revenue.data
  };
};
