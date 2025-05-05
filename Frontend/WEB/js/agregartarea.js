const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const form = document.getElementById('crearTareaForm');
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

  // En este ejemplo no hay fechaInicio en el formulario, así que lo eliminamos
  const fechaVencimiento = new Date(fechaVencimientoInput.value);

  // Obtener el valor numérico de la prioridad
  const prioridadTexto = prioridadSelect.value;
  let prioridadNum;

  switch (prioridadTexto) {
    case 'Baja':
      prioridadNum = 1;
      break;
    case 'Media':
      prioridadNum = 2;
      break;
    case 'Alta':
      prioridadNum = 3;
      break;
    default:
      alert('Debe seleccionar una prioridad válida.');
      return;
  }

  const tareaData = {
    ProyectoID: localStorage.getItem("proyectoSeleccionadoID"),
    Nombre: document.getElementById('titulo').value,
    Descripcion: document.getElementById('detalle').value,
    Prioridad: prioridadNum,
    Estado: "1",
    Vencimiento: fechaVencimientoInput.value

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
