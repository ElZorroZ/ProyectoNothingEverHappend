const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');

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
