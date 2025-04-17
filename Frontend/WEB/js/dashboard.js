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