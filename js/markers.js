const SIZE_LABELS = {
  chico: "Chico",
  mediano: "Mediano",
  grande: "Grande",
};

const SIZE_CLASS_NAMES = {
  chico: "parking-marker--chico",
  mediano: "parking-marker--mediano",
  grande: "parking-marker--grande",
};

function isValidSize(size) {
  return size === "chico" || size === "mediano" || size === "grande";
}

function getMarkerSizeClass(size) {
  return SIZE_CLASS_NAMES[size] ?? SIZE_CLASS_NAMES.mediano;
}

function getMarkerLabel(size) {
  return SIZE_LABELS[size] ?? SIZE_LABELS.mediano;
}

export function createMarkerElement(marker, onRemove) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `parking-marker ${getMarkerSizeClass(marker.size)}`;
  button.style.left = `${marker.x}%`;
  button.style.top = `${marker.y}%`;
  button.setAttribute("aria-label", `Eliminar lugar ${getMarkerLabel(marker.size)} en ${Math.round(marker.x)} por ciento horizontal y ${Math.round(marker.y)} por ciento vertical`);
  button.title = `Eliminar ${getMarkerLabel(marker.size)}`;
  button.textContent = getMarkerLabel(marker.size).charAt(0);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onRemove(marker.id);
  });

  return button;
}

export function normalizeMarkerRecord(id, marker) {
  if (!id || !marker || typeof marker !== "object") {
    return null;
  }

  const x = Number(marker.x);
  const y = Number(marker.y);
  const size = typeof marker.size === "string" && isValidSize(marker.size) ? marker.size : "mediano";
  const createdAt = typeof marker.createdAt === "string" ? marker.createdAt : new Date().toISOString();

  if (Number.isNaN(x) || Number.isNaN(y)) {
    return null;
  }

  return {
    id,
    x,
    y,
    size,
    createdAt,
  };
}

export function markersFromFirebaseSnapshot(snapshotValue) {
  if (!snapshotValue || typeof snapshotValue !== "object") {
    return [];
  }

  return Object.entries(snapshotValue)
    .map(([id, marker]) => normalizeMarkerRecord(id, marker))
    .filter(Boolean)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id));
}

export function renderMarkers(markerLayer, markers, onRemove) {
  markerLayer.replaceChildren();

  for (const marker of markers) {
    markerLayer.append(createMarkerElement(marker, onRemove));
  }
}

export function countMarkersBySize(markers) {
  return markers.reduce(
    (counts, marker) => {
      if (marker.size === "chico") {
        counts.chico += 1;
      } else if (marker.size === "grande") {
        counts.grande += 1;
      } else {
        counts.mediano += 1;
      }

      return counts;
    },
    { chico: 0, mediano: 0, grande: 0 }
  );
}

export function createMarkerRecord({ id = null, x, y, size }) {
  const marker = {
    x,
    y,
    size,
    createdAt: new Date().toISOString(),
  };

  if (id) {
    marker.id = id;
  }

  return marker;
}
