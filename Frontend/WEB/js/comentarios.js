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


// Endpoints HTTP
const API_BASE = "https://java-backend-latest-rm0u.onrender.com/api";
const POST_COM = `${API_BASE}/comentar`;

// Variables globales (se setean en DOMContentLoaded)
let tareaID;
let usuarioID;
let stompClient;

document.addEventListener("DOMContentLoaded", () => {
  // 1) Obtener IDs
  tareaID   = new URLSearchParams(window.location.search).get("tarea");
  usuarioID = localStorage.getItem("usuarioID") || localStorage.getItem("usuarioId");

  if (!usuarioID) {
    console.warn("Usuario no autenticado.");
    return window.location.href = "../index.html";
  }

  // 2) Inicializar notificaciones (botón + panel)
  const notifBtn = document.querySelector('.notif-btn');
  const panel    = document.getElementById('notificationPanel');
  notifBtn.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !notifBtn.contains(e.target))
      panel.classList.remove('open');
  });

  // 3) Conectar WebSocket _una sola vez_
  connectWebSocket();

  // 4) Cargar comentarios iniciales vía HTTP
  loadComments();

  // 5) Asociar envío de comentario
  document.querySelector('.comment-submit-btn')
          .addEventListener('click', addComment);
});

function connectWebSocket() {
  const socket = new SockJS("https://java-backend-latest-rm0u.onrender.com/endpoint");
  stompClient  = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log("✅ WebSocket conectado");

    // Suscribirse a notificaciones
    stompClient.subscribe(
      `/topic/notificaciones/${usuarioID}`,
      msg => {
        const n = JSON.parse(msg.body);
        mostrarNotificacion(n.titulo, n.mensaje);
      }
    );

    // Suscribirse a comentarios de esta tarea
    stompClient.subscribe(
      `/topic/comentarios/${tareaID}`,
      msg => {
        const comentario = JSON.parse(msg.body);
        renderComment(comentario);
      }
    );
  }, err => console.error("WebSocket error:", err));
}

async function loadComments() {
  const GET_COMS = `${API_BASE}/comentarios/${tareaID}`;
  try {
    const res  = await fetch(GET_COMS);  // sin credentials
    const body = await res.json();

    const list = document.getElementById("comments-list");
    list.innerHTML = "";

    if (Array.isArray(body.comentarios)) {
      body.comentarios.forEach(renderComment);
    } else {
      list.innerHTML = `<p>${body.mensaje || "No hay comentarios."}</p>`;
    }
  } catch (e) {
    console.error("Error al cargar comentarios:", e);
    document.getElementById("comments-list")
            .innerHTML = "<p>Error cargando comentarios.</p>";
  }
}

function renderComment(c) {
  const list = document.getElementById("comments-list");
  const div  = document.createElement("div");
  div.classList.add("comment");

  // Header con usuario y fecha
  const header = document.createElement("div");
  header.classList.add("comment-header");
  const fecha  = c.fecha ? new Date(c.fecha).toLocaleString() : "";
  header.textContent = c.usuarioNombre 
                     ? `${c.usuarioNombre} · ${fecha}` 
                     : fecha;

  // Texto
  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = c.contenido || "";

  div.append(header, text);

  // Imagen si viene Base64
  if (c.base64) {
    const img = document.createElement("img");
    img.src        = c.base64;
    img.alt        = c.nombreArchivo || "Adjunto";
    img.classList.add("comment-img");
    div.appendChild(img);
  }

  list.appendChild(div);
  list.scrollTop = list.scrollHeight;  // auto-scroll
}

async function addComment() {
  const errorDiv  = document.getElementById("commentError");
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
      method: "POST",
      body:   fd
    });
    if (!res.ok) throw new Error("HTTP " + res.status);

    // Limpiar, esperar al WS para renderizar el nuevo comentario
    document.getElementById("commentText").value = "";
    fileInput.value = "";
  } catch (e) {
    console.error("Error al enviar comentario:", e);
    errorDiv.textContent = "No se pudo enviar el comentario.";
  }
}