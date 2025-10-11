const base = "/api/employees";

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
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}
