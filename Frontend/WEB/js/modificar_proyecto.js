document.addEventListener("DOMContentLoaded", () => {
  const proyectoID = localStorage.getItem("proyectoSeleccionadoID");
  const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');
  const form = document.getElementById("modificarProyectoForm");
  const idUsuario = localStorage.getItem('usuarioId');


  if (!fechaInicioInput || !fechaFinInput || !form) {
    console.error("Elementos del formulario no encontrados en el DOM.");
    return;
  }

  // Actualizar mínimo permitido en la fecha de fin cuando cambia la fecha de inicio
  fechaInicioInput.addEventListener('change', () => {
    fechaFinInput.min = fechaInicioInput.value;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fechaInicio = new Date(fechaInicioInput.value);
    const fechaFin = new Date(fechaFinInput.value);

    if (fechaFin < fechaInicio) {
      alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    const proyectoData = {
      proyectoID,
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      fechaInicio: fechaInicioInput.value,
      fechaFinal: fechaFinInput.value,
      id: idUsuario // Asegurate de que esta variable esté definida
    };

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/modificarproyecto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proyectoData)
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
