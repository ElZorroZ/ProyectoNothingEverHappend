document.addEventListener('DOMContentLoaded', function () {
    // Obtener los botones de filtro y las tarjetas de proyectos
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
  
    // Función para filtrar los proyectos según el estado
    function filterProjects(status) {
      projectCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
  
        if (status === 'todos') {
          // Mostrar todos los proyectos
          card.style.display = 'block';
        } else if (cardStatus === status) {
          // Mostrar solo los proyectos con el estado correspondiente
          card.style.display = 'block';
        } else {
          // Ocultar los proyectos que no coinciden con el estado
          card.style.display = 'none';
        }
      });
    }
  
    // Añadir eventos a los botones de filtro
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Eliminar la clase 'active' de todos los botones
        filterBtns.forEach(button => button.classList.remove('active'));
        // Añadir la clase 'active' al botón clicado
        btn.classList.add('active');
        
        // Obtener el estado del proyecto desde el atributo 'data-filter'
        const filterStatus = btn.getAttribute('data-filter');
        
        // Filtrar los proyectos según el estado
        filterProjects(filterStatus);
      });
    });
  
    // Inicializar el filtro para mostrar todos los proyectos por defecto
    filterProjects('todos');
  });
  