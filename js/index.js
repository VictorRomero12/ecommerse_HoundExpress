function navigateBuscarGuias() {
  window.location.href = "../pages/buscarguias.html";
}

function navigateEstado() {
  window.location.href = "../pages/estado.html";
}

function navigateFormulario() {
  window.location.href = "../pages/formulario.html";
}

function navigateListaGuias() {
  window.location.href = "../pages/listaguias.html";
}

function navigateHistorialGuias() {
  window.location.href = "../pages/historialguias.html";
}

function navigateIndex() {
  window.location.href = "../index.html";
}

let guiasRegistradas = [];
let guiaActual = null;

const listasGuardadas = localStorage.getItem("guiasRegistradas");
if (listasGuardadas) {
  guiasRegistradas = JSON.parse(listasGuardadas);
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarFormulario();
  mostrarGuiasEnTabla();
  actualizarEstadisticass();
  mostrarHistorialGuias();
  inicializarModal();
});

function inicializarModal() {
  const modal = document.getElementById("modalActualizar");
  const btnCerrar = document.querySelector(".modal-close");
  const btnCancelar = document.getElementById("btnCancelar");
  const formActualizar = document.getElementById("formActualizar");

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarModal);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cerrarModal);
  }

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        cerrarModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("modal--active")
    ) {
      cerrarModal();
    }
  });

  if (formActualizar) {
    formActualizar.addEventListener("submit", actualizarGuia);
  }
}

function inicializarFormulario() {
  const formulario = document.querySelector(".form__container");
  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      registrarGuia();
    });
  }

  const fechaInput = document.getElementById("fecha_creacion");
  if (fechaInput && !fechaInput.value) {
    fechaInput.value = obtenerFechaActual();
  }
}

function registrarGuia() {
  const numeroGuia = document.getElementById("guia").value.trim();
  const origen = document.getElementById("origen").value.trim();
  const destino = document.getElementById("destino").value.trim();
  const destinatario = document.getElementById("destinatario").value.trim();
  const fechaCreacion = document.getElementById("fecha_creacion").value.trim();
  const estado = document.getElementById("estado").value;

  limpiarMensajesError();

  if (
    !validarCampos(numeroGuia, origen, destino, destinatario, fechaCreacion)
  ) {
    return;
  }

  const nuevaGuia = {
    numeroGuia: numeroGuia,
    origen: origen,
    destino: destino,
    destinatario: destinatario,
    fechaCreacion: fechaCreacion,
    estado: estado,
  };

  guiasRegistradas.push(nuevaGuia);
  mostrarMensajeExito("Guía registrada exitosamente.");
  localStorage.setItem("guiasRegistradas", JSON.stringify(guiasRegistradas));
  reset();
  actualizarListaGuias();
}

function validarCampos(
  numeroGuia,
  origen,
  destino,
  destinatario,
  fechaCreacion
) {
  let valido = true;

  if (numeroGuia === "") {
    mostrarMensajeError("El número de guía es obligatorio.", "guia");
    valido = false;
  }

  if (origen === "") {
    mostrarMensajeError("El origen es obligatorio.", "origen");
    valido = false;
  }

  if (destino === "") {
    mostrarMensajeError("El destino es obligatorio.", "destino");
    valido = false;
  }

  if (destinatario === "") {
    mostrarMensajeError("El destinatario es obligatorio.", "destinatario");
    valido = false;
  }

  if (fechaCreacion === "") {
    mostrarMensajeError(
      "La fecha de creación es obligatoria.",
      "fecha_creacion"
    );
    valido = false;
  }

  return valido;
}

function mostrarMensajeError(message, campoId) {
  const campo = document.getElementById(campoId);
  const grupo = campo.parentElement;

  const errorPrevio = grupo.querySelector(".error-message");
  if (errorPrevio) {
    errorPrevio.remove();
  }

  const messageError = document.createElement("span");
  messageError.className = "error-message";
  messageError.style.color = "red";
  messageError.style.fontSize = "0.9em";
  messageError.style.marginTop = "5px";
  messageError.style.display = "block";
  messageError.textContent = message;
  campo.style.borderColor = "red";
  grupo.appendChild(messageError);
}

