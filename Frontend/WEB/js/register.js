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
      const response = await fetch("https://java-backend-latest-2zck.onrender.com/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();  // Obtener la respuesta como texto

      if (response.ok) {
        alert(responseText);  // Mostrar el mensaje que devolvió el backend
        window.location.href = "../LoginWEB/login.html";  // Redirigir
      } else {
        alert("Error al registrarse: " + responseText);  // Mostrar el mensaje de error
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  });
});
