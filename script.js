/*
 * ♡ НАЛАШТУВАННЯ САЙТУ ♡
 * 1. Впиши свою пошту у RECIPIENT_EMAIL (нижче).
 * 2. Сім назв та повних описів уже вставлено в IDEAS. Додай лише фото.
 * 3. Додай свої фотографії до папки assets/.
 * Ніяких npm, бібліотек чи серверів не потрібно.
 */

const RECIPIENT_EMAIL = "emmideagorn@gmail.com"; // Приклад: "myaddress@gmail.com". Залишено порожнім навмисно.

const IDEAS = [
  {
    id: 1,
    title: "Вечір вина, сиру та кіно",
    description:
      "Купуємо вино (яке ти не любиш хахах), декілька видів сиру, оливки, виноград та інші смаколики. Вмикаємо цікавий фільм, запалюємо свічки, вкриваємося пледом і просто насолоджуємося вечором удвох.",
    image: "assets/idea-1.jpg",
    emoji: "🍷",
  },
  {
    id: 2,
    title: "Суші, наливка та настільні ігри",
    description:
      "Замовляємо суші, наливаємо наливки з ДД (надіюся) й влаштовуємо ігровий вечір. Можемо грати в морський бій, хрестики-нулики та інші ігри, намальовані маркерами на пергаменті.",
    image: "assets/idea-2.png",
    emoji: "🍣",
  },
  {
    id: 3,
    title: "Пиво, чіпси, рибка та кіно",
    description:
      "Беремо улюблені чіпси, сушену рибку, пиво, обираємо фільм або серіал і влаштовуємо собі домашній релакс. ",
    image: "assets/idea-3.png",
    emoji: "🍺",
  },
  {
    id: 4,
    title: "Вечір пазлів",
    description:
      "Купуємо пазл, готуємо смаколики, напої, вмикаємо щось фоном і поступово збираємо картинку разом.",
    image: "assets/idea-4.png",
    emoji: "🧩",
  },
  {
    id: 5,
    title: "Побачення з повітряним пластиліном",
    description:
      "Купуємо різнокольоровий повітряний пластилін і ліпимо милі фігурки. А на фоні — мультфільм, попкорн і щось смачненьке.",
    image: "assets/idea-5.png",
    emoji: "🎨",
  },
  {
    id: 6,
    title: "Розмальовка на двох",
    description:
      "Обираємо одну  розмальовку, розрізаємо її навпіл і кожна отримує свою частину. Не підглядаючи одна до одної, розфарбовуємо її так, як нам подобається. А потім з'єднуємо дві половинки й дивимося, що в нас вийшло. Цікаво буде побачити, наскільки по-різному ми бачимо одну й ту саму картинку.",
    image: "assets/idea-6.png",
    emoji: "🖍️",
  },
  {
    id: 7,
    title: "Roblox & Pizza Night",
    description:
      "Замовляємо велику піцу, беремо напої, снеки й влаштовуємо спільний ігровий вечір у Roblox або дурак на телефоні або інше.",
    image: "assets/idea-7.png",
    emoji: "🎮",
  },
];

/* Нижче — логіка сайту. Редагувати її для додавання фотографій не потрібно. */
const STORAGE_KEY = "oursDateTournament_v4_text"; // Зберігаємо існуючий прогрес користувачів
const TOTAL_VOTES = 7;
const COLORS = [
  "linear-gradient(145deg,#f3c9d4,#f9e8d7)",
  "linear-gradient(145deg,#f6d4c3,#ffe5db)",
  "linear-gradient(145deg,#e5d5ef,#f5d7e6)",
  "linear-gradient(145deg,#d5e6db,#f4e8cb)",
  "linear-gradient(145deg,#fbd6e8,#e6d8f2)",
  "linear-gradient(145deg,#fae1bd,#f5cede)",
  "linear-gradient(145deg,#d7d6f5,#f4d4de)",
];
const el = (id) => document.getElementById(id);
const getIdea = (id) => IDEAS.find((idea) => idea.id === id);
const screens = ["intro-screen", "battle-screen", "results-screen"];
let state = loadState();
let votingLocked = false;

