const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// servir archivos estáticos desde ./public
app.use(express.static(path.join(__dirname, "public")));

// SALAS en memoria
const salas = {};

// ---------------- Socket.io ----------------
io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id);

    // crear sala
    socket.on("crearSala", ({ nombre }, callback) => {
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
        salas[codigo] = { jugadores: [{ id: socket.id, nombre }], host: socket.id };
        socket.join(codigo);
        console.log(`Sala ${codigo} creada por ${nombre} (${socket.id})`);
        callback({ codigo });
        io.to(codigo).emit("actualizarJugadores", {
            jugadores: salas[codigo].jugadores,
            host: salas[codigo].host
        });
    });

    // unirse a sala
    socket.on("unirseSala", ({ nombre, codigo }, callback) => {
        const sala = salas[codigo];
        if (!sala) return callback({ error: "Sala no encontrada" });
        if (sala.jugadores.find((j) => j.nombre === nombre)) {
            return callback({ error: "Nombre ya en uso" });
        }
        sala.jugadores.push({ id: socket.id, nombre });
        socket.join(codigo);
        console.log(`${nombre} se unió a la sala ${codigo}`);
        callback({ ok: true });
        io.to(codigo).emit("actualizarJugadores", {
            jugadores: sala.jugadores,
            host: sala.host
        });
    });

    // iniciar juego (con categoría elegida)
    socket.on("iniciarJuego", ({ codigo, categoria }) => {
        const sala = salas[codigo];
        if (!sala) return;
        if (socket.id !== sala.host) return;

        const jugadores = sala.jugadores;
        if (!jugadores || jugadores.length === 0) return;

        // elegir impostor
        const impostor = jugadores[Math.floor(Math.random() * jugadores.length)];
        sala.impostor = impostor.id;

        // categorías con palabras + imágenes
        const categorias = {
            "Futbolista": [
                { palabra: "Messi", imagen: "/images/messi.jpg" },
                { palabra: "Cristiano Ronaldo", imagen: "/images/cristianoronaldo.jpg" },
                { palabra: "Neymar", imagen: "/images/neymar.jpg" },
                { palabra: "Zlatan Ibrahimović", imagen: "/images/ibrahimovic.jpg" },
                { palabra: "Sergio Ramos", imagen: "/images/sergioramos.jpg" },
                { palabra: "Cruyff", imagen: "/images/cruyff.jpg" },
                { palabra: "Pelé", imagen: "/images/pele.jpg" },
                { palabra: "Maradona", imagen: "/images/maradona.jpg" },
                { palabra: "Ronaldinho", imagen: "/images/ronaldinho.jpg" },
                { palabra: "Haaland", imagen: "/images/haaland.jpg" },
                { palabra: "Lewandowski", imagen: "/images/lewandowski.jpg" },
                { palabra: "luka modric", imagen: "/images/modric.jpg" },
                { palabra: "lautaro martinez", imagen: "/images/martinez.jpg" },
                { palabra: "Lamine Yamal", imagen: "/images/yamal.jpg"},
                { palabra: "Vinicius Jr", imagen: "/images/vinicius.jpg" },
                { palabra: "Pedri", imagen: "/images/pedri.jpg" },
                { palabra: "Ansu Fati", imagen: "/images/fati.jpg" },
                { palabra: "Kylian Mbappé", imagen: "/images/mbappe.jpg" },
                { palabra: "Cristian Romero", imagen: "/images/romero.jpg" },
                { palabra: "Julián Álvarez", imagen: "/images/alvarez.jpg" },
                { palabra: "Ángel Di María", imagen: "/images/dimaria.jpg" },
                { palabra: "Dibu Martínez", imagen: "/images/dibu.jpg" },
                { palabra: "Saka", imagen: "/images/saka.jpg" },
                { palabra: "Foden", imagen: "/images/foden.jpg" },
                { palabra: "Rashford", imagen: "/images/rashford.jpg" },
                { palabra: "Kante", imagen: "/images/kante.jpg" },
                { palabra: "De Bruyne", imagen: "/images/debruyne.jpg" },
                { palabra: "Hazard", imagen: "/images/hazard.jpg" },
                { palabra: "Toni Kroos", imagen: "/images/kroos.jpg" },
                { palabra: "Benzema", imagen: "/images/benzema.jpg" },
                { palabra: "Marcelo", imagen: "/images/marcelo.jpg" },
                { palabra: "Salah", imagen: "/images/salah.jpg" },
                { palabra: "Mane", imagen: "/images/mane.jpg" },
                { palabra: "Firmino", imagen: "/images/firmino.jpg" },
                { palabra: "Van Dijk", imagen: "/images/vandijk.jpg" },
                { palabra: "Alisson", imagen: "/images/alisson.jpg" },
                { palabra: "Son Heung-min", imagen: "/images/son.jpg" },
                { palabra: "Kane", imagen: "/images/kane.jpg" },
                { palabra: "De Gea", imagen: "/images/degea.jpg" },
                { palabra: "Xavi", imagen: "/images/xavi.jpg" },
                { palabra: "Iniesta", imagen: "/images/iniesta.jpg" },
                { palabra: "Piqué", imagen: "/images/pique.jpg" },
                { palabra: "Busquets", imagen: "/images/busquets.jpg" },
                { palabra: "Ter Stegen", imagen: "/images/terstegen.jpg" },
                { palabra: "Zidane", imagen: "/images/zidane.jpg" },
                { palabra: "Gareth Bale", imagen: "/images/bale.jpg" },
                { palabra: "Roberto Carlos", imagen: "/images/robertocarlos.jpg" },
                { palabra: "Raúl", imagen: "/images/raul.jpg" },
                { palabra: "Figo", imagen: "/images/figo.jpg" },
                { palabra: "Totti", imagen: "/images/totti.jpg" },
                { palabra: "Del Piero", imagen: "/images/delpiero.jpg" },
                { palabra: "Shevchenko", imagen: "/images/shevchenko.jpg" },
                { palabra: "C. Zanetti", imagen: "/images/zanetti.jpg" },
                { palabra: "Buffon", imagen: "/images/buffon.jpg" },
                { palabra: "Kaká", imagen: "/images/kaka.jpg" },
                { palabra: "Ronaldo Nazário", imagen: "/images/ronaldo.jpg" },
                { palabra: "Eto'o", imagen: "/images/etoo.jpg" },
                { palabra: "Henry", imagen: "/images/henry.jpg" },
                { palabra: "Lampard", imagen: "/images/lampard.jpg" },
                { palabra: "Terry", imagen: "/images/terry.jpg" },
                { palabra: "Shearer", imagen: "/images/shearer.jpg" },
                { palabra: "Beckham", imagen: "/images/beckham.jpg" },
                { palabra: "Giggs", imagen: "/images/giggs.jpg" },
                { palabra: "Scholes", imagen: "/images/scholes.jpg" },
                { palabra: "Van Nistelrooy", imagen: "/images/vanNistelrooy.jpg" },
                { palabra: "Rooney", imagen: "/images/rooney.jpg" },
                { palabra: "Van der Sar", imagen: "/images/vandersar.jpg" },
                { palabra: "Pirlo", imagen: "/images/pirlo.jpg" },
                { palabra: "Van Basten", imagen: "/images/vanbasten.jpg" },
                { palabra: "Gullit", imagen: "/images/gullit.jpg" },
                { palabra: "Bergkamp", imagen: "/images/bergkamp.jpg" },
                { palabra: "Van Persie", imagen: "/images/vanpersie.jpg" },
                { palabra: "Schmeichel", imagen: "/images/schmeichel.jpg" },
                { palabra: "Robben", imagen: "/images/robben.jpg" },
                { palabra: "Sneijder", imagen: "/images/sneijder.jpg" },
                { palabra: "Kuyt", imagen: "/images/kuyt.jpg" },
                { palabra: "Depay", imagen: "/images/depay.jpg" },
                { palabra: "Wijnaldum", imagen: "/images/wijnaldum.jpg" },
                { palabra: "Coutinho", imagen: "/images/coutinho.jpg" },
                { palabra: "Fábregas", imagen: "/images/fabregas.jpg" },
                { palabra: "Puyol", imagen: "/images/puyol.jpg" },
                { palabra: "Valdés", imagen: "/images/valdes.jpg" },
                { palabra: "Mac Allister", imagen: "/images/macallister.jpg" },
                { palabra: "De Paul", imagen: "/images/depaul.jpg" },
                { palabra: "Otamendi", imagen: "/images/otamendi.jpg" },
                { palabra: "Acuna", imagen: "/images/acuna.jpg" },
                { palabra: "Tagliafico", imagen: "/images/tagliafico.jpg" },
                { palabra: "Ousmane Dembélé", imagen: "/images/dembele.jpg" },
                { palabra: "Aubameyang", imagen: "/images/aubameyang.jpg" },
                { palabra: "Lukaku", imagen: "/images/lukaku.jpg" },
                { palabra: "Griezmann", imagen: "/images/griezmann.jpg" },
                { palabra: "Franck Ribéry", imagen: "/images/ribery.jpg" },
                { palabra: "Franco Mastantuono", imagen: "/images/mastantuono.jpg" },
                { palabra: "Di Stéfano", imagen: "/images/distéfano.jpg" },
                { palabra: "Gianluigi Donnarumma", imagen: "/images/donnarumma.jpg" },
                { palabra: "Verratti", imagen: "/images/verratti.jpg" },
                { palabra: "Chiesa", imagen: "/images/chiesa.jpg" },
                { palabra: "Jorginho", imagen: "/images/jorginho.jpg" },
                { palabra: "Muller", imagen: "/images/muller.jpg" },
                { palabra: "Kimmich", imagen: "/images/kimmich.jpg" },
                { palabra: "Neuer", imagen: "/images/neuer.jpg" },
                { palabra: "Gnabry", imagen: "/images/gnabry.jpg" },
                { palabra: "Sané", imagen: "/images/sane.jpg" },
                { palabra: "Barcola", imagen: "/images/barcola.jpg" },
                { palabra: "Musiala", imagen: "/images/musiala.jpg" },
                { palabra: "Coman", imagen: "/images/coman.jpg" },
                { palabra: "Alaba", imagen: "/images/alaba.jpg" },
                { palabra: "Rudiger", imagen: "/images/rudiger.jpg" },
                { palabra: "Koulibaly", imagen: "/images/koulibaly.jpg" },
                { palabra: "Kvaratskhelia", imagen: "/images/kvartskhelia.jpg" },
                { palabra: "Cole Palmer", imagen: "/images/colepalmer.jpg" },



            ],
            "Clash Royale": [
                { palabra: "Mago Eléctrico", imagen: "/images/magoElectrico.png" },
                { palabra: "Montapuercos", imagen: "/images/montapuercos.jpg" },
                { palabra: "Bruja", imagen: "/images/bruja.png" },
                { palabra: "Caballero", imagen: "/images/caballero.png" },
                { palabra: "Gigante", imagen: "/images/gigante.png" },
                { palabra: "Dragón Infernal", imagen: "/images/dragonInfernal.png" },
                { palabra: "P.E.K.K.A", imagen: "/images/pekka.png" },
                { palabra: "Leñador", imagen: "/images/lenador.png" },
                { palabra: "Choza de Duendes", imagen: "/images/chozaDuendes.jpg" },
                { palabra: "Barril de Duendes", imagen: "/images/barrilDuendes.png" },
                { palabra: "Horda de Esbirros", imagen: "/images/hordaEsbirros.png" },
                { palabra: "Esbirros", imagen: "/images/esbirros.png" },
                { palabra: "Bebé Dragón", imagen: "/images/bebeDragon.png" },
                { palabra: "Mago", imagen: "/images/mago.png" },
                { palabra: "Mago de Hielo", imagen: "/images/magoHielo.png" },
                { palabra: "Arquero Mágico", imagen: "/images/arqueroMagico.png" },
                { palabra: "Arqueras", imagen: "/images/arqueras.png" },
                { palabra: "Mini P.E.K.K.A", imagen: "/images/miniPekka.png" },
                { palabra: "Princesa", imagen: "/images/princesa.png" },
                { palabra: "Cazador", imagen: "/images/cazador.png" },
                { palabra: "Tornado", imagen: "/images/tornado.png" },
                { palabra: "Bola de Fuego", imagen: "/images/bolaFuego.png" },
                { palabra: "Veneno", imagen: "/images/veneno.jpg" },
                { palabra: "Rayo", imagen: "/images/rayo.jpg" },
                { palabra: "Flechas", imagen: "/images/flechas.jpg" },
                { palabra: "Tronco", imagen: "/images/tronco.png" },
                { palabra: "Cementerio", imagen: "/images/cementerio.jpg" },
                { palabra: "Gólem", imagen: "/images/golem.png" },
                { palabra: "Sabueso de Lava", imagen: "/images/sabuesoLava.png" },
                { palabra: "Murciélagos", imagen: "/images/murcielagos.png" },
                { palabra: "Torre Infernal", imagen: "/images/torreInfernal.png" },
                { palabra: "Cañón con Ruedas", imagen: "/images/canonRuedas.png" },
                { palabra: "Tesla", imagen: "/images/tesla.png" },
                { palabra: "Cañón", imagen: "/images/canon.png" },
                { palabra: "Mortero", imagen: "/images/mortero.png" },
                { palabra: "Choza de Bárbaros", imagen: "/images/chozaBarbaros.png" },
                { palabra: "Horno", imagen: "/images/horno.png" },
                { palabra: "Torre Bombardera", imagen: "/images/torreBombardera.png" },
                { palabra: "Duendes", imagen: "/images/duendes.png" },
                { palabra: "Bárbaros", imagen: "/images/barbaros.png" },
                { palabra: "Bárbaros de Élite", imagen: "/images/barbarosElite.png" },
                { palabra: "Príncipe", imagen: "/images/principe.png" },
                { palabra: "Caballero Dorado", imagen: "/images/caballeroDorado.png" },
                { palabra: "Reclutas Reales", imagen: "/images/reclutasReales.png" },
                { palabra: "Duende Lanzadardos", imagen: "/images/duendeLanzadardos.png" },
                { palabra: "Duendes con Lanza", imagen: "/images/duendeLanza.png" },
                { palabra: "Espíritu de Fuego", imagen: "/images/espirituFuego.png" },
                { palabra: "Espíritu de Hielo", imagen: "/images/espirituHielo.png" },
                { palabra: "Espíritu de Curación", imagen: "/images/espirituCuracion.png" },
                { palabra: "Duende Gigante", imagen: "/images/duendeGigante.png" },
                { palabra: "Rey Esqueleto", imagen: "/images/reyEsqueleto.png" },
                { palabra: "Bruja Nocturna", imagen: "/images/brujaNocturna.png" },
                { palabra: "Arbusto Sospechoso", imagen: "/images/arbustoSospechoso.png" },
                { palabra: "Pandilla de Duendes", imagen: "/images/pandillaDuendes.png" },
                { palabra: "Bombardero", imagen: "/images/bombardero.png" },
                { palabra: "Trio de Mosqueteras", imagen: "/images/mosqueteras.png" },
                { palabra: "Montacarneros", imagen: "/images/montacarneros.png" },
                { palabra: "Reina Arquera", imagen: "/images/reinaArquera.png" },
                { palabra: "Fantasma Real", imagen: "/images/fantasmaReal.png" },
                { palabra: "Dragón Eléctrico", imagen: "/images/dragonElectrico.png" },
                { palabra: "Megaesbirro", imagen: "/images/megaesbirro.png" },
                { palabra: "Minero", imagen: "/images/minero.png" },
                { palabra: "Mosquetera" , imagen: "/images/mosquetera.png" },
                { palabra: "Rompe Muros", imagen: "/images/rompeMuros.png" },
                { palabra: "Valquiria", imagen: "/images/valkiria.png" },
                { palabra: "Descarga", imagen: "/images/descarga.jpg" },
                { palabra: "Curandera", imagen: "/images/curandera.png" },
                { palabra: "Lanzarrocas", imagen: "/images/lanzarrocas.png" },
                { palabra: "Golem de Hielo", imagen: "/images/golemHielo.png" },
                { palabra: "Mega Caballero", imagen: "/images/megCaballero.png" },
                { palabra: "Furia", imagen: "/images/furia.jpg" },
                { palabra: "Principe Oscuro", imagen: "/images/principeOscuro.png" },
                { palabra: "Hielo", imagen: "/images/hielo.jpg" },
                { palabra: "Esqueleto Gigante", imagen: "/images/esqueletoGigante.png" },
                { palabra: "Chispitas", imagen: "/images/chispitas.png" },
                { palabra: "Monje", imagen: "/images/monje.png" },
                { palabra: "Guardias", imagen: "/images/guardias.png" },
                { palabra: "Clon", imagen: "/images/clon.png" },
                { palabra: "Espejo", imagen: "/images/espejo.png" },
                { palabra: "Lápida", imagen: "/images/lapida.png" },
                { palabra: "Puercos Reales", imagen: "/images/puercosReales.png" }
            ],
            "Animal": [
                { palabra: "Perro", imagen: "/images/perro.png" },
                { palabra: "Gato", imagen: "/images/gato.png" },
                { palabra: "León", imagen: "/images/leon.png" },
                { palabra: "Águila", imagen: "/images/aguila.png" }
            ],
            "Objeto": [
                { palabra: "Balón", imagen: "/images/balon.png" },
                { palabra: "Espada", imagen: "/images/espada.png" },
                { palabra: "Bicicleta", imagen: "/images/bicicleta.png" },
                { palabra: "Teléfono", imagen: "/images/telefono.png" }
            ],
            "Superhéroes": [
                { palabra: "Batman", imagen: "/images/batman.jpg" },
                { palabra: "Superman", imagen: "/images/superman.jpg" },
                { palabra: "Iron Man", imagen: "/images/ironman.jpg" },
                { palabra: "Spiderman", imagen: "/images/spiderman.jpg" }
            ]
        };

        // decidir categoría
        let lista;
        if (!categoria || categoria === "aleatoria") {
            const keys = Object.keys(categorias);
            sala.categoria = keys[Math.floor(Math.random() * keys.length)];
            lista = categorias[sala.categoria];
        } else {
            sala.categoria = categoria;
            lista = categorias[categoria];
        }

        const elegido = lista[Math.floor(Math.random() * lista.length)];
        sala.palabra = elegido.palabra;

        // enviar rol privado a cada jugador
        jugadores.forEach((j) => {
            if (j.id === impostor.id) {
                io.to(j.id).emit("rol", { tipo: "impostor" });
            } else {
                io.to(j.id).emit("rol", {
                    tipo: "palabra",
                    palabra: sala.palabra,
                    categoria: sala.categoria,
                    imagen: elegido.imagen
                });
            }
        });

        io.to(codigo).emit("mensaje", "El juego ha comenzado. Revisen sus roles.");
    });

    // =============================
    // 🎯 SUBASTA
    // =============================

    // Crear sala de subasta
    socket.on("crearSalaSubasta", ({ nombre }, callback) => {
        const codigo = Math.random().toString(36).substring(2, 7).toUpperCase();
        salas[codigo] = {
            host: socket.id,
            jugadores: [{ id: socket.id, nombre }],
            subastaEnCurso: false,
            jugadorActual: null
        };
        socket.join(codigo);
        console.log(`${nombre} creó la sala de subasta ${codigo}`);
        callback({ codigo });
        io.to(codigo).emit("actualizarJugadores", { jugadores: salas[codigo].jugadores, host: salas[codigo].host });
    });

    // Unirse a sala de subasta
    socket.on("unirseSalaSubasta", ({ nombre, codigo }, callback) => {
        const sala = salas[codigo];
        if (!sala) return callback({ error: "Sala no encontrada" });
        if (sala.jugadores.find(j => j.nombre === nombre)) {
            return callback({ error: "Nombre ya en uso" });
        }
        sala.jugadores.push({ id: socket.id, nombre });
        socket.join(codigo);
        console.log(`${nombre} se unió a la sala de subasta ${codigo}`);
        callback({ ok: true });
        io.to(codigo).emit("actualizarJugadores", { jugadores: sala.jugadores, host: sala.host });
    });

    socket.on("iniciarSubasta", ({ codigo }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.host) return;

    sala.subastaEnCurso = true;
    sala.jugadorActual = 0;

    // jugadores por posición (ejemplo simplificado)
    sala.listaJugadores = [
        { nombre: "Extremo Derecho", silueta: "/images/siluetaMessi.png", real: "/images/realMessi.png", base: 100, posicion: "arquero", calidad: "Leyenda" },
        { nombre: "Silueta Arquero", silueta: "/images/silueta.png", real: "/images/arquero2.png", base: 80, posicion: "arquero", calidad: "Bueno" },
        { nombre: "Silueta Defensa", silueta: "/images/silueta.png", real: "/images/defensa1.png", base: 70, posicion: "defensa", calidad: "Muy bueno" }
    ];

    // 🔥 avisar al cliente que empezó la subasta
    io.to(codigo).emit("subastaIniciada");

    avanzarJugador(codigo);
});

