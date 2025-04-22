document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const logoutBtn = document.querySelector('.logout-btn');
  const form = document.getElementById('crearProyectoForm');
  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');

  // Abrir/cerrar panel de notificaciones
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Previene que se cierre inmediatamente
    panel.classList.toggle('open');
  });

  // Cerrar panel si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Actualizar mínimo permitido en la fecha de fin
  fechaInicioInput.addEventListener('change', () => {
    fechaFinInput.min = fechaInicioInput.value;
  });

  // Validación al enviar el formulario
  form.addEventListener('submit', function (e) {
    const fechaInicio = new Date(fechaInicioInput.value);
    const fechaFin = new Date(fechaFinInput.value);

    if (fechaFin < fechaInicio) {
      alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      e.preventDefault(); // Evita el envío
    }
  });
});
