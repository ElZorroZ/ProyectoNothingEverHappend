const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const form = document.getElementById('crearProyectoForm');
  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');
  
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
      e.preventDefault();
      return;
    }

    // Preparar los datos para el backend
    const tareaData = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      fechaInicio: fechaInicioInput.value,
      fechaFinal: fechaFinInput.value,
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

    e.preventDefault();
  });