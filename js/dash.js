document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.sidebar-menu .nav-btn');

    // Función principal para cargar el HTML de una vista
    async function loadView(viewName) {
        try {
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) throw new Error('Vista no encontrada');
            
            const htmlContent = await response.text();
            mainContent.innerHTML = htmlContent;

            // Si la vista cargada requiere inicializar íconos de Lucide
            if (window.lucide) {
                lucide.createIcons();
            }

            // Aquí puedes ejecutar inicializaciones específicas según la vista
            if (viewName === 'rutinas') {
                inicializarEventosRutinas();
            }

        } catch (error) {
            mainContent.innerHTML = `<p>Error al cargar la sección: ${error.message}</p>`;
        }
    }

    // Escuchar eventos en el menú del Sidebar
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewName = button.getAttribute('data-view');

            // Cambiar clase activa en botones
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Cargar vista correspondiente
            loadView(viewName);
        });
    });

    // Cargar la vista inicial por defecto (Resumen)
    loadView('resumen');
});