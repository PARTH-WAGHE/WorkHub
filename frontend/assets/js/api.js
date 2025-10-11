// API service for handling backend communication

const API_URL = "http://localhost:8080/api";

// Generic API request function with authentication
async function apiRequest(endpoint, method = "GET", data = null) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/pages/login.html";
      return null;
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Check if response is empty
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return {};
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Authentication services
const AuthService = {
  login: async (username, password) => {
    try {
      const data = await apiRequest("/auth/login", "POST", {
        username,
        password,
      });
      if (data && data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  },

  register: async (userData) => {
    return apiRequest("/auth/register", "POST", userData);
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  },
};

// Employee services
const EmployeeService = {
  getAllEmployees: async (
    page = 0,
    size = 10,
    searchTerm = "",
    department = "",
    status = ""
  ) => {
    let endpoint = `/employees?page=${page}&size=${size}`;

    if (searchTerm) {
      endpoint += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (department) {
      endpoint += `&department=${encodeURIComponent(department)}`;
    }

    if (status) {
      endpoint += `&status=${encodeURIComponent(status)}`;
    }

    return apiRequest(endpoint);
  },

  getEmployeeById: async (id) => {
    return apiRequest(`/employees/${id}`);
  },

  createEmployee: async (employeeData) => {
    return apiRequest("/employees", "POST", employeeData);
  },

  updateEmployee: async (id, employeeData) => {
    return apiRequest(`/employees/${id}`, "PUT", employeeData);
  },

  deleteEmployee: async (id) => {
    return apiRequest(`/employees/${id}`, "DELETE");
  },

  getRecentEmployees: async (limit = 5) => {
    return apiRequest(`/employees/recent?limit=${limit}`);
  },
};

// Department services
const DepartmentService = {
  getAllDepartments: async () => {
    return apiRequest("/departments");
  },

  getDepartmentById: async (id) => {
    return apiRequest(`/departments/${id}`);
  },

  createDepartment: async (departmentData) => {
    return apiRequest("/departments", "POST", departmentData);
  },

  updateDepartment: async (id, departmentData) => {
    return apiRequest(`/departments/${id}`, "PUT", departmentData);
  },

  deleteDepartment: async (id) => {
    return apiRequest(`/departments/${id}`, "DELETE");
  },
};

// Export services
window.AuthService = AuthService;
window.EmployeeService = EmployeeService;
window.DepartmentService = DepartmentService;