function avanzarJugador(codigo) {
    const sala = salas[codigo];
    if (!sala) return;

    if (sala.jugadorActual >= sala.listaJugadores.length) {
        io.to(codigo).emit("subastaFinalizada");
        return;
    }

    const jugador = sala.listaJugadores[sala.jugadorActual];
    sala.pujas = [];

    // 1️⃣ mostrar silueta del jugador
    io.to(codigo).emit("jugadorEnSubasta", {
        nombre: jugador.nombre,
        imagen: jugador.silueta,
        base: jugador.base,
        posicion: jugador.posicion,
        calidad: jugador.calidad
    });

    // 2️⃣ esperar 10 segundos para permitir pujas
    setTimeout(() => {
        // determinar ganador
        if (sala.pujas.length === 0) {
            io.to(codigo).emit("mensaje", "⏳ Nadie pujó por este jugador.");
        } else {
            const max = sala.pujas.reduce((a, b) => (a.monto > b.monto ? a : b));
            io.to(codigo).emit("jugadorGanado", {
                nombre: max.nombre,
                monto: max.monto,
                imagen: jugador.real
            });
        }

        // 3️⃣ esperar 5 segundos mostrando al ganador con su imagen real
        setTimeout(() => {
            sala.jugadorActual++;
            avanzarJugador(codigo); // pasar al siguiente jugador
        }, 5000);

    }, 10000);
}