function limpiarMensajesError() {
  const mensajesError = document.querySelectorAll(".error-message");
  mensajesError.forEach((mensaje) => mensaje.remove());
  const campos = document.querySelectorAll(
    ".form__group input, .form__group select"
  );
  campos.forEach((campo) => {
    campo.style.borderColor = "";
  });
}

function mostrarMensajeExito(mensaje) {
  const exitoPrevio = document.querySelector(".success-message");
  if (exitoPrevio) {
    exitoPrevio.remove();
  }

  const formulario = document.querySelector(".form__container");
  const messageSucess = document.createElement("div");
  messageSucess.className = "success-message";
  messageSucess.style.color = "green";
  messageSucess.style.backgroundColor = "#d4edda";
  messageSucess.style.border = "1px solid #c3e6cb";
  messageSucess.style.padding = "10px";
  messageSucess.style.marginBottom = "20px";
  messageSucess.style.borderRadius = "5px";
  messageSucess.textContent = mensaje;

  formulario.insertBefore(
    messageSucess,
    formulario.querySelector("h1").nextSibling
  );

  setTimeout(() => {
    if (messageSucess.parentElement) {
      messageSucess.remove();
    }
  }, 5000);
}

function abrirModalActualizar(numeroGuia) {
  const guia = guiasRegistradas.find((g) => g.numeroGuia === numeroGuia);
  if (!guia) {
    alert("Guía no encontrada");
    return;
  }

  guiaActual = guia;

  document.getElementById("modalNumeroGuia").value = guia.numeroGuia;
  document.getElementById("modalOrigen").value = guia.origen;
  document.getElementById("modalDestino").value = guia.destino;
  document.getElementById("modalDestinatario").value = guia.destinatario;
  document.getElementById("modalEstado").value = guia.estado;
  limpiarErroresModal();
  const modal = document.getElementById("modalActualizar");
  modal.classList.add("modal--active");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  const modal = document.getElementById("modalActualizar");
  modal.classList.remove("modal--active", "modal--loading");
  guiaActual = null;
  document.body.style.overflow = "";

  limpiarErroresModal();
  const form = document.getElementById("formActualizar");
  if (form) {
    form.reset();
  }
}

function mostrarErrorModal(mensaje, campoId) {
  const campo = document.getElementById(campoId);
  const grupo = campo.parentElement;
  const errorPrevio = grupo.querySelector(".modal-error-message");
  if (errorPrevio) {
    errorPrevio.remove();
  }

  grupo.classList.add("modal-form-group--error");

  const mensajeError = document.createElement("span");
  mensajeError.className = "modal-error-message";
  mensajeError.textContent = mensaje;
  grupo.appendChild(mensajeError);
}

function limpiarErroresModal() {
  const grupos = document.querySelectorAll(".modal-form-group");
  grupos.forEach((grupo) => {
    grupo.classList.remove(
      "modal-form-group--error",
      "modal-form-group--success"
    );
    const error = grupo.querySelector(".modal-error-message");
    if (error) {
      error.remove();
    }
  });
}

function actualizarGuia(e) {
  e.preventDefault();

  if (!guiaActual) {
    alert("Error: No hay guía seleccionada");
    return;
  }

  limpiarErroresModal();

  const nuevoOrigen = document.getElementById("modalOrigen").value.trim();
  const nuevoDestino = document.getElementById("modalDestino").value.trim();
  const nuevoDestinatario = document
    .getElementById("modalDestinatario")
    .value.trim();
  const nuevoEstado = document.getElementById("modalEstado").value;

  let hayErrores = false;

  if (!nuevoOrigen) {
    mostrarErrorModal("El origen es obligatorio", "modalOrigen");
    hayErrores = true;
  }

  if (!nuevoDestino) {
    mostrarErrorModal("El destino es obligatorio", "modalDestino");
    hayErrores = true;
  }

  if (!nuevoDestinatario) {
    mostrarErrorModal("El destinatario es obligatorio", "modalDestinatario");
    hayErrores = true;
  }

  if (hayErrores) {
    return;
  }

  const modal = document.getElementById("modalActualizar");
  modal.classList.add("modal--loading");
  setTimeout(() => {
    const indice = guiasRegistradas.findIndex(
      (g) => g.numeroGuia === guiaActual.numeroGuia
    );

    if (indice !== -1) {
      guiasRegistradas[indice].origen = nuevoOrigen;
      guiasRegistradas[indice].destino = nuevoDestino;
      guiasRegistradas[indice].destinatario = nuevoDestinatario;
      guiasRegistradas[indice].estado = nuevoEstado;

      localStorage.setItem(
        "guiasRegistradas",
        JSON.stringify(guiasRegistradas)
      );

      mostrarGuiasEnTabla();
      actualizarEstadisticass();

      mostrarMensajeExito("Guía actualizada exitosamente");

      cerrarModal();
    } else {
      modal.classList.remove("modal--loading");
      alert("Error: No se pudo encontrar la guía para actualizar");
    }
  }, 500);
}

