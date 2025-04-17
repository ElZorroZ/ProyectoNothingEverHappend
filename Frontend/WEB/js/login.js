document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("No se encontró el formulario de login.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Inicio de sesión exitoso");
    window.location.href = "../DashboardWEB/dashboard.html"; 
  });
});