function randomize(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function createInitialState() {
  return {
    stage: "intro",
    queue: [],
    winners: [],
    losers: [],
    byeId: null,
    finalists: [],
    semiLosers: [],
    champion: null,
    second: null,
    third: null,
    completed: 0,
    history: [],
    emailState: "idle",
    matchLog: [],
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (
      saved &&
      ["intro", "quarter", "semi", "final", "bronze", "results"].includes(
        saved.stage,
      ) &&
      Array.isArray(saved.queue) &&
      Array.isArray(saved.history) &&
      Number.isInteger(saved.completed)
    ) {
      return saved;
    }
  } catch {
    /* LocalStorage може бути недоступним у деяких браузерах */
  }
  return createInitialState();
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* не блокуємо гру */
  }
}
function snapshot() {
  const { history, ...rest } = state;
  return JSON.parse(JSON.stringify(rest));
}
function showScreen(screenId) {
  screens.forEach((id) => {
    el(id).hidden = id !== screenId;
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}
function startTournament() {
  const order = randomize(IDEAS.map((idea) => idea.id));
  state = createInitialState();
  state.byeId = order[6]; // випадкова ідея проходить у півфінал без першої дуелі
  state.stage = "quarter";
  state.queue = [
    [order[0], order[1]],
    [order[2], order[3]],
    [order[4], order[5]],
  ];
  saveState();
  render();
}
function setCard(side, id) {
  const idea = getIdea(id);
  if (!idea) return;
  el(`date-title-${side}`).textContent = idea.title;
  el(`date-description-${side}`).textContent = idea.description;
  el(`date-number-${side}`).textContent =
    `ІДЕЯ ${String(idea.id).padStart(2, "0")}`;
  const desc = el(`date-description-${side}`);
  const expandBtn = el(`expand-${side}`);
  desc.classList.remove("expanded");
  expandBtn.setAttribute("aria-expanded", "false");
  expandBtn.textContent = "Читати повністю ↓";
  el(`date-emoji-${side}`).textContent = idea.emoji || "♡";
  el(`date-art-${side}`).style.setProperty(
    "--card-bg",
    COLORS[(idea.id - 1) % COLORS.length],
  );
  el(`choose-${side}`).setAttribute("aria-label", `Обрати «${idea.title}»`);

  const img = el(`date-photo-${side}`);
  const fallback = el(`date-fallback-${side}`);
  img.onload = () => {
    img.hidden = false;
    fallback.hidden = true;
  };
  img.onerror = () => {
    img.hidden = true;
    fallback.hidden = false;
  };
  if (idea.image && idea.image.trim()) {
    // Якщо файл існує, він автоматично замінить градієнтну заглушку.
    img.hidden = true;
    fallback.hidden = false;
    img.src = idea.image;
  } else {
    img.removeAttribute("src");
    img.hidden = true;
    fallback.hidden = false;
  }
}
function setStageText() {
  const meta = {
    quarter: [
      "РАУНД 1 / 4",
      "Перші симпатії",
      "Обирай ту ідею, яка подобається більше ♡",
    ],
    semi: [
      "РАУНД 2 / 4",
      "Півфінал",
      "Найцікавіше починається. Хто піде далі?",
    ],
    final: [
      "РАУНД 3 / 4",
      "Великий фінал",
      "Тільки одна ідея стане номером один!",
    ],
    bronze: [
      "РАУНД 4 / 4",
      "Матч за третє місце",
      "Ще один вибір — і готовий наш топ-3.",
    ],
  };
  const [label, title, subtitle] = meta[state.stage];
  el("stage-overline").textContent = label;
  el("battle-title").textContent = title;
  el("stage-subtitle").textContent = subtitle;
}
function renderBattle() {
  showScreen("battle-screen");
  setStageText();
  el("completed-count").textContent = String(state.completed);
  el("progress-dots").replaceChildren(
    ...Array.from({ length: TOTAL_VOTES }, (_, i) => {
      const dot = document.createElement("span");
      dot.className = `progress-dot${i < state.completed ? " filled" : ""}`;
      return dot;
    }),
  );
  if (!state.queue.length) return;
  const [leftId, rightId] = state.queue[0];
  setCard("left", leftId);
  setCard("right", rightId);
  el("undo-button").disabled = state.history.length === 0;
  el("skip-button").disabled = state.queue.length < 2;
  el("battle-notice").textContent = "";
  el("date-card-left").classList.remove("chosen");
  el("date-card-right").classList.remove("chosen");
  votingLocked = false;
}
function castVote(side) {
  if (votingLocked || !state.queue.length) return;
  votingLocked = true;
  const pair = state.queue[0];
  const winId = pair[side === "left" ? 0 : 1];
  const loseId = pair[side === "left" ? 1 : 0];
  el(`date-card-${side}`).classList.add("chosen");
  state.history.push(snapshot());
  window.setTimeout(() => {
    state.queue.shift();
    state.completed++;
    state.winners.push(winId);
    state.losers.push(loseId);
    state.matchLog.push({
      stage: state.stage,
      contestants: pair,
      winner: winId,
    });
    moveNextIfNeeded();
    saveState();
    render();
    if (state.stage === "results") sendEmail();
  }, 240);
}
function moveNextIfNeeded() {
  if (state.queue.length) return;
  if (state.stage === "quarter") {
    const semifinalists = randomize([...state.winners, state.byeId]);
    state.queue = [
      [semifinalists[0], semifinalists[1]],
      [semifinalists[2], semifinalists[3]],
    ];
    state.winners = [];
    state.losers = [];
    state.stage = "semi";
  } else if (state.stage === "semi") {
    state.finalists = [...state.winners];
    state.semiLosers = [...state.losers];
    state.queue = [[state.finalists[0], state.finalists[1]]];
    state.winners = [];
    state.losers = [];
    state.stage = "final";
  } else if (state.stage === "final") {
    state.champion = state.winners[0];
    state.second = state.losers[0];
    state.queue = [[state.semiLosers[0], state.semiLosers[1]]];
    state.winners = [];
    state.losers = [];
    state.stage = "bronze";
  } else if (state.stage === "bronze") {
    state.third = state.winners[0];
    state.stage = "results";
    state.queue = [];
    state.winners = [];
    state.losers = [];
  }
}
function skipPair() {
  if (votingLocked) return;
  if (state.queue.length <= 1) {
    el("battle-notice").textContent =
      "Це остання пара раунду — обери один варіант 💗";
    return;
  }
  const next = state.queue.shift();
  state.queue.push(next);
  saveState();
  renderBattle();
  el("battle-notice").textContent =
    "Домовилися! До цієї пари повернемося пізніше ♡";
}
function undoVote() {
  if (votingLocked || !state.history.length) return;
  const previous = state.history.pop();
  const history = state.history;
  state = { ...previous, history };
  saveState();
  render();
}
function resultMessage() {
  const ranking = [state.champion, state.second, state.third];
  return [
    "НАШ ТОП-3 ПОБАЧЕНЬ 💗",
    "",
    ...ranking.flatMap((id, index) => {
      const idea = getIdea(id);
      return [
        `${["🥇", "🥈", "🥉"][index]} ${index + 1} місце — ${idea.title}`,
        idea.description,
        "",
      ];
    }),
    "З любов'ю ♡",
  ].join("\n");
}
function createResultEntry(id, index) {
  const idea = getIdea(id);
  const article = document.createElement("article");
  article.className = "result-entry";
  const medal = document.createElement("div");
  medal.className = "medal";
  medal.textContent = ["🥇", "🥈", "🥉"][index];
  const body = document.createElement("div");
  const place = document.createElement("div");
  place.className = "result-position";
  place.textContent = `${index + 1} МІСЦЕ`;
  const title = document.createElement("h3");
  title.textContent = idea.title;
  const desc = document.createElement("p");
  desc.textContent = idea.description;
  body.append(place, title, desc);
  article.append(medal, body);
  return article;
}
function renderResults() {
  showScreen("results-screen");
  el("results-list").replaceChildren(
    ...[state.champion, state.second, state.third].map(createResultEntry),
  );
  const emailStatus = el("email-state");
  const addressSet = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(RECIPIENT_EMAIL.trim());
  if (!addressSet) {
    emailStatus.textContent =
      "Щоб листи надходили автоматично, впиши свою адресу в RECIPIENT_EMAIL у script.js.";
  } else if (state.emailState === "sending") {
    emailStatus.textContent = "Надсилаємо результати автоматично… 💌";
  } else if (state.emailState === "sent") {
    emailStatus.textContent =
      "Запит прийнято сервісом 💌 Перевір пошту й за потреби підтвердь адресу.";
  } else if (state.emailState === "error") {
    emailStatus.textContent =
      "Не вдалося надіслати автоматично. Можна скопіювати результат нижче.";
  } else {
    emailStatus.textContent = "Результати будуть надіслані автоматично 💌";
  }
}
function render() {
  if (state.stage === "intro") showScreen("intro-screen");
  else if (state.stage === "results") renderResults();
  else renderBattle();
}
async function sendEmail() {
  if (state.stage !== "results" || state.emailState !== "idle") return;
  const email = RECIPIENT_EMAIL.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    el("email-state").textContent =
      "Щоб отримати результати, впиши свою адресу в RECIPIENT_EMAIL у script.js.";
    return;
  }

  // Фіксуємо спробу ДО запиту, щоб оновлення сторінки не розіслало дублікати.
  const expectedRanking = [state.champion, state.second, state.third].join(",");
  state.emailState = "sending";
  saveState();
  renderResults();
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "💗 Топ-3 побачень: результати турніру",
          _template: "table",
          message: resultMessage(),
        }),
      },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.success === false || payload.success === "false")
      throw new Error("FormSubmit rejected submission");
    // Лист прийнято до обробки сервісом; це не гарантує доставку у вхідні.
    if (
      state.stage === "results" &&
      [state.champion, state.second, state.third].join(",") === expectedRanking
    ) {
      state.emailState = "sent";
    }
  } catch (error) {
    console.warn("Не вдалося автоматично надіслати лист:", error);
    if (
      state.stage === "results" &&
      [state.champion, state.second, state.third].join(",") === expectedRanking
    ) {
      state.emailState = "error";
    }
  }
  saveState();
  render();
}
async function copyResults() {
  const text = resultMessage();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const success = document.execCommand("copy");
      input.remove();
      if (!success) throw new Error("Copy not supported");
    }
    el("email-state").textContent =
      "Скопійовано! Можна надіслати повідомленням 💗";
  } catch {
    el("email-state").textContent =
      "Не вдалося скопіювати. Спробуй у браузері після публікації на GitHub Pages.";
  }
}

el("start-button").addEventListener("click", startTournament);
el("choose-left").addEventListener("click", () => castVote("left"));
el("choose-right").addEventListener("click", () => castVote("right"));
for (const side of ["left", "right"]) {
  el(`expand-${side}`).addEventListener("click", () => {
    const description = el(`date-description-${side}`);
    const expanded = description.classList.toggle("expanded");
    const button = el(`expand-${side}`);
    button.textContent = expanded ? "Згорнути опис ↑" : "Читати повністю ↓";
    button.setAttribute("aria-expanded", String(expanded));
  });
}
el("skip-button").addEventListener("click", skipPair);
el("undo-button").addEventListener("click", undoVote);
el("copy-results-button").addEventListener("click", copyResults);
el("restart-button").addEventListener("click", () => {
  if (
    window.confirm(
      "Почати турнір заново? Попередні вибори на цьому пристрої буде скинуто.",
    )
  )
    startTournament();
});

render();
if (state.stage === "results" && state.emailState === "idle") sendEmail();
