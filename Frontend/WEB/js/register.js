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
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (response.ok) {
        alert(responseText);
        window.location.href = "../LoginWEB/login.html";
      } else {
        alert("Error al registrarse: " + responseText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  });
});
