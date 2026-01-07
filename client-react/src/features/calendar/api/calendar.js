const BASE = import.meta.env.VITE_API_BASE_URL;

function normalize(data) {
  if (data == null) return [];
  return Array.isArray(data) ? data : [data];
}

async function req(path, options = {}, label = "request") {
  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
    let message = `${label} failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body?.details || body?.error || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// MODIF: plus de filtre month, on récupère tout
export async function getCalendar() {
  const data = await req(`/calendar`, {}, "GET /calendar");
  return normalize(data);
}

export async function createEvent(payload) {
  return req(
    "/calendar",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "POST /calendar"
  );
}

export async function updateEvent(id, payload) {
  return req(
    `/calendar/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    `PUT /calendar/${id}`
  );
}

export async function deleteEvent(id) {
  await req(`/calendar/${id}`, { method: "DELETE" }, `DELETE /calendar/${id}`);
  return true;
}
