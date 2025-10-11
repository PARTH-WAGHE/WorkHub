// Authentication handler for login, registration, and user sessions

document.addEventListener("DOMContentLoaded", function () {
  // Get the login form
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Check if user is already logged in
  const token = localStorage.getItem("auth_token");
  if (token) {
    window.location.href = "../pages/dashboard.html";
  }
});

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showMessage("Please enter both username and password", "error");
    return;
  }

  try {
    // Show loading state
    showLoadingState(true);

    // Call the login API
    const user = await AuthService.login(username, password);

    if (user) {
      // Redirect to dashboard on success
      window.location.href = "../pages/dashboard.html";
    } else {
      showMessage("Invalid username or password", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage("Login failed. Please try again later.", "error");
  } finally {
    showLoadingState(false);
  }
}

// Show loading state
function showLoadingState(isLoading) {
  const loginButton = document.querySelector(
    '#loginForm button[type="submit"]'
  );

  if (loginButton) {
    if (isLoading) {
      loginButton.textContent = "Logging in...";
      loginButton.disabled = true;
    } else {
      loginButton.textContent = "Login";
      loginButton.disabled = false;
    }
  }
}

// Show success or error messages
function showMessage(message, type = "success") {
  // Check if message element exists
  let messageElement = document.querySelector(".message");

  // If not, create one
  if (!messageElement) {
    messageElement = document.createElement("div");
    messageElement.className = "message";

    const form = document.getElementById("loginForm");
    form.parentNode.insertBefore(messageElement, form);
  }

  // Set message content and style
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;

  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageElement.style.opacity = "0";
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, 5000);
}
