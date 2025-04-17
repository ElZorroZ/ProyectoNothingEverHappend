const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const logoutBtn = document.querySelector('.logout-btn');

  notifBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Opción opcional: cerrar si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  function cerrarSesion() {
    // Eliminar cookies o valores de sesión
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Eliminar cookie de sesión
    localStorage.removeItem("usuario"); // Eliminar del localStorage
    sessionStorage.removeItem("usuario"); // Eliminar del sessionStorage
    
    // Redirigir a la página principal
  window.location.href = "../index.html"; // Redirigir a index.html
}

// Añadir el evento al botón de "Cerrar Sesión"
logoutBtn.addEventListener('click', cerrarSesion);