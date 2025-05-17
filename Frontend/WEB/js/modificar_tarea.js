const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
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
console.log("modificar_tarea.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  // Obtener parámetro tarea de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const tareaID = urlParams.get("tarea");

  console.log("tareaID desde URL:", tareaID);

  if (!tareaID) {
    alert("No se encontró el ID de la tarea a modificar en la URL.");
    return;
  }

  const form = document.getElementById("modificar_tarea");
  if (!form) {
    console.error("No se encontró el formulario con id 'modificar_tarea'");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const confirmacion = confirm("¿Estás seguro de realizar las modificaciones?");
    if (!confirmacion) return;

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const fechaVencimiento = document.getElementById("fechaVencimiento").value;

    // Obtener el archivo solo si el campo existe
    const archivoInput = document.getElementById("archivoPDF");
    let archivo = null;
    if (archivoInput && archivoInput.files.length > 0) {
      archivo = archivoInput.files[0];
    } else {
      console.warn("Campo de archivo no presente o ningún archivo seleccionado.");
    }

    const formData = new FormData();
    formData.append("TareaID", parseInt(tareaID));
    formData.append("Nombre", nombre);
    formData.append("Descripcion", descripcion);
    formData.append("Vencimiento", fechaVencimiento);

    // Solo añadir el archivo si existe
    if (archivo) {
      formData.append("Archivo", archivo);
    }

    try {
      const response = await fetch("https://java-backend-latest-rm0u.onrender.com/api/modificartarea", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Tarea modificada correctamente");
        window.location.href = "../TareasWEB/tareas.html";
      } else {
        const error = await response.text();
        alert("Error al modificar la tarea: " + error);
      }
    } catch (error) {
      alert("Error de red o del servidor.");
    }
  });
});
