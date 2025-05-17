const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const form = document.getElementById('crearTareaForm');
const fechaVencimientoInput = document.getElementById('fechaVencimiento');
const prioridadSelect = document.getElementById('prioridad');
let nuevasNotificaciones = false;

// Conexión al servidor WebSocket usando SockJS y STOMP
const socket = new SockJS("https://java-backend-latest-rm0u.onrender.com/endpoint");
const stompClient = Stomp.over(socket);
const usuarioId = localStorage.getItem('usuarioId'); // Obtener el ID del usuario almacenado

// Verificar si el usuario está autenticado
if (!usuarioId) {
    console.log("⚠️ Usuario no autenticado.");
    window.location.href = "../index.html";
}

// Establecer la conexión con WebSocket
stompClient.connect({}, () => {
    console.log("✅ Conexión WebSocket establecida...");
    
    // Suscribirse al canal de notificaciones del usuario
    stompClient.subscribe(`/topic/notificaciones/${usuarioId}`, (message) => {
        const notificacion = JSON.parse(message.body);
        mostrarNotificacion(notificacion.titulo, notificacion.mensaje);
    });
});

// Actualizar la campana de notificaciones
function actualizarCampana() {
    const campana = document.querySelector('.notif-btn');
    const lista = document.getElementById('notificationPanel').querySelector("ul");

    // Mostrar el punto rojo si hay notificaciones
    if (lista.children.length > 0 && lista.children[0].textContent !== 'No tenés nuevas notificaciones.') {
        campana.classList.add('nueva-notificacion');
    } else {
        campana.classList.remove('nueva-notificacion');
    }
}

// Mostrar notificación en el DOM
function mostrarNotificacion(titulo, mensaje) {
    const panel = document.getElementById('notificationPanel');
    const lista = panel.querySelector("ul");

    // Crear el elemento de la notificación
    const li = document.createElement("li");
    li.className = 'notificacion';

    // Crear el título
    const tituloElemento = document.createElement("h4");
    tituloElemento.textContent = titulo;

    // Crear el mensaje
    const mensajeElemento = document.createElement("p");
    mensajeElemento.textContent = mensaje;

    // Crear el botón de cierre (icono de basura)
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

    // Añadir el botón y el contenido a la notificación
    li.appendChild(botonCerrar);
    li.appendChild(tituloElemento);
    li.appendChild(mensajeElemento);

    // Verificar si la lista está vacía
    if (lista.querySelector('li')?.textContent === 'No tenés nuevas notificaciones.') {
        lista.innerHTML = '';
    }

    lista.appendChild(li);
    panel.classList.add('open');
    nuevasNotificaciones = true;
    actualizarCampana();
}




notifBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    nuevasNotificaciones = false;
    actualizarCampana(); // Actualiza la campana al abrir el panel
});

// Opción opcional: cerrar si se hace clic fuera
document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
        panel.classList.remove('open');
    }
});

// Validación al enviar el formulario
form.addEventListener('submit', function (e) {
  // Evita que se recargue la página al enviar el formulario
  e.preventDefault();

  // Obtiene la fecha de vencimiento ingresada por el usuario
  const fechaVencimiento = new Date(fechaVencimientoInput.value);

  // Obtiene el texto seleccionado en el campo de prioridad
  const prioridadTexto = prioridadSelect.value;
  let prioridadNum;

  // Convierte el texto de la prioridad a un número correspondiente
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
      // Muestra una alerta si no se seleccionó una prioridad válida
      alert('Debe seleccionar una prioridad válida.');
      return;
  }

  // Obtiene el archivo PDF cargado por el usuario (si hay uno)
  const archivo = document.getElementById('archivoPDF').files[0];

  // Crea un objeto FormData para enviar los datos al servidor
  const formData = new FormData();
  formData.append("ProyectoID", localStorage.getItem("proyectoSeleccionadoID")); // ID del proyecto seleccionado
  formData.append("Nombre", document.getElementById('titulo').value);           // Título de la tarea
  formData.append("Descripcion", document.getElementById('detalle').value);     // Descripción de la tarea
  formData.append("Prioridad", prioridadNum);                                    // Prioridad como número
  formData.append("Estado", "1");                                                // Estado inicial de la tarea (1 = pendiente, por ejemplo)
  formData.append("Vencimiento", fechaVencimientoInput.value);                  // Fecha de vencimiento
  formData.append("TareaID", "1");
  // Si el usuario subió un archivo, se agrega al formulario
  if (archivo) {
    formData.append("Archivo", archivo);
  }

  // Envia los datos al backend usando fetch con método POST
  fetch('https://java-backend-latest-rm0u.onrender.com/api/creartarea', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        // Si la respuesta fue exitosa, muestra un mensaje y limpia el formulario
        alert('Tarea creada con éxito');
        form.reset();
      } else {
        // Si hubo un error del servidor, se muestra el mensaje de error
        response.text().then(text => {
          console.error('Error del servidor:', text);
          alert('Hubo un error al crear la tarea: ' + text);
        });
      }
    })
    .catch(error => {
      // Si hubo un error en la solicitud (por ejemplo, red), se informa al usuario
      console.error('Error al enviar la solicitud:', error);
      alert('Error al crear la tarea');
    });
});
