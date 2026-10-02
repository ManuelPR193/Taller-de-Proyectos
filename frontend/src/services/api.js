const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error en el inicio de sesión");
    return data;
  },
  register: async (email, password, rol, nombre_completo) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rol, nombre_completo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error en el registro de cuenta");
    return data;
  },

  // Vehicles (RF-001)
  getVehicles: async () => {
    const res = await fetch(`${API_BASE_URL}/vehicles/`);
    return await res.json();
  },
  createVehicle: async (vehData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar vehículo");
    return data;
  },

  // Drivers (RF-008)
  getDrivers: async () => {
    const res = await fetch(`${API_BASE_URL}/drivers/`);
    return await res.json();
  },
  createDriver: async (drvData) => {
    const res = await fetch(`${API_BASE_URL}/drivers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drvData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar conductor");
    return data;
  },

  // Clients
  getClients: async () => {
    const res = await fetch(`${API_BASE_URL}/clients/`);
    return await res.json();
  },
  createClient: async (cliData) => {
    const res = await fetch(`${API_BASE_URL}/clients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar cliente");
    return data;
  },

  // Orders (RF-002)
  getOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders/`);
    return await res.json();
  },
  createOrder: async (ordData) => {
    const res = await fetch(`${API_BASE_URL}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ordData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al registrar pedido");
    return data;
  },

  // Routes (RF-003, RF-004, RF-007)
  getRoutes: async () => {
    const res = await fetch(`${API_BASE_URL}/routes/`);
    return await res.json();
  },
  generateRoutes: async () => {
    const res = await fetch(`${API_BASE_URL}/routes/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al generar rutas");
    return data;
  },
  confirmDelivery: async (ruta_detalle_id, latitud, longitud) => {
    const res = await fetch(`${API_BASE_URL}/routes/deliver-confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruta_detalle_id, latitud, longitud })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al confirmar entrega");
    return data;
  },
  insertExpressOrder: async (pedido_id) => {
    const res = await fetch(`${API_BASE_URL}/routes/reoptimize-express`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedido_id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al insertar pedido express");
    return data;
  },

  // Dashboard (RF-005)
  getDashboardMetrics: async () => {
    const res = await fetch(`${API_BASE_URL}/dashboard/metrics`);
    return await res.json();
  },

  // PDF Report Download (RF-006)
  getPDFReportUrl: () => `${API_BASE_URL}/reports/sostenibilidad/pdf`
};
