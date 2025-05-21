const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const logoutBtn = document.querySelector('.logout-btn');
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


document.addEventListener("DOMContentLoaded", () => {
  const usuarioID = localStorage.getItem("usuarioID") || localStorage.getItem("usuarioId");

  if (!usuarioID) return window.location.href = "../index.html";

  // Cargar notificaciones no leídas
  fetch(`https://java-backend-latest-rm0u.onrender.com/api/notificaciones/${usuarioID}`)
    .then(res => res.ok ? res.json() : Promise.reject("Error al obtener notificaciones"))
    .then(data => {
      const lista = document.getElementById("notificationPanel")?.querySelector("ul");
      if (!lista) return;

      lista.innerHTML = "";
      const notificaciones = data.notificaciones || [];

      if (notificaciones.length === 0) {
        lista.innerHTML = "<li>No tenés nuevas notificaciones.</li>";
      } else {
        notificaciones.forEach(n => {
          mostrarNotificacion(n.titulo, n.mensaje, n.notificacionID, n.fecha, false);
        });
      }

      // Luego de cargar notificaciones, conectar WebSocket
      connectWebSocket(usuarioID);
    })
    .catch(err => {
      console.error("❌ Error al cargar notificaciones:", err);
      connectWebSocket(usuarioID); // Aun si falla, conectar WebSocket
    });

  // Agregar comentario nuevo
  document.querySelector('.comment-submit-btn')?.addEventListener('click', addComment);
});


// Establecer la conexión con WebSocket
function connectWebSocket(usuarioID) {
  if (!usuarioID) {
    console.warn("⚠️ No se puede conectar al WebSocket: usuarioID inválido.");
    return;
  }

  const socket = new SockJS("https://java-backend-latest-rm0u.onrender.com/endpoint");
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("✅ Conexión WebSocket establecida...");

    stompClient.subscribe(`/topic/notificaciones/${usuarioID}`, (message) => {
      const notificacion = JSON.parse(message.body);
      mostrarNotificacion(
        notificacion.titulo,
        notificacion.mensaje,
        notificacion.notificacionID,
        notificacion.fecha,
        true
      );
    });
  }, (error) => {
    console.error("❌ Error en la conexión WebSocket:", error);
  });
}


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
function mostrarNotificacion(titulo, mensaje, id, fecha, abrir) {
    const panel = document.getElementById('notificationPanel');
    const lista = panel.querySelector("ul");

    // Crear el elemento de la notificación
    const li = document.createElement("li");
    li.className = 'notificacion';
    li.dataset.id = id;

    // Crear el título
    const tituloElemento = document.createElement("h4");
    tituloElemento.textContent = titulo;

    // Crear el mensaje
    const mensajeElemento = document.createElement("p");
    mensajeElemento.textContent = mensaje;

    // Crear la fecha
    const fechaElemento = document.createElement("small");
    fechaElemento.textContent = new Date(fecha).toLocaleDateString();

    // Crear el botón de cierre (icono de basura)
    const botonCerrar = document.createElement('button');
    botonCerrar.innerHTML = '<i class="fas fa-trash"></i>';
    botonCerrar.className = 'cerrar-notificacion';
    botonCerrar.onclick = () => {
        // Marcar como leída en backend antes de cerrar
        fetch(`https://java-backend-latest-rm0u.onrender.com/api/notificacionleida/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo marcar la notificación como leída.");
                }

                // Quitar del DOM si el backend respondió bien
                li.remove();
                if (lista.children.length === 0) {
                    lista.innerHTML = "<li>No tenés nuevas notificaciones.</li>";
                }
                actualizarCampana();
            })
            .catch(error => {
                console.error("Error al marcar como leída:", error);
                alert("Ocurrió un error al marcar la notificación como leída.");
            });
    };

    // Añadir el botón y el contenido a la notificación
    li.appendChild(botonCerrar);
    li.appendChild(tituloElemento);
    li.appendChild(mensajeElemento);

    // Verificar si la lista está vacía
    if (lista.querySelector('li')?.textContent === 'No tenés nuevas notificaciones.') {
        lista.innerHTML = '';
    }

    lista.insertBefore(li, lista.firstChild);
    // Limitar a 10 notificaciones
    if (lista.children.length > 10) {
        lista.removeChild(lista.lastChild);
    }
    nuevasNotificaciones = true;
    actualizarCampana();

    if (abrir) {
        panel.classList.add('open');
    }
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

// Función para cerrar sesión
function cerrarSesion() {
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem("usuarioId");
    sessionStorage.removeItem("usuarioId");
    window.location.href = "../index.html";
}

// Añadir el evento al botón de "Cerrar Sesión"
logoutBtn.addEventListener('click', cerrarSesion);
