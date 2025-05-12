const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const idUsuario = localStorage.getItem('usuarioId');
const cardsContainer = document.querySelector('.project-cards');
const rolSelect = document.getElementById('rol');
let proyectosGlobal = [];
let nuevasNotificaciones = false;
let proyectoIDSeleccionadoGlobal = null; // Guardamos el proyecto seleccionado
let proyectoSelect = null; // Ya no lo usamos

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

// Actualizar el ícono de la campana si hay notificaciones no leídas
function actualizarCampana() {
  const indicador = document.querySelector('.notificacion-indicador');
  if (nuevasNotificaciones) {
    notifBtn.classList.add('tiene-notificacion');
    if (indicador) indicador.style.display = 'inline-block'; // Mostrar el punto rojo
  } else {
    notifBtn.classList.remove('tiene-notificacion');
    if (indicador) indicador.style.display = 'none'; // Ocultar el punto rojo
  }
}

function guardarProyectoYRedirigir(proyectoID) {
  localStorage.setItem('proyectoSeleccionadoID', proyectoID);
  window.location.href = '../AgregarTareaWEB/AgregarTarea.html';
}

function mostrarNotificacion(titulo, mensaje) {
  const panel = document.getElementById('notificationPanel');
  const lista = panel.querySelector("ul");

  // Crear el elemento de la notificación
  const li = document.createElement("li");
  li.className = 'notificacion'; // Ya no usamos 'tipo'

  // Crear el título en negrita y oscuro
  const tituloElemento = document.createElement("h4");
  tituloElemento.textContent = titulo;
  tituloElemento.style.fontWeight = "bold";
  tituloElemento.style.color = "#333"; // Color oscuro

  // Crear el mensaje debajo del título
  const mensajeElemento = document.createElement("p");
  mensajeElemento.textContent = mensaje;
  mensajeElemento.style.margin = "5px 0 0 0"; // Espacio entre título y mensaje

  // Crear el botón de cierre dentro de la notificación
  const botonCerrar = document.createElement('button');
  botonCerrar.innerHTML = '<i class="fas fa-trash"></i>';
  botonCerrar.className = 'cerrar-notificacion';
  botonCerrar.onclick = () => {
    li.remove();
    if (lista.children.length === 0) {
      lista.innerHTML = "<li>No tenés nuevas notificaciones.</li>";
    }
  };

  // Añadir el título, el mensaje y el botón al elemento de la notificación
  li.appendChild(tituloElemento);
  li.appendChild(mensajeElemento);
  li.appendChild(botonCerrar);

  // Limpiar el mensaje de "sin notificaciones" si ya hay notificaciones
  if (lista.querySelector('li')?.textContent === 'No tenés nuevas notificaciones.') {
    lista.innerHTML = '';
  }

  lista.appendChild(li);
  panel.classList.add('open');

  // Marcar como nuevas notificaciones
  nuevasNotificaciones = true;
  actualizarCampana();
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
  console.log("Proyecto seleccionado para entrar: ", proyectoID); // Log para verificar el ID del proyecto
  localStorage.setItem('proyectoSeleccionadoID', proyectoID);
  window.location.href = '../TareasWEB/tareas.html';
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
