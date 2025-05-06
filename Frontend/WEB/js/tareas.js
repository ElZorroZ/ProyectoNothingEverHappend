const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');

// Modal de Asignar Tarea
const assignTaskModal = document.getElementById('assignTaskModal');
const assignTaskForm = document.getElementById('assignTaskForm');

// Función para abrir el modal
function openAssignTaskModal() {
  assignTaskModal.style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
  assignTaskModal.style.display = 'none';
}

// Cerrar el modal si se hace clic afuera
window.onclick = function(event) {
  if (event.target == assignTaskModal) {
    assignTaskModal.style.display = 'none';
  }
}

// Evento para enviar el formulario de asignación (con conexión al backend)
assignTaskForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;

  // Reemplazá esto con el ID real de la tarea que quieras asignar
  const tareaID = 1;

  try {
    const response = await fetch('https://java-backend-latest-rm0u.onrender.com/api/agregartareausuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        tareaID: tareaID
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        alert('Tarea asignada exitosamente');
        closeModal();
      } else {
        alert('Error al asignar tarea: ' + (data.message || 'desconocido'));
      }
    } else {
      alert('Error de conexión con el servidor');
    }
  } catch (error) {
    console.error('Error al asignar tarea:', error);
    alert('Ocurrió un error al intentar asignar la tarea');
  }
});

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

// Filtro de tareas
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    // Marcar botón activo
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Mostrar u ocultar tareas
    taskCards.forEach(card => {
      const status = card.getAttribute('data-status');

      if (filter === 'todas' || filter === status) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const allTasks = document.querySelectorAll(".task-card");
  const completedTasks = document.querySelectorAll('.task-card[data-status="completada"]');

  const total = allTasks.length;
  const completadas = completedTasks.length;

  let porcentaje = 0;
  if (total > 0) {
    porcentaje = Math.round((completadas / total) * 100);
  }

  const fill = document.getElementById("progressFill");
  fill.style.width = porcentaje + "%";
  fill.textContent = porcentaje + "%";
});

