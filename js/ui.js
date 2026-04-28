import { countMarkersBySize } from "./markers.js";

const STATUS_RESET_DELAY = 2400;
const SIZE_PREFERENCE_KEY = "parkmap-selected-size-v2";

let statusResetTimer = null;

function setStatusVariant(messageElement, variant) {
  messageElement.classList.remove("is-success", "is-warning");

  if (variant === "success") {
    messageElement.classList.add("is-success");
  } else if (variant === "warning") {
    messageElement.classList.add("is-warning");
  }
}

export function setActiveSizeButton(buttonGroup, selectedSize) {
  const buttons = buttonGroup.querySelectorAll("[data-size]");

  buttons.forEach((button) => {
    const isActive = button.dataset.size === selectedSize;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function getSelectedSize(buttonGroup) {
  const activeButton = buttonGroup.querySelector(".is-active[data-size]");
  return activeButton?.dataset.size ?? "mediano";
}

export function loadSelectedSizePreference() {
  const storedValue = window.localStorage.getItem(SIZE_PREFERENCE_KEY);
  return storedValue === "chico" || storedValue === "mediano" || storedValue === "grande" ? storedValue : "mediano";
}

export function saveSelectedSizePreference(size) {
  window.localStorage.setItem(SIZE_PREFERENCE_KEY, size);
}

export function updateCounters(counterElements, markers) {
  const counts = countMarkersBySize(markers);

  counterElements.total.textContent = String(markers.length);
  counterElements.small.textContent = String(counts.chico);
  counterElements.medium.textContent = String(counts.mediano);
  counterElements.large.textContent = String(counts.grande);
}

export function showStatus(messageElement, message, variant = "neutral") {
  if (statusResetTimer) {
    window.clearTimeout(statusResetTimer);
    statusResetTimer = null;
  }

  messageElement.textContent = message;
  setStatusVariant(messageElement, variant);

  if (variant !== "neutral") {
    statusResetTimer = window.setTimeout(() => {
      messageElement.textContent = "Listo para agregar marcas.";
      setStatusVariant(messageElement, "neutral");
      statusResetTimer = null;
    }, STATUS_RESET_DELAY);
  }
}

export function setPlanEmptyState(planElement, emptyStateElement, isEmpty) {
  planElement.classList.toggle("is-empty", isEmpty);
  emptyStateElement.hidden = !isEmpty;
}
