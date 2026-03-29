const API_BASE = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");
const base = `${API_BASE}/api/employees`;
const adminBase = `${API_BASE}/api/admin/employees`;

export async function listEmployees() {
  const res = await fetch(base);
  if (!res.ok) throw new Error("Failed to load employees");
  return res.json();
}

export async function createEmployee(emp) {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emp),
  });

  if (!res.ok) {
    let msg = "Registration failed";
    try {
      const data = await res.json();
      if (data?.error) {
        msg = data.error;
      } else if (
        res.status === 409 ||
        (data?.message && data.message.includes("Duplicate entry"))
      ) {
        msg = "Email already exists. Please use a different email address.";
      } else if (data?.message && data.message.includes("email")) {
        msg = "Email already exists. Please use a different email address.";
      }
    } catch (_) {
      // If response is not JSON, check status codes
      if (res.status === 409) {
        msg = "Email already exists. Please use a different email address.";
      } else if (res.status === 400) {
        msg = "Invalid registration data. Please check your input.";
      }
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function updateEmployee(id, emp) {
  const res = await fetch(`${base}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(emp),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`${base}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let msg = "Login failed";
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch (_) {
      // ignore parse error, keep default message
    }
    if (res.status === 404 || res.status === 401) {
      throw new Error(msg);
    }
    throw new Error(msg);
  }

  return res.json();
}

export function getGoogleAuthStartUrl(mode = "login") {
  const normalizedMode = mode === "register" ? "register" : "login";
  return `${API_BASE}/api/auth/google/start?mode=${encodeURIComponent(
    normalizedMode
  )}`;
}

export async function exchangeGoogleAuthToken(token) {
  const res = await fetch(
    `${API_BASE}/api/auth/google/exchange?token=${encodeURIComponent(token)}`
  );

  if (!res.ok) {
    let msg = "Google sign-in failed";
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch (_) {
      // ignore
    }
    throw new Error(msg);
  }

  return res.json();
}

// Admin functions
export async function adminListEmployees() {
  const res = await fetch(adminBase);
  if (!res.ok) throw new Error("Failed to load employees");
  return res.json();
}

export async function adminDeleteEmployee(id) {
  const res = await fetch(`${adminBase}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}
