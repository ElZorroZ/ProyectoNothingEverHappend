const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const idUsuario = localStorage.getItem('usuarioId');
const cardsContainer = document.querySelector('.project-cards');
const proyectoSelect = document.getElementById('proyecto');
const rolSelect = document.getElementById('rol');
let proyectosGlobal = [];
let nuevasNotificaciones = false;

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
  localStorage.setItem('proyectoSeleccionadoID', proyectoID); // ← Guarda el ID temporalmente
  proyectoSelect.innerHTML = '';

  proyectosGlobal.forEach(proyecto => {
    const option = document.createElement('option');
    option.value = proyecto.proyectoID;
    option.textContent = proyecto.nombre;
    proyectoSelect.appendChild(option);
  });

  // Seleccionamos automáticamente el proyecto actual
  proyectoSelect.value = proyectoID;

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

// Función que se llama cuando se selecciona un proyecto
proyectoSelect.addEventListener('change', () => {
  const proyectoIDSeleccionado = proyectoSelect.value;

  // Verificar si el valor seleccionado es válido
  if (!proyectoIDSeleccionado || proyectoIDSeleccionado === 'undefined') {
    console.error('Error: No se ha seleccionado un proyecto válido');
    alert('Por favor, selecciona un proyecto válido');
    return; // Evita que se ejecute el siguiente código, como la redirección
  }

  // Actualizar el proyecto seleccionado en localStorage
  localStorage.setItem('proyectoSeleccionadoID', proyectoIDSeleccionado);  // Guardamos el proyecto seleccionado
  console.log('Proyecto seleccionado guardado en localStorage:', proyectoIDSeleccionado);

  // Redirigir a la página correspondiente si el proyecto es válido
  window.location.href = '../AgregarTareaWEB/AgregarTarea.html';
});


// Cuando se carga la página, revisar si ya existe un proyecto seleccionado en localStorage
document.addEventListener("DOMContentLoaded", function () {
  const proyectoSeleccionado = localStorage.getItem('proyectoSeleccionadoID');
  
  // Si hay un proyecto seleccionado en localStorage, establecerlo como seleccionado en el <select>
  if (proyectoSeleccionado) {
    proyectoSelect.value = proyectoSeleccionado;
    console.log('Proyecto previamente seleccionado:', proyectoSeleccionado);
  } else {
    console.log('No se encontró un proyecto previamente seleccionado');
  }
});

// Llenar el select de proyectos (esto ya debería estar hecho antes)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Primero, mostramos el array global de proyectos para verificar su contenido
      console.log('Lista de Proyectos:', proyectosGlobal); // Muestra el array de proyectos

      // Obtener el nombre del proyecto seleccionado desde el combobox
      const proyectoIDSeleccionado = localStorage.getItem('proyectoSeleccionadoID');
      const proyectoEncontrado = proyectosGlobal.find(proyecto => proyecto.proyectoID == proyectoIDSeleccionado);

      if (!proyectoEncontrado) {
        alert('Error: Proyecto no encontrado.');
        return;
      }

      console.log('Proyecto Encontrado:', proyectoEncontrado);


      // Verificar si se encontró el proyecto
      if (!proyectoEncontrado) {
        alert('Error: Proyecto no encontrado.');
        return;
      }

      // Mostrar el ID del proyecto encontrado
      console.log('ID del Proyecto encontrado:', proyectoEncontrado.proyectoID);

      // Preparar los datos que se enviarán al backend
      const requestData = {
        OtroID: proyectoEncontrado.proyectoID,  // Asignamos el proyectoID al OtroID
        email: document.getElementById("email").value,
        permiso: rolSelect.value === 'Administrador' ? true : false,
        UsuarioID: 0
      };

      console.log('Datos que se enviarán al fetch:', requestData);

      fetch('https://java-backend-latest-rm0u.onrender.com/api/agregarrolusuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      .then(response => {
        if (!response.ok) {
            console.error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
            throw new Error(`Error al agregar usuario. Estado: ${response.status}`);
        }
        return response.text(); // Obtén la respuesta como texto
    })
    .then(data => {
        console.log('Respuesta del servidor:', data); // Verifica si la respuesta realmente contiene algo
        // No es necesario hacer JSON.parse si la respuesta es texto plano
        if (data === "Usuario agregado exitosamente") {
            alert('Usuario agregado exitosamente!');
        } else {
            alert('Hubo un problema al agregar el usuario');
        }
        form.reset();
        closeModal();
    })    
    
    });
  }

  // Llenar el select de proyectos (esto ya debería estar hecho antes)
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

        // Llenar el select de proyectos
        proyectos.forEach(proyecto => {
          const option = document.createElement('option');
          option.value = proyecto.proyectoID; // Usamos 'proyectoID' ahora
          option.textContent = proyecto.nombre;
          proyectoSelect.appendChild(option);
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

