const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');

// Botón de notificaciones
notifBtn.addEventListener('click', () => {
  panel.classList.toggle('open');
});

// Cierra panel de notificaciones si se hace clic afuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const tareaID = localStorage.getItem("tareaSeleccionadaID");

  const form = document.getElementById("modificar_tarea");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga de página

    // Confirmación antes de modificar
    const confirmacion = confirm("¿Estás seguro de realizar las modificaciones?");
    if (!confirmacion) {
      return; // Si no confirma, no hace nada
    }

    // Tomar los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;
    const archivoPdf = document.getElementById("archivoPdf").files[0];

    const formData = new FormData();
    formData.append("id", tareaID);
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("fechaVencimiento", fechaVencimiento);
    if (archivoPdf) {
      formData.append("archivoPdf", archivoPdf);
    }

    try {
      const response = await fetch("https://tu-servidor.com/tareas/modificar", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("Tarea modificada correctamente");
        window.location.href = "../TareasWEB/tareas.html";
      } else {
        const error = await response.text();
        alert("Error al modificar la tarea: " + error);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de red o del servidor.");
    }
  });
});
