const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');

// Modal de Asignar Tarea
const assignTaskModal = document.getElementById('assignTaskModal');
const assignTaskForm = document.getElementById('assignTaskForm');

// Función para abrir el modal
function openAssignTaskModal() {
  assignTaskModal.style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
  assignTaskModal.style.display = 'none';
}

// Cerrar el modal si se hace clic afuera
window.onclick = function(event) {
  if (event.target == assignTaskModal) {
    assignTaskModal.style.display = 'none';
  }
}

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
async function openAssignTaskModal(tareaIDSeleccionada) {
  assignTaskModal.style.display = 'block';
  window.tareaID = tareaIDSeleccionada; // Guardamos la tarea seleccionada en variable global

  const select = document.getElementById("userSelect");
  select.innerHTML = `<option value="">Cargando usuarios...</option>`;

  const ProyectoID = localStorage.getItem("proyectoSeleccionadoID");
  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/usuariosProyectoTarea/${ProyectoID}/${TareaID}`);
    const data = await response.json();

    // Vaciar y llenar select
    select.innerHTML = '<option value="">Selecciona un usuario</option>';
    data.forEach(usuario => {
      const option = document.createElement("option");
      option.value = usuario.id; // asegurate que el backend devuelve ID
      option.textContent = usuario.email;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    select.innerHTML = '<option value="">Error al cargar</option>';
  }
}

assignTaskForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const usuarioSeleccionadoID = document.getElementById('userSelect').value;

  try {
    const response = await fetch('https://java-backend-latest-rm0u.onrender.com/api/agregartareausuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UsuarioID: usuarioSeleccionadoID,
        OtroID: window.tareaID
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        alert('Tarea asignada exitosamente');
        closeModal();
      } else {
        alert('Error al asignar tarea: ' + (data.message || 'desconocido'));
      }
    } else {
      alert('Error de conexión con el servidor');
    }
  } catch (error) {
    console.error('Error al asignar tarea:', error);
    alert('Ocurrió un error al intentar asignar la tarea');
  }
});



// Filtro de tareas
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    // Marcar botón activo
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Mostrar u ocultar tareas
    taskCards.forEach(card => {
      const status = card.getAttribute('data-status');

      if (filter === 'todas' || filter === status) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const allTasks = document.querySelectorAll(".task-card");
  const completedTasks = document.querySelectorAll('.task-card[data-status="completada"]');

  const total = allTasks.length;
  const completadas = completedTasks.length;

  let porcentaje = 0;
  if (total > 0) {
    porcentaje = Math.round((completadas / total) * 100);
  }

  const fill = document.getElementById("progressFill");
  fill.style.width = porcentaje + "%";
  fill.textContent = porcentaje + "%";
});

document.addEventListener("DOMContentLoaded", async () => {
  const estadoMap = {
    1: { id: "pendiente-tasks", class: "pending", label: "Pendiente" },
    2: { id: "enprogreso-tasks", class: "in-progress", label: "En Progreso" },
    3: { id: "completada-tasks", class: "completed", label: "Completada" },
    4: { id: "vencimiento-tasks", class: "vencimiento", label: "Vencimiento" }
  };

  const UsuarioID = localStorage.getItem('usuarioId');
  const ProyectoID = localStorage.getItem('proyectoSeleccionadoID');
  console.log(UsuarioID)
  console.log(ProyectoID)

  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/tareas/${UsuarioID}/${ProyectoID}`);
    const data = await response.json();
    const tareas = data.Tareas || [];

    // Mostrar el array de tareas en la consola
    console.log(tareas);

    let total = tareas.length;
    let completadas = 0;

    tareas.forEach(tarea => {
      const { Nombre, Descripcion, Estado, Prioridad, Vencimiento, Archivo } = tarea;
      const nombre = Nombre;
      const descripcion = Descripcion;
      const estado = Estado;
      const prioridad = Prioridad;
      const vencimiento = Vencimiento;
      const archivo = Archivo;
    
      if (estado === 3) completadas++;

      const tareaCard = document.createElement("div");
      tareaCard.classList.add("task-card");
      tareaCard.setAttribute("data-status", estadoMap[estado].label.toLowerCase());

      tareaCard.innerHTML = `
        <h3>${nombre}</h3>
        <p>${descripcion}</p>
        <p>Fecha límite: ${vencimiento}</p>
        <span class="status ${estadoMap[estado].class}">${estadoMap[estado].label}</span>
        <button class="assign-task-btn" onclick="openAssignTaskModal(${tareaID})">Asignar Tarea a Usuario</button>
      `;

      document.getElementById(estadoMap[estado].id).appendChild(tareaCard);
    });

    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    const fill = document.getElementById("progressFill");
    fill.style.width = porcentaje + "%";
    fill.textContent = porcentaje + "%";
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
});

