document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const logoutBtn = document.querySelector('.logout-btn');
  const form = document.getElementById('crearProyectoForm');
  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');
  const idUsuario = localStorage.getItem('usuarioId'); // esto es un string
  let nuevasNotificaciones = false;

  const socket = new SockJS("https://java-backend-latest-rm0u.onrender.com/endpoint");
  const stompClient = Stomp.over(socket);
  const usuarioId = localStorage.getItem('usuarioId');

  if (!usuarioId) {
    console.log("⚠️ Usuario no autenticado.");
    window.location.href = "../index.html";
  }

  stompClient.connect({}, () => {
    console.log("✅ Conexión WebSocket establecida...");
    stompClient.subscribe(`/topic/notificaciones/${usuarioId}`, (message) => {
      const notificacion = JSON.parse(message.body);
      mostrarNotificacion(notificacion.titulo, notificacion.mensaje);
    });
  });

  function actualizarCampana() {
    if (!notifBtn) return;
    const lista = panel.querySelector("ul");
    if (lista.children.length > 0 && lista.children[0].textContent !== 'No tenés nuevas notificaciones.') {
      notifBtn.classList.add('nueva-notificacion');
    } else {
      notifBtn.classList.remove('nueva-notificacion');
    }
  }

  function mostrarNotificacion(titulo, mensaje) {
    const lista = panel.querySelector("ul");
    const li = document.createElement("li");
    li.className = 'notificacion';

    const tituloElemento = document.createElement("h4");
    tituloElemento.textContent = titulo;

    const mensajeElemento = document.createElement("p");
    mensajeElemento.textContent = mensaje;

    const botonCerrar = document.createElement('button');
    botonCerrar.innerHTML = '<i class="fas fa-trash"></i>';
    botonCerrar.className = 'cerrar-notificacion';
    botonCerrar.onclick = () => {
      li.remove();
      if (lista.children.length === 0) {
        lista.innerHTML = "<li>No tenés nuevas notificaciones.</li>";
      }
      actualizarCampana();
    };

    li.appendChild(botonCerrar);
    li.appendChild(tituloElemento);
    li.appendChild(mensajeElemento);

    if (lista.querySelector('li')?.textContent === 'No tenés nuevas notificaciones.') {
      lista.innerHTML = '';
    }

    lista.appendChild(li);
    panel.classList.add('open');
    nuevasNotificaciones = true;
    actualizarCampana();
  }

  // Abrir/cerrar panel de notificaciones
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
    nuevasNotificaciones = false;
    actualizarCampana();
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

  // Función para convertir la fecha al formato YYYY/MM/DD (opcional, no usada)
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
      e.preventDefault();
      return;
    }

    // Preparar los datos para el backend
    const proyectoData = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      fechaInicio: fechaInicioInput.value,
      fechaFinal: fechaFinInput.value,
      id: idUsuario 
    };

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
        form.reset();
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

    e.preventDefault();
  });
});
