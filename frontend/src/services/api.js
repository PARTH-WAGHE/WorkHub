const base = "/api/employees";
const adminBase = "/api/admin/employees";

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
  if (!res.ok) throw new Error("Create failed");
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
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 404) {
      const data = await res.json();
      throw new Error(
        data.error || "User not registered. Please create an account."
      );
    }
    if (res.status === 401) {
      const data = await res.json();
      throw new Error(data.error || "Invalid password");
    }
    throw new Error("Login failed");
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
