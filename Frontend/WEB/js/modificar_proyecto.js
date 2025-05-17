document.addEventListener("DOMContentLoaded", () => {
  const proyectoID = localStorage.getItem("proyectoSeleccionadoID");
  const notifBtn = document.querySelector('.notif-btn');
  const panel = document.getElementById('notificationPanel');
  const fechaInicioInput = document.getElementById('fechaInicio');
  const fechaFinInput = document.getElementById('fechaFin');
  const form = document.getElementById("modificarProyectoForm");
  const idUsuario = localStorage.getItem('usuarioId');
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

  if (!fechaInicioInput || !fechaFinInput || !form) {
    console.error("Elementos del formulario no encontrados en el DOM.");
    return;
  }

  // Actualizar mínimo permitido en la fecha de fin cuando cambia la fecha de inicio
  fechaInicioInput.addEventListener('change', () => {
    fechaFinInput.min = fechaInicioInput.value;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fechaInicio = new Date(fechaInicioInput.value);
    const fechaFin = new Date(fechaFinInput.value);

    if (fechaFin < fechaInicio) {
      alert('La fecha de finalización no puede ser anterior a la fecha de inicio.');
      return;
    }

    const proyectoData = {
      proyectoID,
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      fechaInicio: fechaInicioInput.value,
      fechaFinal: fechaFinInput.value,
      id: idUsuario // Asegurate de que esta variable esté definida
    };

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/modificarproyecto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proyectoData)
      });

      if (response.ok) {
        alert("Proyecto modificado correctamente");
        window.location.href = "../VerProyectosAsignadosWEB/verproyectosasignados.html";
      } else {
        const error = await response.text();
        alert("Error al modificar el proyecto: " + error);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de red o del servidor.");
    }
  });
});
