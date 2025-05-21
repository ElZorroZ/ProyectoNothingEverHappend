const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');
let nuevasNotificaciones = false;

// Conexión al servidor WebSocket usando SockJS y STOMP
const socket = new SockJS("https://java-backend-latest-rm0u.onrender.com/endpoint");
const stompClient = Stomp.over(socket);
const usuarioId = localStorage.getItem('usuarioId'); // Obtener el ID del usuario almacenado



// Modal de Asignar Tarea
const assignTaskModal = document.getElementById('assignTaskModal');
const assignTaskForm = document.getElementById('assignTaskForm');


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

async function loadNotifications(){
  // Cargar notificaciones no leídas
  fetch(`https://java-backend-latest-rm0u.onrender.com/api/notificaciones/${usuarioId}`)
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

      // Luego de cargar notificaciones, conectar WebSocket
    })
    .catch(err => {
      console.error("❌ Error al cargar notificaciones:", err);
    });
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

function ModificarTarea(tareaID) {
  // Redirecciona a la página de comentarios, por ejemplo
  window.location.href = `../TareasWEB/modificar_tarea.html?tarea=${tareaID}`;
}

function confirmarYEliminarTarea(tareaID) {
  const confirmacion = confirm("¿Estás seguro de que querés eliminar esta tarea? Esta acción no se puede deshacer.");

  if (confirmacion) {
    fetch("https://java-backend-latest-rm0u.onrender.com/api/eliminartarea", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ TareaID: tareaID })  // Formato correcto
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          console.error("Error en respuesta:", response.status, err);
          throw new Error("Error al eliminar la tarea: " + JSON.stringify(err));
        });
      }
      alert("Tarea eliminada correctamente");
      location.reload();
    })
    .catch(error => {
      console.error("Error al eliminar tarea:", error);
      alert("No se pudo eliminar la tarea: " + error.message);
    });
  }
}


function abrirComentarios(tareaID) {
  // Redirecciona a la página de comentarios, por ejemplo
  window.location.href = `../ComentariosWEB/comentarios.html?tarea=${tareaID}`;
}

function openPriorityModal(tareaID, prioridadActual) {
  const modal = document.getElementById("priorityModal");
  const select = document.getElementById("prioritySelect");

  modal.style.display = "block";
  window.tareaID = tareaID;

  // Limpiar opciones anteriores
  select.innerHTML = "";

  // Definir las prioridades posibles
  const prioridades = {
    1: "Baja",
    2: "Media",
    3: "Alta"
  };

  // Excluir la prioridad actual
  for (const [valor, texto] of Object.entries(prioridades)) {
    if (parseInt(valor, 10) !== parseInt(prioridadActual, 10)) {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = texto;
      select.appendChild(option);
    }
  }
}


async function cambiarPrioridad() {
  const nuevaPrioridad = document.getElementById("prioritySelect").value;
  const tareaID = window.tareaID;

  if (!nuevaPrioridad || !tareaID) {
    alert("Error: datos incompletos.");
    return;
  }

  // Mostrar los datos que se enviarán
  console.log("Datos a enviar:", { nuevaPrioridad, tareaID });

  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/modificarprioridad/${nuevaPrioridad}/${tareaID}`, {
      method: 'POST'
    });

    if (response.ok) {
      alert("Prioridad modificada exitosamente.");
      closePriorityModal();
      location.reload(); // Opcional: recargar para reflejar cambios
    } else {
      alert("Error al modificar la prioridad.");
    }
  } catch (error) {
    console.error("Error al modificar prioridad:", error);
    alert("Ocurrió un error al intentar cambiar la prioridad.");
  }
}



function closePriorityModal() {
  document.getElementById("priorityModal").style.display = "none";
}

function openStatusModal(tareaID, estadoActual) {
  const modal = document.getElementById("statusModal");
  const select = document.getElementById("statusSelect");

  modal.style.display = "block";
  window.tareaID = tareaID;

  // Limpiar opciones anteriores
  select.innerHTML = "";

  // Definir los estados posibles
  const estados = {
    1: "Pendiente",
    2: "En proceso",
    3: "Completada"
  };

  // Excluir el estado actual
  for (const [valor, texto] of Object.entries(estados)) {
    if (parseInt(valor, 10) !== parseInt(estadoActual, 10)) {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = texto;
      select.appendChild(option);
    }
  }
}


function closeStatusModal() {
  document.getElementById("statusModal").style.display = "none";
}

async function cambiarEstado() {
  const nuevoEstado = document.getElementById("statusSelect").value;
  const tareaID = window.tareaID;

  if (!nuevoEstado || !tareaID) {
    alert("Error: datos incompletos.");
    return;
  }

  console.log("Datos a enviar:", { nuevoEstado, tareaID });

  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/modificarestado/${nuevoEstado}/${tareaID}`, {
      method: 'POST'
    });

    if (response.ok) {
      alert("Estado modificado exitosamente.");
      closeStatusModal();
      location.reload(); // Opcional
    } else {
      alert("Error al modificar el estado.");
    }
  } catch (error) {
    console.error("Error al modificar estado:", error);
    alert("Ocurrió un error al intentar cambiar el estado.");
  }
}

