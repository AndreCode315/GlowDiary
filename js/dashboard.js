// Importamos la configuración del cliente de Supabase (ajusta la ruta si es necesario)
import { supabase } from './supabaseConfig.js';

// Elementos del DOM a manipular
const saludoNombre = document.querySelector('.greeting-title');
const userEmailText = document.querySelector('.user-email');
const btnLogout = document.getElementById('btn-logout');
const contadorProductos = document.querySelectorAll('.stat-number')[1]; // La segunda tarjeta de estadísticas (🧴 Productos)

// 1. PROTEGER LA RUTA Y CARGAR DATOS
async function inicializarDashboard() {
    // Verificamos si hay una sesión activa en el navegador
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        // Si no está logueada, patitas a la calle (al login)
        window.location.replace('index.html');
        return;
    }

    // Si está logueada, extraemos su ID único de autenticación
    const userId = session.user.id;
    userEmailText.textContent = session.user.email; // Mostramos su correo en la barra lateral

    // 2. TRAER INFORMACIÓN DEL PERFIL REAL
    await cargarDatosPerfil(userId);

    // 3. TRAER Y CONTAR LOS PRODUCTOS REALES
    await cargarProductosUser(userId);
}

// Función para buscar el nombre en la tabla public.perfiles
async function cargarDatosPerfil(userId) {
    const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', userId)
        .single(); // .single() porque solo esperamos una fila para ese ID

    if (!error && perfil) {
        // Colocamos el nombre real de la base de datos junto al emoji de chispas
        saludoNombre.textContent = `${perfil.nombre} ✨`;
        document.querySelector('.user-name').textContent = perfil.nombre;
    }
}

// Función para buscar los productos de la usuaria en public.productos
async function cargarProductosUser(userId) {
    const { data: listaProductos, error } = await supabase
        .from('productos')
        .select('*')
        .eq('user_id', userId);

    if (!error && listaProductos) {
        // Actualizamos el número estático del HTML con la cantidad real de filas encontradas
        contadorProductos.textContent = listaProductos.length;
        
        // Aquí más adelante podremos pintar la grilla de productos específicos si deseas
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

// Escuchadores de eventos (Listeners)
btnLogout.addEventListener('click', gestionarLogout);

// Arrancar la app cuando cargue el archivo
inicializarDashboard();