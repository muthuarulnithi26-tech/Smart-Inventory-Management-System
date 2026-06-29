import api from "./axios";

// GET all shipments
export const getShipments = async () => {
  const res = await api.get("/shipments/");
  return res.data;
};

// CREATE shipment
export const dispatchShipment = async (orderId, vehicleType) => {
  const res = await api.post(
    `/shipments/?order_id=${orderId}&vehicle_type=${vehicleType}`
  );
  return res.data;
};

// UPDATE status
export const updateShipmentStatus = async (shipmentId, status) => {
  const res = await api.put(
    `/shipments/${shipmentId}/status?status=${status}`
  );

  return res.data;
};
// GET single shipment
export const getShipmentById = async (shipmentId) => {
  const res = await api.get(`/shipments/${shipmentId}`);
  return res.data;
};
