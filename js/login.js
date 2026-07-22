import { supabase } from './supabaseConfig.js';

async function verificarSesionActiva() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si la usuaria ya inició sesión antes, la mandamos directo al dashboard
    if (session) {
        window.location.replace('dashboard.html');
    }
}

// Se ejecuta inmediatamente al cargar la página index.html
verificarSesionActiva();

// ==========================================
// CONTROL DEL FORMULARIO DE LOGIN
// ==========================================
const form = document.querySelector('.login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Intentando conectar con Supabase...");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error("Error devuelto por Supabase:", error);
        alert("Error de conexión: " + error.message);
    } else {
        console.log("¡Conexión exitosa! Datos del usuario:", data);
        
        // Cambié el alert por un flujo directo para que la experiencia sea más rápida y fluida
        window.location.replace('dashboard.html');
    }
});


// ==========================================
// 3. NAVEGACIÓN ENTRE TARJETAS (LOGIN / REGISTRO)
// ==========================================
const cardLogin = document.getElementById('card-login');
const cardRegistro = document.getElementById('card-registro');

const linkIrRegistro = document.getElementById('link-ir-registro');
const linkIrLogin = document.getElementById('link-ir-login');


// 1. Al hacer clic en "Registrate aqui" -> Oculta Login y Muestra Registro
linkIrRegistro?.addEventListener('click', (e) => {
    e.preventDefault(); 
    if (cardLogin && cardRegistro) {
        cardLogin.style.display = 'none';
        cardRegistro.style.display = 'block';
    }
});

// 2. Al hacer clic en "Inicia sesion aqui" -> Oculta Registro y Muestra Login
linkIrLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    if (cardLogin && cardRegistro) {
        cardRegistro.style.display = 'none';
        cardLogin.style.display = 'block';
    }
});

// ==========================================
// 4. FUNCIONALIDAD DEL OJITO DE CONTRASEÑA
// ==========================================
function configurarOjitoPassword(inputId, botonId) {
    const input = document.getElementById(inputId);
    const boton = document.getElementById(botonId);

    boton?.addEventListener('click', () => {
        const esPassword = input.type === 'password';
        input.type = esPassword ? 'text' : 'password';
        
        // Renderizar nuevamente el icono de Lucide si está disponible
        if (window.lucide) {
            lucide.createIcons();
        }
    });
}

configurarOjitoPassword('reg-password', 'toggle-pass-1');
configurarOjitoPassword('reg-confirm-password', 'toggle-pass-2');

// Renderizar iconos de Lucide al cargar la página
if (window.lucide) {
    lucide.createIcons();
}

//https://andrecode315.github.io/GlowDiary/