const socket = io();
let codigoSala = "";
let soyHost = false;

function crearSala() {
    const nombre = document.getElementById("nombre").value;
    socket.emit("crearSala", { nombre }, (res) => {
        codigoSala = res.codigo;
        soyHost = true;
        document.getElementById("menu").classList.add("oculto");
        document.getElementById("sala").classList.remove("oculto");
        document.getElementById("codigoSala").innerText = codigoSala;
        document.getElementById("btnIniciar").classList.remove("oculto");
    });
}

function unirseSala() {
    const nombre = document.getElementById("nombre").value;
    const codigo = document.getElementById("codigo").value;
    socket.emit("unirseSala", { nombre, codigo }, (res) => {
        if (res?.error) return alert(res.error);
        codigoSala = codigo;
        document.getElementById("menu").classList.add("oculto");
        document.getElementById("sala").classList.remove("oculto");
        document.getElementById("codigoSala").innerText = codigoSala;
    });
}

function iniciarJuego() {
    const categoria = document.getElementById("categoria").value;
    socket.emit("iniciarJuego", { codigo: codigoSala, categoria });
}

function volverASala() {
    // Redirige directamente al lobby (index.html)
    window.location.href = "index.html";
}

// actualizaciones de jugadores
socket.on("actualizarJugadores", ({ jugadores, host }) => {
    const lista = jugadores.map(j => `
        <div class="jugador ${j.id === socket.id ? "yo" : ""}">
            <span class="nombre">
                ${j.nombre}
                ${j.id === host ? "<span class='corona'>👑</span>" : ""}
            </span>
            ${j.id === socket.id ? "<span class='etiqueta'>(Tú)</span>" : ""}
        </div>
    `).join("");
    document.getElementById("jugadores").innerHTML = lista;
});



// recibir rol privado
socket.on("rol", (data) => {
    const rolDiv = document.getElementById("rol");
    document.getElementById("juego").classList.remove("oculto");

    if (data.tipo === "impostor") {
        // Cartel impostor rojo con glitch
        rolDiv.innerHTML = `<div class="role-banner impostor">IMPOSTOR</div>`;
    } else {
        // Cartel inocente verde con pulso + palabra/imágen
        rolDiv.innerHTML = `
            <div class="role-banner inocente">INOCENTE</div>
            <div style="margin-top:15px;">
                Tu palabra es: <span class="item">${data.palabra}</span> (${data.categoria})
            </div>
            <img src="${data.imagen}" alt="${data.palabra}" style="margin-top:15px; max-width:200px;">
        `;
    }

    // 🎨 Cambiar tema según categoría
    const body = document.body;
    body.classList.remove("futbolista-theme", "clash-theme", "superheroes-theme");

    if (data.categoria === "Futbolista") body.classList.add("futbolista-theme");
    if (data.categoria === "Clash Royale") body.classList.add("clash-theme");
    if (data.categoria === "Superhéroes") body.classList.add("superheroes-theme");
});

// mensajes generales
socket.on("mensaje", (msg) => {
    document.getElementById("mensaje").innerHTML = `<div class="mensaje-general">${msg}</div>`;
});

