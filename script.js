const CITIES = [
  { id: "sankt-peterburg", name: "Санкт-Петербург", image: "assets/images/cities/sankt-peterburg.jpg" },
  { id: "kaliningrad", name: "Калининград", image: "assets/images/cities/kaliningrad.jpg" },
  { id: "kaliningrad2", name: "Калининград", image: "assets/images/cities/kaliningrad2.jpg" },
  { id: "vyborg", name: "Выборг", image: "assets/images/cities/vyborg.jpg" },
  { id: "baltiysk", name: "Балтийск", image: "assets/images/cities/baltiysk.jpg" },
  { id: "yantarny", name: "Янтарный", image: "assets/images/cities/yantarny.jpg" },
  { id: "zelenogradsk", name: "Зеленоградск", image: "assets/images/cities/zelenogradsk.jpg" },
  { id: "sortavala", name: "\u0421\u043E\u0440\u0442\u0430\u0432\u0430\u043B\u0430", image: "assets/images/cities/sortavala.jpg" },
  { id: "nizhniy-novgorod", name: "Нижний Новгород", image: "assets/images/cities/nizhniy-novgorod.jpg" },
  { id: "tula", name: "Тула", image: "assets/images/cities/tula.jpg" },
  { id: "ryazan", name: "Рязань", image: "assets/images/cities/ryazan.jpg" },
];

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
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  activeDrag = {
    card,
    offsetX,
    offsetY,
    wasOnBoard: card.classList.contains("is-on-board"),
  };

  card.classList.add("is-dragging");
  card.setPointerCapture(event.pointerId);

  if (!activeDrag.wasOnBoard) {
    moveCardToBoard(card, rect.left, rect.top);
  }

  card.addEventListener("pointermove", onPointerMove);
  card.addEventListener("pointerup", onPointerUp);
  card.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(event) {
  if (!activeDrag) return;

  const { card, offsetX, offsetY } = activeDrag;
  const boardRect = tierBoard.getBoundingClientRect();

  const x = event.clientX - boardRect.left - offsetX;
  const y = event.clientY - boardRect.top - offsetY;

  card.style.left = `${x}px`;
  card.style.top = `${y}px`;
}

function onPointerUp(event) {
  if (!activeDrag) return;

  const { card } = activeDrag;
  card.classList.remove("is-dragging");
  card.releasePointerCapture(event.pointerId);

  card.removeEventListener("pointermove", onPointerMove);
  card.removeEventListener("pointerup", onPointerUp);
  card.removeEventListener("pointercancel", onPointerUp);

  if (isOverPool(event.clientX, event.clientY)) {
    returnCardToPool(card);
  }

  activeDrag = null;
}

function moveCardToBoard(card, screenLeft, screenTop) {
  const boardRect = tierBoard.getBoundingClientRect();

  card.classList.add("is-on-board");
  tierOverlay.appendChild(card);

  card.style.left = `${screenLeft - boardRect.left}px`;
  card.style.top = `${screenTop - boardRect.top}px`;
}

function returnCardToPool(card) {
  card.classList.remove("is-on-board");
  card.style.left = "";
  card.style.top = "";
  cityPoolGrid.appendChild(card);
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
