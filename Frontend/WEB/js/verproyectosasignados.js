const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');

// Funcionalidad de notificaciones
notifBtn.addEventListener('click', () => {
  panel.classList.toggle('open');
});

// Cerrar panel de notificaciones si se hace clic fuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Modal para agregar usuario
function openModal() {
  document.getElementById("addUserModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addUserModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("addUserModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Lógica para manejar el envío del formulario de agregar usuario
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("userForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Capturar los valores del formulario
    const proyecto = document.getElementById("proyecto").value;
    const email = document.getElementById("email").value;
    
    // Aquí puedes agregar la lógica para enviar estos datos al backend (fetch, AJAX, etc.)
    alert("Usuario agregado: \nProyecto: " + proyecto + "\nEmail: " + email);
    
    form.reset(); // Limpiar el formulario
    closeModal(); // Cerrar el modal
  });
});
