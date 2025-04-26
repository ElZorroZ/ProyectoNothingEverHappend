const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
const idUsuario = localStorage.getItem('usuarioId');
const cardsContainer = document.querySelector('.project-cards');

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

// Al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("userForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const proyecto = document.getElementById("proyecto").value;
      const email = document.getElementById("email").value;

      alert("Usuario agregado: \nProyecto: " + proyecto + "\nEmail: " + email);

      form.reset();
      closeModal();
    });
  }

  // Pedir y mostrar proyectos asignados al usuario
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
        console.log(data.mensaje);

        const proyectos = data.proyectos;

        if (!proyectos || proyectos.length === 0) {
          cardsContainer.innerHTML = '<p>No tenés proyectos asignados.</p>';
          return;
        }

        proyectos.forEach(proyecto => {
          const { nombre, descripcion, fecha_de_inicio, fecha_de_final, permiso } = proyecto;

          const card = document.createElement('div');
          card.classList.add('project-card');
          card.innerHTML = `
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <button class="view-project-btn" onclick="window.location.href='../TareasWEB/tareas.html'">Entrar</button>
          `;
          cardsContainer.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error al pedir los proyectos:', error);
        cardsContainer.innerHTML = '<p>Error al cargar los proyectos.</p>';
      });
  }
});

