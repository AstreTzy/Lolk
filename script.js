/* script.js */

// Animación al hacer scroll
const animar = document.querySelectorAll('.animar');

const mostrarAnimado = () => {
  const top = window.innerHeight * 0.85;
  animar.forEach(e => {
    const pos = e.getBoundingClientRect().top;
    if (pos < top) {
      e.classList.add('mostrar');
    }
  });
};

// Detectar cuando una sección entra en vista
const sections = document.querySelectorAll('section');
const options = {
  threshold: 0.5, // Activar cuando al menos el 50% de la sección esté en vista
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animar-zoom');
    } else {
      entry.target.classList.remove('animar-zoom');
    }
  });
}, options);

// Observar todas las secciones
sections.forEach(section => {
  observer.observe(section);
});

const audio = document.getElementById('audio');
const playButton = document.getElementById('play-button');
const playIcon = document.getElementById('play-icon');
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');

let playing = false;

playButton.addEventListener('click', () => {
  if (playing) {
    audio.pause();
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
  } else {
    audio.play();
    playIcon.innerHTML = `<line x1="6" y1="4" x2="6" y2="20"></line><line x1="18" y1="4" x2="18" y2="20"></line>`;
    requestAnimationFrame(drawWave);
  }
  playing = !playing;
});

function drawWave() {
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const barWidth = 5;
  const barGap = 3;
  const numBars = Math.floor(width / (barWidth + barGap));
  const progress = audio.currentTime / audio.duration;

  const now = Date.now() / 200;

  for (let i = 0; i < numBars; i++) {
    const amp = i < numBars * progress ? 1 : 0.4;
    const barHeight = (Math.sin(i + now) * 0.5 + 0.5) * (height * 0.9) * amp;

    const x = i * (barWidth + barGap);
    const y = (height - barHeight) / 2;

    ctx.fillStyle = '#b88a20';
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  if (!audio.paused) {
    requestAnimationFrame(drawWave);
  }
}

window.addEventListener('scroll', mostrarAnimado);
window.addEventListener('load', mostrarAnimado);

/* Confirmación de asistencia */
const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value.trim();

  if (nombre === "") {
    alert("Por favor ingresa tu nombre.");
    return;
  }

  fetch('https://script.google.com/macros/s/AKfycbwFTU9JFmeANXV79tBGYjVVXzDguxpcegjRUJZ8x6yn6kTfpxys76HYr7VGOnUrg_Rh/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `tipo=asistencia&nombre=${encodeURIComponent(nombre)}`
  })
  .then(response => response.text())
  .then(data => {
    if (data === "ok") {
      alert("¡Gracias por confirmar tu asistencia!");
      formulario.reset();
    } else if (data === "repetido") {
      alert("Ese nombre ya está registrado. 😅");
    } else {
      alert("Ocurrió un error. Por favor intenta de nuevo.");
    }
  })
  .catch(error => {
    alert("Error de conexión.");
    console.error('Error:', error);
  });
});

  const mensaje = "Gracias por acompañarme en este momento tan especial. Tu cariño y apoyo son el mejor regalo que puedo recibir. Si deseas contribuir con un sobre, lo recibiré con mucho amor y gratitud. 💖✨";

  window.addEventListener("load", () => {
    const mensajeDiv = document.getElementById("mensajeElegante");
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add("visible");
  });
function actualizarContador() {
  const fechaEvento = new Date("2025-06-21T20:00:00"); // Fecha del evento
  const ahora = new Date();
  const diferencia = fechaEvento - ahora;

  if (diferencia <= 0) {
    document.getElementById("dias").textContent = "00";
    document.getElementById("horas").textContent = "00";
    document.getElementById("minutos").textContent = "00";
    document.getElementById("segundos").textContent = "00";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  document.getElementById("dias").textContent = String(dias).padStart(2, '0');
  document.getElementById("horas").textContent = String(horas).padStart(2, '0');
  document.getElementById("minutos").textContent = String(minutos).padStart(2, '0');
  document.getElementById("segundos").textContent = String(segundos).padStart(2, '0');
}

// Actualizar cada segundo
setInterval(actualizarContador, 1000);
actualizarContador(); // Llamada inicial

//
(() => {
      const form = document.getElementById('formPlaylist');
      const input = document.getElementById('cancion');
      const lista = document.getElementById('listaCanciones');
      const mensaje = document.getElementById('mensajePlaylist');
      const toggleBtn = document.getElementById('togglePlaylist');
      const STORAGE_KEY = 'miPlaylistCanciones';

      // Cargar canciones guardadas
      function cargarPlaylist() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        try {
          return JSON.parse(data);
        } catch {
          return [];
        }
      }

      // Guardar canciones
      function guardarPlaylist(canciones) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(canciones));
      }

      // Crear embed si es link válido
      function crearEmbed(link) {
        const ytMatch = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/);
        if (ytMatch) {
          const videoId = ytMatch[1];
          return `<iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
        const spMatch = link.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
        if (spMatch) {
          const type = spMatch[1];
          const id = spMatch[2];
          return `<iframe src="https://open.spotify.com/embed/${type}/${id}" width="320" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
        }
        return null;
      }

      // Renderizar lista en el DOM
      function renderizarLista(canciones) {
  lista.innerHTML = '';
  canciones.forEach(cancion => {
    const li = document.createElement('li');
    const embed = crearEmbed(cancion);
    if (embed) {
      li.innerHTML = `<strong>${cancion}</strong><br>${embed}`;
    } else {
      li.textContent = cancion;
    }
    lista.appendChild(li);
  });
      }

      // Estado inicial
      let canciones = cargarPlaylist();
      if (canciones.length) {
        renderizarLista(canciones);
        lista.style.display = 'block';
        toggleBtn.textContent = 'Ocultar Playlist';
      } else {
        lista.style.display = 'none';
        toggleBtn.textContent = 'Mostrar Playlist';
      }

      toggleBtn.addEventListener('click', () => {
        if (lista.style.display === 'none' || lista.style.display === '') {
          lista.style.display = 'block';
          toggleBtn.textContent = 'Ocultar Playlist';
        } else {
          lista.style.display = 'none';
          toggleBtn.textContent = 'Mostrar Playlist';
        }
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        const valor = input.value.trim();
        if (!valor) {
          mensaje.textContent = 'Por favor, ingresa el nombre o link de la canción.';
          mensaje.style.color = 'red';
          return;
        }

        // Agregar canción a lista y guardar
        canciones.push(valor);
        guardarPlaylist(canciones);
        renderizarLista(canciones);

        mensaje.textContent = '🎵 Canción agregada a la playlist.';
        mensaje.style.color = 'green';

        input.value = '';
        lista.style.display = 'block';
        toggleBtn.textContent = 'Ocultar Playlist';

        setTimeout(() => {
          mensaje.textContent = '';
        }, 3000);
      });
    })();
