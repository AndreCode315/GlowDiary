import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Coloca tus credenciales de GlowDiary que ya comprobamos que funcionan
const supabaseUrl = 'https://zbuvhosvgrxngdhkqfts.supabase.co'
const supabaseKey = 'sb_publishable_MW34HmHO-K-aUrpCqNiblw_qg9LysSF'
const supabase = createClient(supabaseUrl, supabaseKey)

// Seleccionamos el formulario usando la clase que tienes en tu HTML
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
        alert("¡Entrando a mi tocador! Conexión real exitosa ✨");
        
        window.location.href = 'dashboard.html';
    }
});
//https://andrecode315.github.io/GlowDiary/