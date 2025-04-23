document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  if (!form) {
    console.error("No se encontró el formulario de registro.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      correo: formData.get("correo"),
      contraseña: formData.get("contraseña"),
    };

    try {
      const response = await fetch("https://java-backend-latest-9dhs.onrender.com/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Registro exitoso. Redirigiendo al login...");
        window.location.href = "../LoginWEB/login.html";
      } else {
        const error = await response.json();
        alert("Error al registrarse: " + (error.message || "Intente nuevamente."));
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  });
});
