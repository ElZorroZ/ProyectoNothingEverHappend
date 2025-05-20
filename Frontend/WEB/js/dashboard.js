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

// Establecer la conexión con WebSocket
stompClient.connect({}, () => {
    console.log("✅ Conexión WebSocket establecida...");
    
    // Suscribirse al canal de notificaciones del usuario
    stompClient.subscribe(`/topic/notificaciones/${usuarioId}`, (message) => {
        const notificacion = JSON.parse(message.body);
        mostrarNotificacion(notificacion.titulo, notificacion.mensaje, notificacion.notificacionID,
            notificacion.fecha);
    });

    // Una vez conectado, pedimos las no leídas
    fetch(`https://java-backend-latest-rm0u.onrender.com/api/notificaciones/${usuarioId}`)
        .then(res => res.json())
        .then(notificaciones => {
            if (notificaciones.length === 0) {
                const lista = document.getElementById('notificationPanel').querySelector("ul");
                lista.innerHTML = "<li>No tenés nuevas notificaciones.</li>";
            } else {
                notificaciones.forEach(n => {
                    mostrarNotificacion(
                        n.titulo,
                        n.mensaje,
                        n.notificacionID,
                        n.fecha
                    );
                });
            }
        })
        .catch(err => console.error("❌ Error cargando notificaciones no leídas:", err));
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
function mostrarNotificacion(titulo, mensaje, id, fecha) {
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
    fechaElemento.textContent = new Date(fecha).toLocaleString();

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

        // Marcar como leída en backend
        try {
            fetch(`https://java-backend-latest-rm0u.onrender.com/notificacionleida/${id}`, {
                method: 'PUT'
            });
        } catch (error) {
            console.error("Error al marcar como leída:", error);
        }
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

// Función para cerrar sesión
function cerrarSesion() {
    document.cookie = "usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem("usuarioId");
    sessionStorage.removeItem("usuarioId");
    window.location.href = "../index.html";
}

// Añadir el evento al botón de "Cerrar Sesión"
logoutBtn.addEventListener('click', cerrarSesion);
