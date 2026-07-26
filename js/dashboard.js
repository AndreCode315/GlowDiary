import { supabase } from './supabaseConfig.js';

const saludoNombre = document.querySelector('.greeting-title');
const userEmailText = document.querySelector('.user-email');
const btnLogout = document.getElementById('btn-logout');
const contadorProductos = document.querySelectorAll('.stat-number')[1];

const btnToggleMenu = document.getElementById('btn-toggle-menu');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');
const sidebar = document.getElementById('sidebar-menu');
const overlay = document.getElementById('sidebar-overlay');
const menuButtons = document.querySelectorAll('.sidebar-menu .menu-item');
const secciones = document.querySelectorAll('.seccion-pantalla');
const linkVerTodas = document.getElementById('link-ver-todas');

async function inicializarDashboard() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        window.location.replace('index.html');
        return;
    }

    const userId = session.user.id;
    if (userEmailText) {
        userEmailText.textContent = session.user.email;
    }

    await cargarDatosPerfil(userId);
    await cargarProductosUser(userId);

    configurarNavegacionUI();
    
    if (window.lucide) {
        lucide.createIcons();
    }
}

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

async function cargarProductosUser(userId) {
    const { data: listaProductos, error } = await supabase
        .from('productos')
        .select('*')
        .eq('user_id', userId);

    if (!error && listaProductos) {
        if (contadorProductos) {
            contadorProductos.textContent = listaProductos.length;
        }
    }
}

async function gestionarLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.replace('index.html');
    } else {
        alert("Error al cerrar sesión");
    }
}

function abrirMenu() {
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
}

function cerrarMenu() {
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}

function cambiarSeccion(targetId) {
    menuButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('activate');
        } else {
            btn.classList.remove('activate');
        }
    });

    secciones.forEach(sec => {
        if (sec.id === targetId) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    cerrarMenu();
}

function configurarNavegacionUI() {
    if (btnToggleMenu) btnToggleMenu.addEventListener('click', abrirMenu);
    if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', cerrarMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            if (targetId) cambiarSeccion(targetId);
        });
    });

    if (linkVerTodas) {
        linkVerTodas.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarSeccion('sec-rutinas');
        });
    }
}

if (btnLogout) {
    btnLogout.addEventListener('click', gestionarLogout);
}

inicializarDashboard();