// Función para abrir el modal y guardar el ID de la tarea
async function openAssignTaskModal(tareaIDSeleccionada) {
  assignTaskModal.style.display = 'block';
  window.tareaID = tareaIDSeleccionada; // Guardamos la tarea seleccionada en variable global

  const select = document.getElementById("userSelect");
  select.innerHTML = `<option value="">Cargando usuarios...</option>`;

  const ProyectoID = localStorage.getItem("proyectoSeleccionadoID");
  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/usuariosProyectoTarea/${ProyectoID}/${window.tareaID}`);
    const data = await response.json();

    // Imprimir lo que devuelve el backend
    console.log('Respuesta del backend:', data);

    // Verificar si la respuesta contiene el array de usuarios
    if (data.usuarios && Array.isArray(data.usuarios)) {
      // Vaciar y llenar select con los usuarios
      select.innerHTML = '<option value="">Selecciona un usuario</option>';
      data.usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id; // Asegúrate de que el backend devuelve ID
        
        // Crear el texto de la opción con nombre y apellido
        const userText = `${usuario.nombre || 'Nombre no disponible'} ${usuario.apellido || 'Apellido no disponible'}`;
        
        option.textContent = userText; // Mostrar el texto del usuario
        select.appendChild(option);
      });
    } else {
      console.error('La propiedad "usuarios" no es un array:', data);
      select.innerHTML = '<option value="">Error: No se encontraron usuarios.</option>';
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    select.innerHTML = '<option value="">Error al cargar</option>';
  }
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
  nuevasNotificaciones = false;
    actualizarCampana(); // Actualiza la campana al abrir el panel
});

// Cierra panel de notificaciones si se hace clic afuera
document.addEventListener('click', (e) => {
  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

assignTaskForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const usuarioSeleccionadoID = document.getElementById('userSelect').value;

  // Verificar que se haya seleccionado un usuario
  if (!usuarioSeleccionadoID) {
    alert('Por favor, selecciona un usuario.');
    return;
  }

  try {
    const response = await fetch('https://java-backend-latest-rm0u.onrender.com/api/agregartareausuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        UsuarioID: usuarioSeleccionadoID,
        OtroID: window.tareaID // Enviar el ID de la tarea
      }),
    });

    const contentType = response.headers.get("content-type");

    let message = '';
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      message = data.message || JSON.stringify(data);
    } else {
      message = await response.text();
    }

    if (response.ok) {
      alert(message);
      closeModal();
    } else {
      alert('Error al asignar tarea: ' + message);
    }

  } catch (error) {
    console.error('Error al asignar tarea:', error);
    alert('Ocurrió un error al intentar asignar la tarea: ' + error.message);
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
  loadNotifications();
  
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
  console.log(UsuarioID);
  console.log(ProyectoID);

  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/tareas/${UsuarioID}/${ProyectoID}`);
    const data = await response.json();
    console.log("Respuesta del backend:", data);
    const { tareas = [], porcentaje = 0 } = data.Tareas || {};

    const prioridadMap = {
      1: "Baja",
      2: "Media",
      3: "Alta"
    };

    tareas.forEach(tarea => {
      const { TareaID, Nombre, Descripcion, Estado, Prioridad, Vencimiento } = tarea;
      
      const contenedor = document.getElementById(estadoMap[Estado].id);

      const tareaCard = document.createElement("div");
      tareaCard.className = "task-card";
      tareaCard.setAttribute("data-status", estadoMap[Estado].id);

      tareaCard.innerHTML = `
        <h4>${Nombre}</h4>
        <p>${Descripcion}</p>
        <p><strong>Prioridad:</strong> ${prioridadMap[Prioridad] || "Desconocida"}</p>
        <p><strong>Vencimiento:</strong> ${Vencimiento || "No definido"}</p>
        <div class="task-actions">
          <button onclick="openPriorityModal(${TareaID}, ${Prioridad})">Cambiar Prioridad</button>
          <button onclick="openStatusModal(${TareaID}, ${Estado})">Cambiar Estado</button>
          <button onclick="openAssignTaskModal(${TareaID})">Asignar</button>
          <button onclick="abrirComentarios(${TareaID})">Comentarios</button>
          <button class="btn-descargar" data-id="${TareaID}">Descargar archivo</button>
          <button class="task-btn modify-btn" onclick="ModificarTarea(${TareaID})">Modificar Tarea</button>
          <button class="delete-task-btn" onclick="confirmarYEliminarTarea(${TareaID})">Eliminar Tarea</button>
        </div>
      `;

      contenedor.appendChild(tareaCard);
    });

    // ✅ Agregamos los eventos de descarga **después de crear los botones**
    document.querySelectorAll(".btn-descargar").forEach(btn => {
      btn.addEventListener("click", () => {
        const tareaID = btn.getAttribute("data-id");
        descargarArchivo(tareaID);
      });
    });

    const fill = document.getElementById("progressFill");
    fill.style.width = porcentaje + "%";
    fill.textContent = porcentaje + "%";
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
});

async function descargarArchivo(tareaID) {
  try {
    const response = await fetch(`https://java-backend-latest-rm0u.onrender.com/api/tareas/archivo/${tareaID}`);
    
    if (response.status === 404) {
      throw new Error("El archivo para esta tarea no existe.");
    }
    
    if (!response.ok) {
      throw new Error("No se pudo descargar el archivo.");
    }

    const blob = await response.blob();

    const contentType = response.headers.get("Content-Type");
    const texto = await blob.text();

    // Mostrar el contenido del archivo en la consola
    console.log("Contenido del archivo recibido:");
    console.log(texto);

    if (blob.size < 100 || !contentType.includes("pdf") || !texto.includes("%PDF")) {
      throw new Error("La tarea no tiene un archivo PDF válido adjunto.");
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarea_${tareaID}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("Error al descargar archivo: " + error.message);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      
      // Cambiar clase activa
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar/ocultar columnas según el filtro
      const columns = document.querySelectorAll(".kanban-column");

      columns.forEach(col => {
        const status = col.dataset.status;

        if (filter === "todas" || filter === status) {
          col.style.display = "block";
        } else {
          col.style.display = "none";
        }
      });
    });
  });
});
