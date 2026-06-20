import api from "./axios";

// get all shipments
export const getShipments = async () => {
  const res = await api.get("/shipments");
  return res.data;
};

// create shipment
export const createShipment = async (data) => {
  const res = await api.post("/shipments", data);
  return res.data;
};

// dispatch shipment
export const dispatchShipment = async (id) => {
  const res = await api.put(`/shipments/${id}/dispatch`);
  return res.data;
};
