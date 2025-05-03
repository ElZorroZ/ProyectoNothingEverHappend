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

function closeModal() {
  document.getElementById("assignTaskModal").style.display = "none";
}



// Cerrar el modal si se hace clic afuera
window.onclick = function(event) {
  const modal = document.getElementById("addUserModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Evento para enviar el formulario de asignación (por ahora solo evitamos que recargue la página)
assignTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  
  // Acá podrías hacer un fetch() o lo que necesites para asignar la tarea
  console.log(`Asignando tarea a: ${email}`);
  
  closeAssignTaskModal();
});

  notifBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Opción opcional: cerrar si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

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