function reset() {
  document.getElementById("guia").value = "";
  document.getElementById("origen").value = "";
  document.getElementById("destino").value = "";
  document.getElementById("destinatario").value = "";
  document.getElementById("fecha_creacion").value = obtenerFechaActual();
  document.getElementById("estado").value = "1";
}

function obtenerFechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

function obtenerTextoEstado(valorEstado) {
  const estados = {
    1: "Pendiente",
    2: "En tránsito",
    4: "Entregado",
  };
  return estados[valorEstado] || "Estado desconocido";
}

function formatearFecha(fecha) {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString("es-ES", opciones);
}

function mostrarGuiasEnTabla() {
  const tbody = document.getElementById("tabla-guias");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (guiasRegistradas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center;">No hay guías registradas</td></tr>';
    return;
  }

  guiasRegistradas.forEach((guia) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td><strong>${guia.numeroGuia}</strong></td>
            <td><span class="status status--${
              guia.estado === "1"
                ? "pending"
                : guia.estado === "2"
                ? "transit"
                : "delivered"
            }">${obtenerTextoEstado(guia.estado)}</span></td>
            <td>${guia.origen}</td>
            <td>${guia.destino}</td>
            <td>${guia.fechaCreacion}</td>
            <td>
                <button class="action-button action-button--update" onclick="abrirModalActualizar('${
                  guia.numeroGuia
                }')">
                    <span>Actualizar</span>
                </button>
                <button class="action-button action-button--history" onclick="navigateHistorialGuias()">
                    <span>Historial</span>
                </button>
                <button class="action-button action-button--history delete" onclick="borrarLista()">
                    <span>Borrar</span>
                </button>
            </td>
        `;
    tbody.appendChild(fila);
  });
}

function mostrarGuiasEnLista() {
  const contenedorLista = document.getElementById("lista-guias");
  if (!contenedorLista) return;

  contenedorLista.innerHTML = "";

  if (guiasRegistradas.length === 0) {
    contenedorLista.innerHTML = "<p>No hay guías registradas</p>";
    return;
  }

  const contenedorGuias = document.createElement("div");
  contenedorGuias.className = "guides-grid";

  guiasRegistradas.forEach((guia, index) => {
    const tarjetaGuia = document.createElement("div");
    tarjetaGuia.className = "card card--guide guide-card";

    tarjetaGuia.innerHTML = `
            <h3>Guía #${guia.numeroGuia}</h3>
            <div class="card--guide__details guide-details">
                <p><strong>Destinatario:</strong> ${guia.destinatario}</p>
                <p><strong>Ruta:</strong> ${guia.origen} → ${guia.destino}</p>
                <p><strong>Estado:</strong> <span class="status status--${
                  guia.estadoValor === "1"
                    ? "pending"
                    : guia.estadoValor === "2"
                    ? "transit"
                    : "delivered"
                }">${guia.estado}</span></p>
                <p><strong>Fecha de creación:</strong> ${formatearFecha(
                  guia.fechaCreacion
                )}</p>
            </div>
            <div class="card--guide__actions guide-actions">
                <button type="button" class="btn btn--secondary btn--sm" onclick="verDetalleGuia('${
                  guia.numeroGuia
                }')">
                    Ver detalles
                </button>
                <button type="button" class="btn btn--primary btn--sm" onclick="editarGuia('${
                  guia.numeroGuia
                }')">
                    Editar
                </button>
            </div>
        `;

    contenedorGuias.appendChild(tarjetaGuia);
  });

  contenedorLista.appendChild(contenedorGuias);
}

function actualizarEstadisticass() {
  const totalElement = document.getElementById("total-guias");
  const transitoElement = document.getElementById("guias-transito");
  const entregadasElement = document.getElementById("guias-entregadas");

  if (totalElement) {
    const total = guiasTotales();
    totalElement.textContent = total > 0 ? total : "No activas por el momento";
  }

  if (transitoElement) {
    const transito = guiasEnTransito();
    transitoElement.textContent =
      transito > 0 ? transito : "No hay guías en ruta por el momento";
  }

  if (entregadasElement) {
    const entregadas = guiasEntregadas();
    entregadasElement.textContent =
      entregadas > 0 ? entregadas : "No hay guías completadas por el momento";
  }
}

function guiasTotales() {
  return guiasRegistradas.length;
}

function guiasEnTransito() {
  return guiasRegistradas.filter((guia) => guia.estado === "2").length;
}

function guiasEntregadas() {
  return guiasRegistradas.filter((guia) => guia.estado === "4").length;
}

function guiasPendientes() {
  return guiasRegistradas.filter((guia) => guia.estado === "1").length;
}

function actualizarListaGuias() {
  const contenedorLista = document.querySelector("lista-guias");
  if (contenedorLista) {
    mostrarGuiasEnLista();
  }
}

function obtenerGuiasRegistradas() {
  return guiasRegistradas;
}

function borrarLista() {
  if (
    confirm(
      "¿Estás seguro de que deseas borrar todas las guías registradas? Esta acción no se puede deshacer."
    )
  ) {
    guiasRegistradas = [];
    localStorage.removeItem("guiasRegistradas");
    mostrarGuiasEnTabla();
    mostrarGuiasEnLista();
    mostrarMensajeExito("Todas las guías han sido borradas.");
  }
}

function verDetalleGuia(numeroGuia) {
  alert("Ver detalles de la guía #" + numeroGuia);
}

function editarGuia(numeroGuia) {
  alert("Editar guía #" + numeroGuia);
}

function mostrarModalGuia(numeroGuia) {
  const guia = guiasRegistradas.find((g) => g.numeroGuia === numeroGuia);
  const modal = document.getElementById("modalGuia");
  const contenido = document.getElementById("contenido-modal");

  contenido.innerHTML = `
        <h2>Detalles de Guía #${guia.numeroGuia}</h2>
        <p><strong>Destinatario:</strong> ${guia.destinatario}</p>
        <p><strong>Origen:</strong> ${guia.origen}</p>
        <p><strong>Destino:</strong> ${guia.destino}</p>
        <p><strong>Estado:</strong> ${obtenerTextoEstado(guia.estado)}</p>
        <p><strong>Fecha:</strong> ${guia.fechaCreacion}</p>
    `;

  modal.style.display = "block";
}
function mostrarHistorialGuias() {
  const historialContainer = document.querySelector(".history__list");
  if (!historialContainer) return;

  historialContainer.innerHTML = "";

  if (guiasRegistradas.length === 0) {
    historialContainer.innerHTML =
      "<p>No hay historial de guías registrado.</p>";
    return;
  }

  guiasRegistradas.forEach((guia) => {
    const item = document.createElement("div");
    item.className = "history__item";

    item.innerHTML = `
      <div class="history__header">
        <h3>Guía #${guia.numeroGuia}</h3>
        <span class="history__date">${formatearFecha(guia.fechaCreacion)}</span>
      </div>
      <div class="timeline">
        <div class="timeline__item timeline__item--completed">
          <span class="timeline__time">09:00</span>
          <p>Guía creada en ${guia.origen}</p>
        </div>
        <div class="timeline__item ${
          guia.estado === "2"
            ? "timeline__item--current"
            : "timeline__item--completed"
        }">
          <span class="timeline__time">--:--</span>
          <p>${obtenerTextoEstado(guia.estado)} hacia ${guia.destino}</p>
        </div>
      </div>
    `;

    historialContainer.appendChild(item);
  });
}
