function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  // Send this token to your backend to verify and create a session
  fetch("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: response.credential }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Backend authentication failed");
      }
      return res.json();
    })
    .then((data) => {
      // Assuming the backend returns a JWT token for your app
      localStorage.setItem("app_token", data.token);
      // Redirect to the main application page
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    });
}
