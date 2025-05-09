const filterButtons = document.querySelectorAll('.filter-btn');
const taskCards = document.querySelectorAll('.task-card');
const notifBtn = document.querySelector('.notif-btn');
const panel = document.getElementById('notificationPanel');


function addComment() {
  const commentText = document.getElementById("commentText").value;
  if (commentText.trim() === "") return;

  const commentList = document.getElementById("comments-list");

  // Crear el contenedor del comentario
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");

  // Icono del comentario
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-comment-dots", "comment-icon");

  // Contenedor de detalles
  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("comment-details");

  // Fecha y hora actual
  const timestamp = new Date().toLocaleString();
  const timestampDiv = document.createElement("div");
  timestampDiv.classList.add("timestamp");
  timestampDiv.textContent = timestamp;

  // Contenedor de texto del comentario
  const textDiv = document.createElement("div");
  textDiv.classList.add("comment-text");
  textDiv.textContent = commentText;

  // Agregar elementos al contenedor
  detailsDiv.appendChild(timestampDiv);
  detailsDiv.appendChild(textDiv);

  commentDiv.appendChild(icon);
  commentDiv.appendChild(detailsDiv);

  // Agregar el comentario a la lista
  commentList.appendChild(commentDiv);

  // Limpiar el textarea
  document.getElementById("commentText").value = "";
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