const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
let nuevasNotificaciones = false;

// Botón de notificaciones
notifBtn.addEventListener('click', () => {
  panel.classList.toggle('open');
});

// Cierra panel de notificaciones si se hace clic afuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

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


function addComment() {
  const commentText = document.getElementById("commentText").value;
  if (commentText.trim() === "") return;

  const commentList = document.getElementById("comments-list");

  // Crear el contenedor del comentario
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");

  // Icono del comentario
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-comment-dots", "comment-icon");

  // Contenedor de detalles
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("comment-details");

  // Fecha y hora actual
  const timestamp = new Date().toLocaleString();
  const timestampDiv = document.createElement("div");
  timestampDiv.classList.add("timestamp");
  timestampDiv.textContent = timestamp;

  // Contenedor de texto del comentario
  const textDiv = document.createElement("div");
  textDiv.classList.add("comment-text");
  textDiv.textContent = commentText;

  // Agregar elementos al contenedor
  detailsDiv.appendChild(timestampDiv);
  detailsDiv.appendChild(textDiv);

  commentDiv.appendChild(icon);
  commentDiv.appendChild(detailsDiv);

  // Agregar el comentario a la lista
  commentList.appendChild(commentDiv);

  // Limpiar el textarea
  document.getElementById("commentText").value = "";
}

const urlParams = new URLSearchParams(window.location.search);
const tareaID = urlParams.get("tarea");
const usuarioID = localStorage.getItem("usuarioId");

// Endpoints HTTP
const API_BASE = "https://java-backend-latest-rm0u.onrender.com/api";
const GET_COMS = `${API_BASE}/comentarios/${tareaID}`;
const POST_COM = `${API_BASE}/comentar`;

// Conexión WebSocket (SockJS + STOMP)
const socketC      = new SockJS(`${API_BASE.replace('/api','')}/endpoint`);
const stompClientC = Stomp.over(socketC);

document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioID) {
    console.warn("Usuario no autenticado.");
    return window.location.href = "../index.html";
  }

  connectWebSocket();
  loadComments();
});

function connectWebSocket() {
  stompClientC.connect({}, () => {
    console.log("✅ WebSocket conectado");

    // Suscribirse a notificaciones (ya lo tenías)
    stompClientC.subscribe(`/topic/notificaciones/${usuarioID}`, msg => {
      const n = JSON.parse(msg.body);
      mostrarNotificacion(n.titulo, n.mensaje);
    });

    // Suscribirse a comentarios de esta tarea
    stompClientC.subscribe(`/topic/comentarios/${tareaID}`, msg => {
      const comentario = JSON.parse(msg.body);
      renderComment(comentario);
    });
  }, err => console.error("WS error:", err));
}

async function loadComments() {
  try {
    const res  = await fetch(GET_COMS);
    const body = await res.json();

    const list = document.getElementById("comments-list");
    list.innerHTML = "";

    if (body.comentarios && Array.isArray(body.comentarios)) {
      body.comentarios.forEach(renderComment);
    } else {
      list.innerHTML = `<p>${body.mensaje || "No hay comentarios."}</p>`;
    }
  } catch (e) {
    console.error("Error al cargar comentarios:", e);
    document.getElementById("comments-list").innerHTML =
      "<p>Error cargando comentarios.</p>";
  }
}

function renderComment(c) {
  const list = document.getElementById("comments-list");

  const div = document.createElement("div");
  div.classList.add("comment");

  const header = document.createElement("div");
  header.classList.add("comment-header");
  header.textContent = c.usuarioNombre
                    ? `${c.usuarioNombre} · ${new Date(c.fecha).toLocaleString()}`
                    : new Date(c.fecha).toLocaleString();

  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = c.contenido || "";

  div.appendChild(header);
  div.appendChild(text);

  if (c.base64) {
    const img = document.createElement("img");
    img.src = c.base64;
    img.alt = c.nombreArchivo || "Adjunto";
    img.classList.add("comment-img");
    div.appendChild(img);
  }

  list.appendChild(div);
  // Opcional: desplazarse al final
  list.scrollTop = list.scrollHeight;
}

async function addComment() {
  const errorDiv = document.getElementById("commentError");
  errorDiv.textContent = "";

  const contenido = document.getElementById("commentText").value.trim();
  const fileInput = document.getElementById("commentFile");

  if (!contenido && fileInput.files.length === 0) {
    return errorDiv.textContent = "Debés escribir algo o adjuntar un archivo.";
  }

  const fd = new FormData();
  fd.append("TareaID",   tareaID);
  fd.append("UsuarioID", usuarioID);
  fd.append("Contenido", contenido);
  if (fileInput.files.length) {
    const file = fileInput.files[0];
    fd.append("Archivo", file, file.name);
    fd.append("NombreArchivo", file.name);
  } else {
    fd.append("NombreArchivo", "");
  }

  try {
    const res = await fetch(POST_COM, {
      method:      "POST",
      body:        fd,
    });

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    document.getElementById("commentText").value = "";
    fileInput.value = "";
    // No recargo con HTTP: el nuevo comentario llegará por WebSocket
  } catch (e) {
    console.error("Error al enviar comentario:", e);
    errorDiv.textContent = "No se pudo enviar el comentario.";
  }
}
