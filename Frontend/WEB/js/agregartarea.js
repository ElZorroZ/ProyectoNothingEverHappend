const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');

  
// Abrir/cerrar panel de notificaciones
notifBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });
  
  // Cerrar panel si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });