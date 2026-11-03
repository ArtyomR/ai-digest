/* ============================================================
   Логика сайта: поиск, фильтр по тегам, анимация карточек.
   Всё работает в браузере — без перезагрузки страницы.
   ============================================================ */

// Находим нужные элементы на странице
const searchInput = document.getElementById("search-input");
const tagFilterBox = document.getElementById("tag-filter");
const cardsGrid = document.getElementById("cards-grid");
const allCards = Array.from(document.querySelectorAll(".card"));
const emptyState = document.getElementById("empty-state");
const resetButton = document.getElementById("reset-button");
const counter = document.getElementById("results-counter");

// Состояние (что сейчас выбрано пользователем)
let currentQuery = "";   // текст поиска
let currentTag = "";     // выбранный тег ("" = все карточки)


/* ---------- 1. Собираем список тегов из карточек ---------- */

function buildTagFilter() {
  // Собираем уникальные теги в Set (Set не повторяет значения)
  const tags = new Set();
  allCards.forEach(card => {
    card.dataset.tags.split(",").forEach(tag => tags.add(tag));
  });

  // Кнопка "Все" — показывает всё без фильтра
  const allButton = document.createElement("button");
  allButton.className = "chip active";
  allButton.textContent = "Все";
  allButton.addEventListener("click", () => setTag("", allButton));
  tagFilterBox.appendChild(allButton);

  // Кнопка для каждого тега
  tags.forEach(tag => {
    const button = document.createElement("button");
    button.className = "chip";
    button.textContent = tag;
    button.addEventListener("click", () => setTag(tag, button));
    tagFilterBox.appendChild(button);
  });
}


/* ---------- 2. Выбор тега ---------- */

function setTag(tag, clickedButton) {
  currentTag = tag;
  // Подсветим только нажатую кнопку
  tagFilterBox.querySelectorAll(".chip").forEach(chip => chip.classList.remove("active"));
  clickedButton.classList.add("active");
  applyFilters();
}


/* ---------- 3. Главная функция: спрятать/показать карточки ---------- */

function applyFilters() {
  let visibleCount = 0;

  allCards.forEach(card => {
    // Что ищем: заголовок + описание + теги карточки
    const tags = card.dataset.tags.split(",");
    const inTitle = card.dataset.title.includes(currentQuery);
    const inDescription = card.dataset.description.includes(currentQuery);
    const inTags = tags.some(tag => tag.includes(currentQuery));

    const matchesSearch = currentQuery === "" || inTitle || inDescription || inTags;
    const matchesTag = currentTag === "" || tags.includes(currentTag);

    if (matchesSearch && matchesTag) {
      card.classList.remove("hidden");  // show
      visibleCount++;
    } else {
      card.classList.add("hidden");     // hide
    }
  });

  // Показываем "ничего не нашли", если совпадений нет
  emptyState.classList.toggle("hidden", visibleCount > 0);

  // Обновляем счётчик
  counter.textContent = `Показано карточек: ${visibleCount} из ${allCards.length}`;
  if (currentQuery === "" && currentTag === "") counter.textContent = `Всего карточек: ${allCards.length}`;
}


/* ---------- 4. Поиск (с небольшой задержкой) ---------- */

let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  // Задержка 300 мс, чтобы не перерисовывать на каждую букву
  searchTimer = setTimeout(() => {
    currentQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  }, 300);
});


/* ---------- 5. Клик по тегу ВНУТРИ карточки тоже фильтрует ---------- */

document.querySelectorAll(".card-tags .tag").forEach(tagButton => {
  tagButton.addEventListener("click", () => {
    const tag = tagButton.dataset.tag;
    // Ищем кнопку с таким тегом в верхнем фильтре и "нажимаем" её
    const chip = Array.from(tagFilterBox.children).find(chip => chip.textContent === tag);
    if (chip) chip.click();
    // Плавно поднимаемся к фильтру, чтобы пользователь увидел результат
    document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
  });
});


/* ---------- 6. Кнопка "Сбросить всё" ---------- */

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  currentQuery = "";
  const allChip = tagFilterBox.querySelector(".chip");
  allChip.click(); // нажимаем кнопку "Все"
  searchInput.focus();
});


/* ---------- 7. Плавное каскадное появление карточек ---------- */

// Показываем карточки по очереди: первая сразу, вторая через 80 мс, и так далее
allCards.forEach((card, index) => {
  setTimeout(() => card.classList.add("visible"), 200 + index * 80);
});


/* ---------- Запуск ---------- */
buildTagFilter();
applyFilters();
