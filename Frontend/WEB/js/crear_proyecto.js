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

  // Función para convertir la fecha al formato YYYY/MM/DD
  function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}/${mes}/${dia}`;
  }

    // Validación al enviar el formulario
  form.addEventListener('submit', function (e) {
    const fechaInicio = new Date(fechaInicioInput.value);
    const fechaFin = new Date(fechaFinInput.value);

    if (fechaFin < fechaInicio) {
      alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      e.preventDefault(); // Evita el envío
    } else {
      // Preparar los datos para el backend
      const proyectoData = {
        nombre: form.nombre.value,
        descripcion: form.descripcion.value,
        fechaInicio: fechaInicioInput.value, // en formato yyyy-MM-dd
        fechaFin: fechaFinInput.value
      };

      // Enviar los datos al servidor usando fetch
      fetch('https://java-backend-latest-rm0u.onrender.com/api/crearproyecto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proyectoData)
      })
      .then(response => {
        if (response.ok) {
          alert('Proyecto creado con éxito');
          form.reset(); // Limpiar el formulario
        } else {
          response.text().then(text => {
            console.error('Error del servidor:', text);
            alert('Hubo un error al crear el proyecto: ' + text);
          });
        }
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al crear el proyecto');
      });

      e.preventDefault(); // Evitar el envío tradicional del formulario
    }
  });

});
