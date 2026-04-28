import { database, ref, push, remove, onValue } from "./firebase-config.js";
import { countMarkersBySize, createMarkerRecord, markersFromFirebaseSnapshot, renderMarkers } from "./markers.js";
import { getSelectedSize, loadSelectedSizePreference, saveSelectedSizePreference, setActiveSizeButton, setPlanEmptyState, showStatus, updateCounters } from "./ui.js";

const SIZE_ORDER = ["chico", "mediano", "grande"];
const STORAGE_FALLBACK_SIZE = "mediano";

const dom = {
  plan: document.getElementById("parking-plan"),
  planImage: document.getElementById("parking-plan-image"),
  markerLayer: document.getElementById("marker-layer"),
  emptyState: document.getElementById("plan-empty-state"),
  sizeSelector: document.getElementById("vehicle-size-selector"),
  clearButton: document.getElementById("clear-all-button"),
  statusMessage: document.getElementById("status-message"),
  counters: {
    total: document.getElementById("total-count"),
    small: document.getElementById("small-count"),
    medium: document.getElementById("medium-count"),
    large: document.getElementById("large-count"),
  },
};

const state = {
  markers: [],
  planHasImage: false,
  markersRef: ref(database, "markers"),
  firstSyncCompleted: false,
};

function clampPercentage(value) {
  return Math.min(100, Math.max(0, value));
}

function getCoordinatesFromEvent(event) {
  const rect = dom.plan.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return {
    x: clampPercentage(Number(x.toFixed(1))),
    y: clampPercentage(Number(y.toFixed(1))),
  };
}

function persistAndRender() {
  renderMarkers(dom.markerLayer, state.markers, handleRemoveMarker);
  updateCounters(dom.counters, state.markers);
}

function syncMarkers(markers) {
  state.markers = markers;
  persistAndRender();
}

function handleAddMarker(event) {
  if (event.target.closest(".parking-marker")) {
    return;
  }

  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  const coordinates = getCoordinatesFromEvent(event);
  const selectedSize = getSelectedSize(dom.sizeSelector) || STORAGE_FALLBACK_SIZE;
  const marker = createMarkerRecord({
    x: coordinates.x,
    y: coordinates.y,
    size: SIZE_ORDER.includes(selectedSize) ? selectedSize : STORAGE_FALLBACK_SIZE,
  });
  // Push the marker value; the generated key will be visible in the database snapshot.
  const write = push(state.markersRef, marker);

  Promise.resolve(write)
    .then(() => {
      showStatus(dom.statusMessage, `Lugar ${marker.size} agregado.`, "success");
    })
    .catch(() => {
      showStatus(dom.statusMessage, "No se pudo guardar la marca en Firebase.", "warning");
    });
}

function handleRemoveMarker(markerId) {
  const marker = state.markers.find((item) => item.id === markerId);

  if (!marker) {
    return;
  }

  remove(ref(database, `markers/${markerId}`))
    .then(() => {
      showStatus(dom.statusMessage, `Lugar ${marker.size} eliminado.`, "warning");
    })
    .catch(() => {
      showStatus(dom.statusMessage, "No se pudo eliminar la marca en Firebase.", "warning");
    });
}

function handleSizeSelection(event) {
  const button = event.target.closest("[data-size]");

  if (!button) {
    return;
  }

  setActiveSizeButton(dom.sizeSelector, button.dataset.size);
  saveSelectedSizePreference(button.dataset.size);
  showStatus(dom.statusMessage, `Tamaño seleccionado: ${button.textContent}.`);
}

function handleClearAll() {
  if (state.markers.length === 0) {
    showStatus(dom.statusMessage, "No hay marcas para limpiar.", "warning");
    return;
  }

  const shouldClear = window.confirm("¿Quieres borrar todas las marcas del plano?");

  if (!shouldClear) {
    showStatus(dom.statusMessage, "Limpieza cancelada.");
    return;
  }

  remove(state.markersRef)
    .then(() => {
      showStatus(dom.statusMessage, "Todas las marcas fueron eliminadas.", "success");
    })
    .catch(() => {
      showStatus(dom.statusMessage, "No se pudo limpiar Firebase.", "warning");
    });
}

function handlePlanImageLoad() {
  if (!dom.planImage.naturalWidth || !dom.planImage.naturalHeight) {
    return;
  }

  state.planHasImage = true;
  dom.plan.style.aspectRatio = `${dom.planImage.naturalWidth} / ${dom.planImage.naturalHeight}`;
  setPlanEmptyState(dom.plan, dom.emptyState, false);
}

function handlePlanImageError() {
  state.planHasImage = false;
  dom.plan.classList.add("is-empty");
  setPlanEmptyState(dom.plan, dom.emptyState, true);
}

function bindEvents() {
  dom.plan.addEventListener("click", handleAddMarker);
  dom.sizeSelector.addEventListener("click", handleSizeSelection);
  dom.clearButton.addEventListener("click", handleClearAll);
  dom.planImage.addEventListener("load", handlePlanImageLoad);
  dom.planImage.addEventListener("error", handlePlanImageError);

  window.addEventListener("resize", () => {
    renderMarkers(dom.markerLayer, state.markers, handleRemoveMarker);
  });
}

function initialize() {
  const preferredSize = loadSelectedSizePreference();
  setActiveSizeButton(dom.sizeSelector, preferredSize);
  persistAndRender();

  onValue(
    state.markersRef,
    (snapshot) => {
      syncMarkers(markersFromFirebaseSnapshot(snapshot.val()));

      if (!state.firstSyncCompleted) {
        state.firstSyncCompleted = true;

        if (state.markers.length > 0) {
          const counts = countMarkersBySize(state.markers);
          showStatus(
            dom.statusMessage,
            `Se cargaron ${state.markers.length} marcas guardadas: ${counts.chico} chico, ${counts.mediano} mediano y ${counts.grande} grande.`
          );
        }
      }
    },
    () => {
      showStatus(dom.statusMessage, "No se pudo escuchar Firebase Realtime Database.", "warning");
    }
  );

  if (dom.planImage.complete) {
    if (dom.planImage.naturalWidth && dom.planImage.naturalHeight) {
      handlePlanImageLoad();
    } else {
      handlePlanImageError();
    }
  }

  if (!state.planHasImage) {
    showStatus(dom.statusMessage, "Coloca assets/ParkingMap.png para ver el plano real.", "warning");
    return;
  }
}

bindEvents();
initialize();
