const socket = io();
let codigoSala = null;
let soyHost = false;

function crearSala() {
    const nombre = document.querySelector("#nombre").value;
    socket.emit("crearSalaSubasta", { nombre }, (res) => {
        codigoSala = res.codigo;
        soyHost = true;
        document.querySelector("#menu").classList.add("oculto");
        document.querySelector("#sala").classList.remove("oculto");
        document.querySelector("#codigoSala").innerText = codigoSala;
        document.querySelector("#btnIniciar").classList.remove("oculto");
    });
}

function unirseSala() {
    const nombre = document.querySelector("#nombre").value;
    const codigo = document.querySelector("#codigo").value;
    socket.emit("unirseSalaSubasta", { nombre, codigo }, (res) => {
        if (res?.error) return alert(res.error);
        codigoSala = codigo;
        document.querySelector("#menu").classList.add("oculto");
        document.querySelector("#sala").classList.remove("oculto");
        document.querySelector("#codigoSala").innerText = codigoSala;
    });
}

socket.on("actualizarJugadores", ({ jugadores, host }) => {
    const lista = document.querySelector("#jugadores");
    lista.innerHTML = "";
    jugadores.forEach(j => {
        const li = document.createElement("li");
        li.textContent = j.nombre + (j.id === host ? " 👑" : "");
        lista.appendChild(li);
    });
});

function iniciarSubasta() {
    if (!soyHost) return alert("Solo el host puede iniciar la subasta.");
    socket.emit("iniciarSubasta", { codigo: codigoSala });
}

// Cuando el server avise que empezó la subasta
socket.on("subastaIniciada", () => {
    document.querySelector("#menu").classList.add("oculto");
    document.querySelector("#sala").classList.remove("oculto");
    document.querySelector("#subasta").classList.remove("oculto");

    // Cambiamos el mensaje en vez de usar alert
    document.querySelector("#mensajeSubasta").textContent =
        "¡La subasta ha comenzado! Los jugadores ya pueden pujar.";
});

// Mostrar jugador en subasta (primero silueta, luego revelación)
socket.on("jugadorEnSubasta", ({ nombre, imagen, base }) => {
    const imgJugador = document.querySelector("#imagenJugador");
    const nombreJugador = document.querySelector("#nombreJugador");
    const mensaje = document.querySelector("#mensajeSubasta");

    if (imgJugador && nombreJugador && mensaje) {
        // Mostrar la silueta que manda el server
        imgJugador.src = imagen;
        // Mostrar nombre y precio base
        nombreJugador.textContent = `${nombre} - Precio base: ${base}€`;
        mensaje.textContent = "⏳ 10 segundos para pujar...";

        // Inicia temporizador de 10s
        let tiempo = 10;
        const intervalo = setInterval(() => {
            tiempo--;
            mensaje.textContent = `⏳ ${tiempo}s restantes para pujar...`;
            if (tiempo <= 0) {
                clearInterval(intervalo);
                // Pedimos al server que cierre la puja
                socket.emit("cerrarPuja", { codigo: codigoSala });
            }
        }, 1000);
    }
});


// Cuando se revela el ganador
socket.on("jugadorGanado", ({ nombre, monto, imagen }) => {
    const imgJugador = document.querySelector("#imagenJugador");
    const mensaje = document.querySelector("#mensajeSubasta");

    if (imgJugador && mensaje) {
        imgJugador.src = imagen; // ahora sí mostramos al jugador real
        mensaje.textContent = `🏆 ${nombre} se quedó al jugador por ${monto}€`;
    }
});

function pujar() {
    const monto = document.querySelector("#montoPuja").value;
    if (!monto) return alert("Ingresa una puja primero.");
    socket.emit("pujar", { codigo: codigoSala, monto });
    document.querySelector("#montoPuja").value = "";
}

// Escuchar pujas de todos los jugadores
socket.on("nuevaPuja", ({ nombre, monto }) => {
    const lista = document.querySelector("#historialPujas");
    const li = document.createElement("li");
    li.textContent = `${nombre} ha pujado ${monto}€`;
    lista.appendChild(li);
});

socket.on("mensajeSistema", ({ mensaje }) => {
    const lista = document.querySelector("#historialPujas");
    const li = document.createElement("li");
    li.textContent = mensaje;
    li.style.color = "red"; // opcional para diferenciar
    lista.appendChild(li);
});

function retirarse() {
    socket.emit("retirarse", { codigo: codigoSala });
}

// ======================
// 📱 Menú hamburguesa
// ======================
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("#menu-toggle");
    const nav = document.querySelector("#nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }
});