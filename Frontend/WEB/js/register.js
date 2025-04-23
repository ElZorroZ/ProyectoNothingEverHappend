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
        const result = await response.text(); // en vez de .json()
        alert("Registro exitoso. Redirigiendo al login...");
        window.location.href = "../LoginWEB/login.html";
      } else {
        const error = await response.text(); // si devuelve texto o int también
        alert("Error al registrarse: " + error);
      }      
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  });
});
