// Main JavaScript file for the QUEUEFREE application

document.addEventListener("DOMContentLoaded", function () {
  // Initialize any animations or interactive elements
  initAnimations();

  // Check if user is logged in
  checkAuthStatus();
});

// Initialize animations and interactive elements
function initAnimations() {
  // Animate hero section
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.classList.add("animate-fade-in");
  }

  // Animate feature cards with a staggered delay
  const cards = document.querySelectorAll(".card");
  if (cards.length) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
      }, 100 * index);
    });
  }
}

// Check authentication status
function checkAuthStatus() {
  const token = localStorage.getItem("auth_token");
  const currentPath = window.location.pathname;

  // If on protected page but not authenticated
  if (!token && needsAuthentication(currentPath)) {
    window.location.href = "/pages/login.html";
  }

  // If authenticated but on login page
  if (token && currentPath.includes("login.html")) {
    window.location.href = "/pages/dashboard.html";
  }

  // Update UI based on authentication
  updateUIBasedOnAuth(!!token);
}

// Determine if the current path requires authentication
function needsAuthentication(path) {
  const protectedPaths = [
    "/pages/dashboard.html",
    "/pages/employees.html",
    "/pages/departments.html",
    "/pages/attendance.html",
    "/pages/settings.html",
  ];

  return protectedPaths.some((protectedPath) => path.includes(protectedPath));
}

// Update UI elements based on authentication status
function updateUIBasedOnAuth(isAuthenticated) {
  const loginBtn = document.querySelector(".login-btn");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (loginBtn) {
    loginBtn.style.display = isAuthenticated ? "none" : "block";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
}

// Logout function
function logout() {
  // Clear auth data
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");

  // Redirect to login
  window.location.href = "/pages/login.html";
}
