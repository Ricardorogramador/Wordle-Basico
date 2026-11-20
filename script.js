// POST https://words.dev-apis.com/validate-word
let palabraSecreta = "gatos";
let numeroFila = 0;
init();

async function obtenerPalabra() {
  try {
    const respuestaServidor = await fetch(
      "https://words.dev-apis.com/word-of-the-day",
    );

    if (!respuestaServidor.ok) {
      throw new Error("Error al obtener palabra");
    }

    const datos = await respuestaServidor.json();
    palabraSecreta = datos.word;
  } catch (error) {
    console.error("Error al obtener palabra");
  }
}

async function obtenerPalabraRandom() {
  try {
    const respuestaServidor = await fetch(
      "https://words.dev-apis.com/word-of-the-day?random=1",
    );

    if (!respuestaServidor.ok) {
      throw new Error("Error al obtener palabra");
    }

    const datos = await respuestaServidor.json();
    palabraSecreta = datos.word;
  } catch (error) {
    console.error("Error al obtener palabra");
  }
}

async function init() {
  const titulo = document.createElement("h1");
  const botonLimpiar = document.createElement("button");
  const botonNuevaPalabra = document.createElement("button");
  titulo.classList.add("titulo");
  titulo.textContent = "Wordle";
  botonLimpiar.textContent = "Limpiar";
  botonLimpiar.classList.add("limpiar");
  botonNuevaPalabra.textContent = "Nueva Palabra";
  botonNuevaPalabra.classList.add("nuevaPalabra");
  document.body.appendChild(titulo);
  filasCreadas();
  document.body.appendChild(botonLimpiar);
  document.body.appendChild(botonNuevaPalabra);
  desactivarFilas();
  await obtenerPalabra();
}

const botonLimpiar = document.querySelector(".limpiar");
const botonNuevaPalabra = document.querySelector(".nuevaPalabra");

botonLimpiar.addEventListener("click", function () {
  console.log("funciona limpiar");
  limpiarFila();
});

botonNuevaPalabra.addEventListener("click", async function () {
  await obtenerPalabraRandom();
  numeroFila = 0;
  limpiarFilas();
  desactivarFilas();
  activarFila();
  console.log("funciona boton nueva palabra");
});

addEventListener("keydown", function (evento) {
  console.log(evento.key);
  if (evento.key === "Enter") {
    verificacion(leerFila());
  }
  if (
    evento.key === "Backspace" &&
    evento.target.classList.contains("letras")
  ) {
    const actual = evento.target;
    if (actual.value === "") {
      const anterior = actual.previousElementSibling;
      if (anterior) {
        anterior.focus();
      }
    }
  }
});

function columnasCreadas(tarjeta) {
  for (let i = 1; i <= 5; i++) {
    const inputs = document.createElement("input");
    inputs.classList.add("letras");
    inputs.setAttribute("type", "text");
    inputs.setAttribute("maxlength", "1");
    tarjeta.appendChild(inputs);
  }
  document.body.appendChild(tarjeta);
}

function filasCreadas() {
  for (let i = 1; i <= 6; i++) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("fila");
    columnasCreadas(tarjeta);
  }
}

function leerFila() {
  const fila = document.querySelectorAll(".fila")[numeroFila];
  const letra = fila.querySelectorAll(".letras");
  let palabra = "";
  for (let i = 0; i < letra.length; i++) {
    const valor = letra[i].value;
    if (isLetter(valor)) {
      palabra = palabra + valor;
    }
  }
  palabra = palabra.toLowerCase();
  return palabra;
}

function verificacion(palabra) {
  if (palabra.length != 5) {
    alert("Completa la fila");
    return;
  }
  const contador = {};
  for (let i = 0; i < palabraSecreta.length; i++) {
    const letra = palabraSecreta[i];
    contador[letra] = (contador[letra] || 0) + 1;
  }

  const resultado = new Array(5);
  for (let i = 0; i < palabra.length; i++) {
    const letra = palabra[i];
    if (letra === palabraSecreta[i]) {
      resultado[i] = { letra, estado: "exacta", posicion: i };
      contador[letra]--;
    }
  }

  for (let i = 0; i < palabra.length; i++) {
    if (resultado[i]) continue;

    const letra = palabra[i];

    if (contador[letra] > 0) {
      resultado[i] = { letra, estado: "desordenada", posicion: i };
      contador[letra]--;
    } else {
      resultado[i] = { letra, estado: "incorrecta", posicion: i };
    }
  }

  pintarFila(resultado);
  if (palabra === palabraSecreta) {
    desactivarFila();
    desactivarFilas();
    return;
  }

  if (palabra !== palabraSecreta) {
    desactivarFila();
    numeroFila++;
    if (numeroFila >= 6) {
      numeroFila = 0;
      alert("Has perdido");
      return;
    }
    activarFila();
    focusFila();
  }
}

function pintarFila(resultado) {
  const fila = document.querySelectorAll(".fila")[numeroFila];
  const inputs = fila.querySelectorAll(".letras");

  resultado.forEach((element) => {
    inputs[element.posicion].classList.add(element.estado);
  });
}

function desactivarFila() {
  const fila = document.querySelectorAll(".fila")[numeroFila];
  const inputs = fila.querySelectorAll(".letras");
  inputs.forEach((input) => {
    input.disabled = true;
  });
}

function focusFila() {
  const fila = document.querySelectorAll(".fila")[numeroFila];
  if (fila) {
    const inputs = fila.querySelectorAll(".letras");
    inputs[0].focus();
  }
}

function desactivarFilas() {
  for (let i = 1; i < 6; i++) {
    const fila = document.querySelectorAll(".fila")[i];
    const inputs = fila.querySelectorAll(".letras");
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }
}

function activarFila() {
  const fila = document.querySelectorAll(".fila")[numeroFila];
  const inputs = fila.querySelectorAll(".letras");
  inputs.forEach((input) => {
    input.disabled = false;
  });
}

function limpiarFila() {
  const filas = document.querySelectorAll(".fila");
  const inputs = filas[numeroFila].querySelectorAll(".letras");
  inputs.forEach((input) => {
    input.value = "";
    input.classList.remove("exacta", "desordenada", "incorrecta");
  });
  inputs[0].focus();
}

function limpiarFilas() {
  const inputs = document.querySelectorAll(".fila .letras");
  inputs.forEach((input) => {
    input.value = "";
    input.classList.remove("exacta", "desordenada", "incorrecta");
  });
  focusFila();
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
