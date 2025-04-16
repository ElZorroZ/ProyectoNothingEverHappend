document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      fetch("http://localhost:8080/tu-app/InicioSesionServlet", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Error en el inicio de sesión.");
          }
        })
        .then((data) => {
          alert("Inicio de sesión exitoso");
          window.location.href = "dashboard.html"; 
        })
        .catch((error) => {
          console.error(error);
          alert("Error al iniciar sesión.");
        });
    });
  });
  