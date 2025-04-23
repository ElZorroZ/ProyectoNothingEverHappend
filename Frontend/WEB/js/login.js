document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("No se encontró el formulario de login.");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/iniciosesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        localStorage.setItem("usuarioId", data.id); // Guardamos el ID en localStorage
        window.location.href = "../DashboardWEB/dashboard.html";
      } else {
        alert(data.mensaje || "Error al iniciar sesión.");
      }

    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error de red o del servidor.");
    }
  });
});