socket.on("pujar", ({ codigo, monto }) => {
    const sala = salas[codigo];
    if (!sala || !sala.subastaEnCurso) return;

    const jugador = sala.jugadores.find(j => j.id === socket.id);
    if (!jugador) return;

    sala.pujas.push({ id: jugador.id, nombre: jugador.nombre, monto });
    io.to(codigo).emit("nuevaPuja", { nombre: jugador.nombre, monto });
});

    

    // Retirarse de la puja
    socket.on("retirarse", ({ codigo }) => {
        const sala = salas[codigo];
        if (!sala || !sala.subastaEnCurso) return;

        const jugador = sala.jugadores.find(j => j.id === socket.id);
        if (!jugador) return;

        jugador.puja = null; // ya no participa
        io.to(codigo).emit("jugadorRetirado", { nombre: jugador.nombre });
    });

    // Cuando un jugador se retira de la puja
    socket.on("retirarse", ({ codigo }) => {
        const sala = salas[codigo];
        if (!sala || !sala.subastaEnCurso) return;

        const jugador = sala.jugadores.find(j => j.id === socket.id);
        if (!jugador) return;

        jugador.seRetiro = true; // marcamos que se retiró
        io.to(codigo).emit("mensajeSistema", {
            mensaje: `${jugador.nombre} se ha retirado de la puja.`
        });
    });

    // desconexión
    socket.on("disconnect", () => {
        console.log("Desconectado:", socket.id);
        for (const codigo in salas) {
            const sala = salas[codigo];
            if (!sala) continue;

            const prevLen = sala.jugadores.length;
            sala.jugadores = sala.jugadores.filter((j) => j.id !== socket.id);

            if (sala.jugadores.length === 0) {
                delete salas[codigo];
                console.log(`Sala ${codigo} eliminada (vacía)`);
            } else {
                if (sala.host === socket.id) {
                    sala.host = sala.jugadores[0].id;
                    console.log(`Host reasignado en sala ${codigo} a ${sala.jugadores[0].nombre}`);
                }
                io.to(codigo).emit("actualizarJugadores", {
                    jugadores: sala.jugadores,
                    host: sala.host
                });
            }

            if (sala && sala.jugadores.length !== prevLen) {
                io.to(codigo).emit("actualizarJugadores", {
                    jugadores: sala?.jugadores || [],
                    host: sala?.host
                });
            }
        }
    });
});

// ---------------- start server ----------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} (puerto ${PORT})`);
});
