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
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro de realizar las modificaciones?");
    if (!confirmacion) return;

    // Obtener los datos que sí quieres modificar
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;

    // Crear objeto con solo esos campos
    const tarea = {
      TareaID: parseInt(tareaID),
      Nombre: nombre,
      Descripcion: descripcion,
      Vencimiento: fechaVencimiento,
    };

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/modificartarea", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarea),
      });

      if (response.ok) {
        alert("Tarea modificada correctamente");
        window.location.href = "../TareasWEB/tareas.html";
      } else {
        const error = await response.text();
        console.error("Error en respuesta:", response.status, error);
        alert("Error al modificar la tarea: " + error);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de red o del servidor.");
    }
  });
});


