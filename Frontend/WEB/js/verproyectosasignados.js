const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const idUsuario = localStorage.getItem('usuarioId');
const cardsContainer = document.querySelector('.project-cards');
const rolSelect = document.getElementById('rol');
let proyectosGlobal = [];
let nuevasNotificaciones = false;
let proyectoIDSeleccionadoGlobal = null; // Guardamos el proyecto seleccionado
let proyectoSelect = null; // Ya no lo usamos

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

// Abrir/cerrar panel de notificaciones
notifBtn.addEventListener('click', () => {
  panel.classList.toggle('open');
  nuevasNotificaciones = false; // Limpiar notificaciones nuevas al abrir
  actualizarCampana(); // Actualizar campana después de abrir
});

// Cerrar panel si se hace clic fuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});



function guardarProyectoYRedirigir(proyectoID) {
  localStorage.setItem('proyectoSeleccionadoID', proyectoID);
  window.location.href = '../AgregarTareaWEB/AgregarTarea.html';
}


// Modal
function openModal(proyectoID) {
  console.log("Proyecto seleccionado: ", proyectoID); // Log para verificar el ID del proyecto
  proyectoIDSeleccionadoGlobal = proyectoID; 
  document.getElementById("addUserModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addUserModal").style.display = "none";
  localStorage.removeItem('proyectoSeleccionadoID');
}

window.onclick = function(event) {
  const modal = document.getElementById("addUserModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function guardarProyectoYEntrar(proyectoID) {
  localStorage.setItem('proyectoSeleccionadoID', proyectoID);
  window.location.href = '../TareasWEB/tareas.html';
}
function modificarProyectoYEntrar(proyectoID) {
  localStorage.setItem('proyectoSeleccionadoID', proyectoID);
  window.location.href = '../ProyectoWEB/modificar_proyecto.html';
}
// Llenar tarjetas de proyectos al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  if (cardsContainer && idUsuario) {
    cardsContainer.innerHTML = '';

    fetch(`https://java-backend-latest-rm0u.onrender.com/api/proyectos/${idUsuario}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los proyectos");
        }
        return response.json();
      })
      .then(data => {
        const proyectos = data.proyectos;
        proyectosGlobal = proyectos;

        if (!proyectos || proyectos.length === 0) {
          cardsContainer.innerHTML = '<p>No tenés proyectos asignados.</p>';
          return;
        }

        // Muestra todos los proyectos obtenidos en la consola para ver cómo son
        console.log('Proyectos obtenidos:', proyectos);

        // Llenar tarjetas
        proyectos.forEach(proyecto => {
          const { nombre, descripcion, proyectoID } = proyecto;
          const card = document.createElement('div');
          card.classList.add('project-card');
          card.innerHTML = `
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <div class="button-group">
              <button class="view-project-btn" onclick="guardarProyectoYEntrar(${proyectoID})">Entrar</button>
              <button class="add-task-btn" onclick="guardarProyectoYRedirigir(${proyectoID})">Agregar Tarea</button>
              <button class="add-user-btn" onclick="openModal(${proyectoID})">Agregar Usuario</button>
              <button class="add-user-btn" onclick="modificarProyectoYEntrar(${proyectoID})">Modificar Proyecto</button>
              <button class="delete-project-btn" onclick="confirmarYEliminarProyecto(${proyectoID})">Eliminar Proyecto</button>
            </div>
          `;
          cardsContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error al pedir los proyectos:', error);
        cardsContainer.innerHTML = '<p>Error al cargar los proyectos.</p>';
      });

    // Llenar el select de roles
    const roles = ['Miembro', 'Administrador'];
    roles.forEach(rol => {
      const option = document.createElement('option');
      option.value = rol;
      option.textContent = rol;
      rolSelect.appendChild(option);
    });
  }
});

function confirmarYEliminarProyecto(proyectoID) {
  const confirmacion = confirm("¿Estás seguro de que querés eliminar este proyecto? Esta acción no se puede deshacer.");
  
  if (confirmacion) {
    const data = { proyectoID };

    fetch("https://java-backend-latest-rm0u.onrender.com/api/eliminarproyecto", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al eliminar el proyecto");
      }
      alert("Proyecto eliminado correctamente");
      location.reload();
    })
    .catch(error => {
      console.error("Error al eliminar proyecto:", error);
      alert("No se pudo eliminar el proyecto");
    });
  }
}

// Cuando se carga la página, revisar si ya existe un proyecto seleccionado en localStorage
document.addEventListener("DOMContentLoaded", function () {
  const proyectoSeleccionado = localStorage.getItem('proyectoSeleccionadoID');
  
  if (proyectoSeleccionado) {
    console.log('Proyecto previamente seleccionado:', proyectoSeleccionado);
  } else {
    console.log('No se encontró un proyecto previamente seleccionado');
  }
});

// Agregar usuario (cuando se manda el email)
function agregarUsuarioAProyecto(event) {
  // Prevenir la acción predeterminada del formulario (que causa el refresco de la página)
  event.preventDefault(); // Esto evita el envío del formulario

  // Verificamos qué usuario y proyecto estamos agregando
  const proyectoID = proyectoIDSeleccionadoGlobal;
  const usuarioID = idUsuario;  // Asegúrate de que idUsuario esté correctamente seteado

  // Obtener el valor del email ingresado en el input
  const email = document.getElementById('email').value;

  // Validar si el email no está vacío
  if (!email) {
    alert('Por favor, ingresa un email válido.');
    return;
  }

  console.log("Enviando email para agregar usuario al proyecto", proyectoID, "con usuario", usuarioID);

  fetch(`https://java-backend-latest-rm0u.onrender.com/api/agregarrolusuario`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    OtroID: proyectoID,
    email: email,
  }),
})
  .then(async response => {
    const contentType = response.headers.get("content-type");
    let data = {};
    let message = '';

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      message = data.message || 'Usuario agregado correctamente al proyecto.';
    } else {
      message = await response.text();
    }

    if (response.ok) {
      alert(message);
      closeModal();
    } else {
      alert('Error: ' + message);
    }
  })
  .catch(error => {
    console.error('Error al agregar el usuario:', error);
    alert('Hubo un error al intentar agregar al usuario.');
  });
}
