const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const form = document.getElementById('crearTareaForm');
const fechaInicioInput = document.getElementById('fechaInicio');
const fechaVencimientoInput = document.getElementById('fechaVencimiento');
const prioridadSelect = document.getElementById('prioridad');

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

// Validación al enviar el formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const fechaInicio = new Date(fechaInicioInput.value);
  const fechaVencimiento = new Date(fechaVencimientoInput.value);

  if (fechaVencimiento < fechaInicio) {
    alert('La fecha de vencimiento no puede ser anterior a la fecha de inicio.');
    return;
  }

  // Obtener datos del formulario
  const prioridad = prioridadSelect.value;

  const tareaData = {
    titulo: document.getElementById('titulo').value,
    detalle: document.getElementById('detalle').value,
    fechaInicio: fechaInicioInput.value,
    fechaVencimiento: fechaVencimientoInput.value,
    prioridad: prioridad  
  };

  fetch('https://java-backend-latest-rm0u.onrender.com/api/creartarea', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tareaData)
  })
    .then(response => {
      if (response.ok) {
        alert('Tarea creada con éxito');
        form.reset();
      } else {
        response.text().then(text => {
          console.error('Error del servidor:', text);
          alert('Hubo un error al crear la tarea: ' + text);
        });
      }
    })
    .catch(error => {
      console.error('Error al enviar la solicitud:', error);
      alert('Error al crear la tarea');
    });
});
