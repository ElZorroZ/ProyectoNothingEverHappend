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
console.log("modificar_tarea.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  // Obtener parámetro tarea de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const tareaID = urlParams.get("tarea");

  console.log("tareaID desde URL:", tareaID);

  if (!tareaID) {
    alert("No se encontró el ID de la tarea a modificar en la URL.");
    return;
  }

  const form = document.getElementById("modificar_tarea");
  if (!form) {
    console.error("No se encontró el formulario con id 'modificar_tarea'");
    return;
  }

  // Opcional: si quieres que los campos se llenen con datos existentes,
  // aquí podrías hacer fetch para traer la tarea y llenar inputs

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro de realizar las modificaciones?");
    if (!confirmacion) return;

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;

    const tarea = {
      TareaID: parseInt(tareaID),
      Nombre: nombre,
      Descripcion: descripcion,
      Vencimiento: fechaVencimiento,
    };

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/modificartarea", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea),
      });

      if (response.ok) {
        alert("Tarea modificada correctamente");
        window.location.href = "../TareasWEB/tareas.html";
      } else {
        const error = await response.text();
        alert("Error al modificar la tarea: " + error);
      }
    } catch (error) {
      alert("Error de red o del servidor.");
    }
  });
});


