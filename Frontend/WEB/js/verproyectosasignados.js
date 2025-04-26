const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const idUsuario = localStorage.getItem('usuarioId');
const cardsContainer = document.querySelector('.project-cards');
const proyectoSelect = document.getElementById('proyecto');
const rolSelect = document.getElementById('rol'); // nuevo select de rol
let proyectosGlobal = [];

// Abrir/cerrar panel de notificaciones
notifBtn.addEventListener('click', () => {
  panel.classList.toggle('open');
});

// Cerrar panel si se hace clic fuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Modal
function openModal() {
  // Primero, limpiamos las opciones del select de proyectos
  proyectoSelect.innerHTML = '';

  // Luego, agregamos las opciones correspondientes a los proyectos
  proyectosGlobal.forEach(proyecto => {
    const option = document.createElement('option');
    option.value = proyecto.idProyecto;  // ID del proyecto
    option.textContent = proyecto.nombre;  // Nombre del proyecto
    proyectoSelect.appendChild(option);
  });

  // Finalmente, mostramos el modal
  document.getElementById("addUserModal").style.display = "block";
}
function closeModal() {
  document.getElementById("addUserModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("addUserModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("userForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Primero, mostramos el array global de proyectos para verificar su contenido
      console.log('Lista de Proyectos:', proyectosGlobal); // Muestra el array de proyectos

      // Obtener el nombre del proyecto seleccionado desde el combobox
      const nombreProyectoSeleccionado = proyectoSelect.options[proyectoSelect.selectedIndex].textContent;
      console.log('Nombre del Proyecto seleccionado:', nombreProyectoSeleccionado); // Verifica el nombre seleccionado

      // Verificar si se seleccionó un proyecto
      if (!nombreProyectoSeleccionado) {
        alert('Error: No se ha seleccionado un proyecto.');
        return;
      }

      // Encontrar el proyecto que coincida con el nombre seleccionado
      const proyectoEncontrado = proyectosGlobal.find(proyecto => proyecto.nombre === nombreProyectoSeleccionado);
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
        permiso: rolSelect.value === 'Administrador' ? 1 : 0
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
          const { nombre, descripcion } = proyecto;

          const card = document.createElement('div');
          card.classList.add('project-card');
          card.innerHTML = `
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <div class="button-group">
              <button class="view-project-btn" onclick="window.location.href='../TareasWEB/tareas.html'">Entrar</button>
              <button class="add-task-btn" onclick="window.location.href='../TareasWEB/agregartarea.html'">Agregar Tarea</button>
              <button class="add-user-btn" onclick="openModal()">Agregar Usuario</button>
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

