const CITIES = [
  { id: "sankt-peterburg", name: "Санкт-Петербург", image: "assets/images/cities/sankt-peterburg.jpg" },
  { id: "kaliningrad", name: "Калининград", image: "assets/images/cities/kaliningrad2.jpg" },
  { id: "vyborg", name: "Выборг", image: "assets/images/cities/vyborg.jpg" },
  { id: "baltiysk", name: "Балтийск", image: "assets/images/cities/baltiysk.jpg" },
  { id: "yantarny", name: "Янтарный", image: "assets/images/cities/yantarny.jpg" },
  { id: "zelenogradsk", name: "Зеленоградск", image: "assets/images/cities/zelenogradsk.jpg" },
  { id: "sortavala", name: "\u0421\u043E\u0440\u0442\u0430\u0432\u0430\u043B\u0430", image: "assets/images/cities/sortavala.jpg" },
  { id: "nizhniy-novgorod", name: "Нижний Новгород", image: "assets/images/cities/nizhniy-novgorod.jpg" },
  { id: "tula", name: "Тула", image: "assets/images/cities/tula.jpg" },
  { id: "ryazan", name: "Рязань", image: "assets/images/cities/ryazan.jpg" },
  { id: "grodno", name: "Гродно", image: "assets/images/cities/grodno.jpg" },
];

const DRAG_THRESHOLD = 4;

const tierBoard = document.getElementById("tierBoard");
const tierOverlay = document.getElementById("tierOverlay");
const cityPoolGrid = document.getElementById("cityPoolGrid");
const cityPool = document.getElementById("cityPool");
const template = document.getElementById("cityCardTemplate");

let activeDrag = null;

function createCityCard(city) {
  const card = template.content.firstElementChild.cloneNode(true);
  const photo = card.querySelector(".city-card__photo");
  const name = card.querySelector(".city-card__name");

  card.dataset.cityId = city.id;
  photo.src = city.image;
  photo.alt = city.name;
  name.textContent = city.name;

  card.addEventListener("pointerdown", onPointerDown);
  return card;
}

function init() {
  CITIES.forEach((city) => {
    cityPoolGrid.appendChild(createCityCard(city));
  });
}

function onPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;

  const card = event.currentTarget;
  event.preventDefault();

  const rect = card.getBoundingClientRect();

  activeDrag = {
    card,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    startX: event.clientX,
    startY: event.clientY,
    wasOnBoard: card.classList.contains("is-on-board"),
    isDragging: false,
    pointerId: event.pointerId,
    rafId: null,
    pendingX: 0,
    pendingY: 0,
  };

  card.setPointerCapture(event.pointerId);
  card.addEventListener("pointermove", onPointerMove);
  card.addEventListener("pointerup", onPointerUp);
  card.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(event) {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

  const dx = event.clientX - activeDrag.startX;
  const dy = event.clientY - activeDrag.startY;

  if (!activeDrag.isDragging) {
    if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    beginDrag();
  }

  activeDrag.pendingX = event.clientX - activeDrag.offsetX;
  activeDrag.pendingY = event.clientY - activeDrag.offsetY;

  if (!activeDrag.rafId) {
    activeDrag.rafId = requestAnimationFrame(updateDragPosition);
  }
}

function updateDragPosition() {
  if (!activeDrag) return;

  activeDrag.rafId = null;
  const { card, pendingX, pendingY } = activeDrag;
  card.style.left = `${pendingX}px`;
  card.style.top = `${pendingY}px`;
}

function beginDrag() {
  const { card } = activeDrag;
  const rect = card.getBoundingClientRect();

  activeDrag.isDragging = true;

  document.body.appendChild(card);
  card.classList.add("is-dragging", "is-floating");

  card.style.width = `${rect.width}px`;
  card.style.height = `${rect.height}px`;
  card.style.left = `${rect.left}px`;
  card.style.top = `${rect.top}px`;
}

function onPointerUp(event) {
  if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

  const { card, isDragging, wasOnBoard, rafId } = activeDrag;

  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  card.releasePointerCapture(event.pointerId);
  card.removeEventListener("pointermove", onPointerMove);
  card.removeEventListener("pointerup", onPointerUp);
  card.removeEventListener("pointercancel", onPointerUp);

  card.classList.remove("is-dragging", "is-floating");

  if (isDragging) {
    if (isOverTierBoard(event.clientX, event.clientY)) {
      placeOnBoard(card, event.clientX, event.clientY);
    } else if (isOverPool(event.clientX, event.clientY) || !wasOnBoard) {
      returnCardToPool(card);
    } else {
      placeOnBoard(card, event.clientX, event.clientY);
    }
  }

  activeDrag = null;
}

function placeOnBoard(card, clientX, clientY) {
  const boardRect = tierBoard.getBoundingClientRect();
  const { offsetX, offsetY } = activeDrag;

  card.classList.add("is-on-board");
  clearFloatingStyles(card);
  card.style.left = `${clientX - boardRect.left - offsetX}px`;
  card.style.top = `${clientY - boardRect.top - offsetY}px`;

  tierOverlay.appendChild(card);
}

function returnCardToPool(card) {
  card.classList.remove("is-on-board");
  clearFloatingStyles(card);
  cityPoolGrid.appendChild(card);
}

function clearFloatingStyles(card) {
  card.style.width = "";
  card.style.height = "";
  card.style.left = "";
  card.style.top = "";
  card.style.transform = "";
  card.style.zIndex = "";
}

function isOverTierBoard(clientX, clientY) {
  const rect = tierBoard.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function isOverPool(clientX, clientY) {
  const poolRect = cityPool.getBoundingClientRect();
  return (
    clientX >= poolRect.left &&
    clientX <= poolRect.right &&
    clientY >= poolRect.top &&
    clientY <= poolRect.bottom
  );
}

init();
