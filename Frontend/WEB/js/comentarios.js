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
    fechaElemento.textContent = new Date(fecha).toLocaleDateString;

    // Crear el botón de cierre (icono de basura)
    const botonCerrar = document.createElement('button');
    botonCerrar.innerHTML = '<i class="fas fa-trash"></i>';
    botonCerrar.className = 'cerrar-notificacion';
    botonCerrar.onclick = () => {
        // Marcar como leída en backend antes de cerrar
        fetch(`https://java-backend-latest-rm0u.onrender.com/notificacionleida/${id}`)
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

// Endpoints HTTP
const API_BASE = "https://java-backend-latest-rm0u.onrender.com/api";
const POST_COM = `${API_BASE}/comentar`;

let tareaID, usuarioID, stompClient;
const subscribedTopics = new Set();  // ← Lleva registro de tópicos ya suscritos

document.addEventListener("DOMContentLoaded", () => {
  tareaID   = new URLSearchParams(window.location.search).get("tarea");
  usuarioID = localStorage.getItem("usuarioID") || localStorage.getItem("usuarioId");
  if (!usuarioID) return window.location.href = "../index.html";

  // Notificaciones UI (igual que antes) …
  loadNotifications();
  connectWebSocket();
  loadComments();
  document.querySelector('.comment-submit-btn')
          .addEventListener('click', addComment);
});

function safeSubscribe(topic, callback) {
  if (subscribedTopics.has(topic)) return;  // ya suscrito
  subscribedTopics.add(topic);
  stompClient.subscribe(topic, callback);
}

function connectWebSocket() {
  // Solo una conexión STOMP
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

async function loadNotifications(){
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
    })
    .catch(err => {
      console.error("❌ Error al cargar notificaciones:", err);
    });
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
  console.log("Comentario recibido:", c); // ← DEBUG

  const list = document.getElementById("comments-list");
  const div = document.createElement("div");
  div.classList.add("comment");

  // Header con nombre y fecha
  const header = document.createElement("div");
  header.classList.add("comment-header");

  const fecha = c.fecha ? new Date(c.fecha).toDateString : "";
  const nombreCompleto = c.nombreUsuario && c.apellidoUsuario
    ? `${c.nombreUsuario} ${c.apellidoUsuario}`
    : "Usuario X";

  header.textContent = `${nombreCompleto} · ${fecha}`;
  div.appendChild(header);

  // Texto del comentario
  const text = document.createElement("p");
  text.classList.add("comment-text");
  text.textContent = c.contenido || "(Sin texto)";
  div.appendChild(text);

  // Si viene imagen (base64)
  if (c.base64) {
    const img = document.createElement("img");
    img.src = c.base64;
    img.alt = c.nombreArchivo || "Adjunto";
    img.classList.add("comment-img");
    div.appendChild(img);
  }

  // Si NO viene imagen pero sí nombreArchivo → botón de descarga
  else if (c.nombreArchivo) {
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = `📎 Descargar: ${c.nombreArchivo}`;
  downloadBtn.classList.add("comment-download-btn");
  downloadBtn.addEventListener("click", () => {
    descargarArchivoComentario(c.comentarioID, c.nombreArchivo);
  });
  div.appendChild(downloadBtn);
}

  list.appendChild(div);
  list.scrollTop = list.scrollHeight; // auto-scroll
}

async function descargarArchivoComentario(comentarioID, nombreArchivo) {
  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/comentario/archivo/${comentarioID}`);
    
    if (response.status === 404) {
      throw new Error("El archivo adjunto no existe.");
    }

    if (!response.ok) {
      throw new Error("No se pudo descargar el archivo.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo || `comentario_${comentarioID}.dat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("❌ Error al descargar archivo: " + error.message);
  }
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
    fd.append("Archivo");
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