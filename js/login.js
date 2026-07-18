import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Coloca tus credenciales de GlowDiary que ya comprobamos que funcionan
const supabaseUrl = 'https://zbuvhosvgrxngdhkqfts.supabase.co'
const supabaseKey = 'sb_publishable_MW34HmHO-K-aUrpCqNiblw_qg9LysSF'

// Agregamos 'export' aquí para que puedas importar este mismo cliente en tu dashboard.js
export const supabase = createClient(supabaseUrl, supabaseKey)

async function verificarSesionActiva() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si la usuaria ya inició sesión antes, la mandamos directo al dashboard
    if (session) {
        window.location.href = 'dashboard.html';
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
        window.location.href = 'dashboard.html';
    }
});
//https://andrecode315.github.io/GlowDiary/