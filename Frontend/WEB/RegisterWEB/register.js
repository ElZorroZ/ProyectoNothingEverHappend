document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      fetch("http://localhost:8080/tu-app/RegistroServlet", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Error en el registro.");
          }
        })
        .then((data) => {
          alert("Registro exitoso");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error(error);
          alert("Error al registrar usuario.");
        });
    });
  });
  