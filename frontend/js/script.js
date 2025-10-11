document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("app_token");
  if (!token) {
    // If no token, redirect to login page
    window.location.href = "/login.html";
    return;
  }

  const employeeTableBody = document.querySelector("#employee-table tbody");
  const employeeForm = document.getElementById("employee-form");
  const logoutButton = document.getElementById("logout-button");

  const apiHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch and display employees
  function getEmployees() {
    fetch("/api/employees", { headers: apiHeaders })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("app_token");
          window.location.href = "/login.html";
        }
        return response.json();
      })
      .then((data) => {
        employeeTableBody.innerHTML = "";
        data.forEach((employee) => {
          const row = `<tr>
                        <td>${employee.id}</td>
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.jobTitle}</td>
                        <td>
                            <button onclick="editEmployee(${employee.id})">Edit</button>
                            <button onclick="deleteEmployee(${employee.id})">Delete</button>
                        </td>
                    </tr>`;
          employeeTableBody.innerHTML += row;
        });
      });
  }

  // Handle form submission for add/edit
  employeeForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("employee-id").value;
    const employeeData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      jobTitle: document.getElementById("job-title").value,
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/employees/${id}` : "/api/employees";

    fetch(url, {
      method: method,
      headers: apiHeaders,
      body: JSON.stringify(employeeData),
    }).then(() => {
      employeeForm.reset();
      getEmployees();
    });
  });

  // Logout
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("app_token");
    window.location.href = "/login.html";
  });

  getEmployees();
});

// Placeholder for edit/delete functions
function editEmployee(id) {
  // Fetch employee by id and populate form
  console.log("Editing employee", id);
}

function deleteEmployee(id) {
  // Send delete request
  console.log("Deleting employee", id);
}
