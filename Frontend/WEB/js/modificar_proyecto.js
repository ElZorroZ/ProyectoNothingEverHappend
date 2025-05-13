const ProyectoID = localStorage.getItem("proyectoSeleccionadoID");
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
document.addEventListener("DOMContentLoaded", () => {
  const ProyectoID = localStorage.getItem("proyectoSeleccionadoID");

  const form = document.getElementById("modificarProyectoForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga de página

    // Tomar los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    // Armar el objeto del proyecto
    const proyectoModificado = {
      id: ProyectoID,
      nombre,
      descripcion,
      fechaInicio,
      fechaFin
    };

    try {
      const response = await fetch("https://tu-servidor.com/proyectos/modificar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proyectoModificado)
      });

      if (response.ok) {
        alert("Proyecto modificado correctamente");
        window.location.href = "../VerProyectosAsignadosWEB/verproyectosasignados.html";
      } else {
        const error = await response.text();
        alert("Error al modificar el proyecto: " + error);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de red o del servidor.");
    }
  });
});
