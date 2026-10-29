const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.origin.includes(':5173')
    ? 'http://127.0.0.1:8000/api/v1'
    : '/api/v1'
);

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });
async function read(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'No se pudo cargar la información');
  return data;
}
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error en el inicio de sesión");
    return data;
  },
  register: async (email, password, rol, nombre_completo) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify({ email, password, rol, nombre_completo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error en el registro de cuenta");
    return data;
  },

  // Vehicles (RF-001)
  getVehicles: () => read('/vehicles/'),
  createVehicle: async (vehData) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify(vehData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar vehículo");
    return data;
  },
  updateVehicleStatus: async (id, estado) => {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}/status`, {
      method: 'PATCH', headers: {...headers(), 'Content-Type':'application/json'},
      body: JSON.stringify({estado})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'No se pudo actualizar el vehículo');
    return data;
  },

  // Drivers (RF-008)
  getDrivers: () => read('/drivers/'),
  createDriver: async (drvData) => {
    const res = await fetch(`${API_BASE_URL}/drivers/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify(drvData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar conductor");
    return data;
  },

  // Clients
  getClients: () => read('/clients/'),
  createClient: async (cliData) => {
    const res = await fetch(`${API_BASE_URL}/clients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify(cliData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al guardar cliente");
    return data;
  },

  // Orders (RF-002)
  getOrders: () => read('/orders/'),
  createOrder: async (ordData) => {
    const res = await fetch(`${API_BASE_URL}/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify(ordData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al registrar pedido");
    return data;
  },

  // Routes (RF-003, RF-004, RF-007)
  getRoutes: (fecha) => read(`/routes/${fecha ? `?fecha=${fecha}` : ''}`),
  getTraffic: (id) => read(`/routes/${id}/traffic`),
  setTraffic: async (id, segment, nivel, fuente) => {
    const r = await fetch(`${API_BASE_URL}/routes/${id}/traffic/${segment}`, {
      method: 'PUT', headers: {...headers(), 'Content-Type':'application/json'}, body: JSON.stringify({nivel, fuente}) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.detail || 'No se pudo guardar');
    return data;
  },
  linkDriver: async (id, email) => {
    const r = await fetch(`${API_BASE_URL}/drivers/${id}/account`, {
      method: 'PUT', headers: {...headers(), 'Content-Type':'application/json'}, body: JSON.stringify({email}) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.detail || 'No se pudo vincular');
    return data;
  },
  generateRoutes: async () => {
    const res = await fetch(`${API_BASE_URL}/routes/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al generar rutas");
    return data;
  },
  confirmDelivery: async (ruta_detalle_id, latitud, longitud) => {
    const res = await fetch(`${API_BASE_URL}/routes/deliver-confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify({ ruta_detalle_id, latitud, longitud })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al confirmar entrega");
    return data;
  },
  insertExpressOrder: async (pedido_id) => {
    const res = await fetch(`${API_BASE_URL}/routes/reoptimize-express`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) },
      body: JSON.stringify({ pedido_id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error al insertar pedido express");
    return data;
  },

  // Dashboard (RF-005)
  getDashboardMetrics: (start, end) => read(`/dashboard/metrics?${new URLSearchParams({...(start ? {fecha_inicio:start}:{}), ...(end ? {fecha_fin:end}:{})})}`),
  getPDFReportUrl: () => `${API_BASE_URL}/reports/sostenibilidad/pdf`,
  downloadPDF: async (start, end) => {
    const r = await fetch(`${API_BASE_URL}/reports/sostenibilidad/pdf?${new URLSearchParams({fecha_inicio:start, fecha_fin:end})}`, {headers: headers()});
    if (!r.ok) { const data = await r.json(); throw new Error(data.detail || 'Error al generar PDF'); }
    if (!r.headers.get('content-type')?.includes('application/pdf')) throw new Error('El servidor no devolvi? un PDF');
    const url = URL.createObjectURL(await r.blob());
    const link = document.createElement('a'); link.href = url;
    link.download = `Sostenibilidad_${start}_${end}.pdf`; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
};
