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

      const proyectoSeleccionado = proyectoSelect.value;
      const email = document.getElementById("email").value;
      const rolSeleccionado = rolSelect.value;

      // Mapear el rol a 0 para 'Miembro' y 1 para 'Administrador'
      const rol = rolSeleccionado === 'Administrador' ? 1 : 0;

      // Fetch para agregar usuario
      fetch('https://java-backend-latest-rm0u.onrender.com/api/agregarrolusuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OtroID: proyectoSeleccionado,
          email: email,
          permiso: rol
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar usuario');
        }
        return response.json();
      })
      .then(data => {
        alert('Usuario agregado exitosamente!');
        form.reset();
        closeModal();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al agregar el usuario.');
      });
    });
  }

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
          option.value = proyecto.nombre;
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
