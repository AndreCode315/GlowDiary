// Importamos la configuración del cliente de Supabase
import { supabase } from './supabaseConfig.js';

// Elementos del DOM a manipular (Autenticación y Supabase)
const saludoNombre = document.querySelector('.greeting-title');
const userEmailText = document.querySelector('.user-email');
const btnLogout = document.getElementById('btn-logout');
const contadorProductos = document.querySelectorAll('.stat-number')[1]; // Segunda tarjeta de estadísticas (🧴 Productos)

// Elementos del DOM a manipular (Interfaz y Navegación)
const btnToggleMenu = document.getElementById('btn-toggle-menu');
const sidebar = document.getElementById('sidebar-menu');
const menuButtons = document.querySelectorAll('.sidebar-menu .menu-item');
const secciones = document.querySelectorAll('.seccion-pantalla');

// 1. PROTEGER LA RUTA Y CARGAR DATOS
async function inicializarDashboard() {
    // Verificamos si hay una sesión activa en el navegador
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        // Si no está logueada, al login
        window.location.replace('index.html');
        return;
    }

    // Si está logueada, extraemos su ID único
    const userId = session.user.id;
    if (userEmailText) {
        userEmailText.textContent = session.user.email; // Correo en la barra lateral
    }

    // Cargar datos de la base de datos
    await cargarDatosPerfil(userId);
    await cargarProductosUser(userId);

    // Inicializar listeners de UI e íconos
    configurarNavegacionUI();
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

// 2. TRAER INFORMACIÓN DEL PERFIL REAL
async function cargarDatosPerfil(userId) {
    const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', userId)
        .single();

    if (!error && perfil) {
        if (saludoNombre) saludoNombre.textContent = `${perfil.nombre} ✨`;
        const elemUserName = document.querySelector('.user-name');
        if (elemUserName) elemUserName.textContent = perfil.nombre;
    }
}

// 3. TRAER Y CONTAR LOS PRODUCTOS REALES
async function cargarProductosUser(userId) {
    const { data: listaProductos, error } = await supabase
        .from('productos')
        .select('*')
        .eq('user_id', userId);

    if (!error && listaProductos) {
        if (contadorProductos) {
            contadorProductos.textContent = listaProductos.length;
        }
        console.log("Productos cargados de forma dinámica:", listaProductos);
    }
}

// 4. FUNCIÓN PARA CERRAR SESIÓN
async function gestionarLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.replace('index.html');
    } else {
        alert("Error al cerrar sesión");
    }
}

// 5. NAVEGACIÓN DE PANTALLAS Y MENÚ LATERAL (UI)
function configurarNavegacionUI() {
    // Abrir / Cerrar el menú responsive
    if (btnToggleMenu && sidebar) {
        btnToggleMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Cambiar de vistas con los botones del menú lateral
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            if (!targetId) return;

            // Quitar clase activa de botones y ocultar las pantallas
            menuButtons.forEach(btn => btn.classList.remove('activate'));
            secciones.forEach(sec => sec.classList.remove('active'));

            // Activar botón presionado y mostrar la sección correspondiente
            button.classList.add('activate');
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // En móviles, cerrar la barra tras hacer clic en un enlace
            if (sidebar) sidebar.classList.remove('open');
        });
    });
}

// Escuchador de evento de Logout
if (btnLogout) {
    btnLogout.addEventListener('click', gestionarLogout);
}

// Arrancar la app al cargar el archivo
inicializarDashboard();