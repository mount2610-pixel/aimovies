// =============================================
//  AIMOVIES — ҮЙЛДЭЛ
//  Хуудсууд (#хаяг):
//    (хоосон)      → Нүүр
//    #movies       → Кино
//    #series       → Сериал
//    #mylist       → Миний жагсаалт
//    #row-new      → Нэг эгнээний бүх кино
//    #genre-Драм   → Төрлөөр
// =============================================

const app = document.getElementById("app");
const $ = (id) => document.getElementById(id);

// ---------- Миний жагсаалт (браузерт хадгална) ----------
function loadList() {
  try { return JSON.parse(localStorage.getItem("aimovies-list")) || []; } catch { return []; }
}
function saveList() {
  try { localStorage.setItem("aimovies-list", JSON.stringify(myList)); } catch {}
}
let myList = loadList();
const inList = (id) => myList.includes(id);

// ---------- Туслах функцууд ----------
const byId = (id) => FILMS.find((f) => f.id === id);
const img = (file) => "images/" + file;
const allGenres = [...new Set(FILMS.flatMap((f) => f.genres))];
function lengthText(f) {
  if (f.type === "series") return `${f.seasons} улирал`;
  return `${Math.floor(f.duration / 60)}ц ${f.duration % 60}м`;
}

const ICON = {
  play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3.5 21 12 6 20.5Z"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 5 5 9-10"/></svg>',
  info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  left: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 5-7 7 7 7"/></svg>',
  right: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 5 7 7-7 7"/></svg>',
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

// ---------- Карт ----------
function cardHTML(f) {
  return `
    <button class="card" data-open="${f.id}">
      <div class="thumb">
        <img src="${img(f.img)}" alt="${f.title}" loading="lazy">
        <span class="badge">${f.quality}</span>
      </div>
      <div class="card-title">${f.title}</div>
      <div class="card-meta"><span>${f.year}</span><span><span class="star">★</span> ${f.rating.toFixed(1)}</span></div>
    </button>`;
}

// ---------- Нүүр хуудас ----------
let slideIndex = 0, slideTimer;

function renderHome() {
  const slides = FILMS.filter((f) => f.featured);
  const slidesHTML = slides.map((f, i) => `
    <div class="slide ${i === 0 ? "on" : ""}">
      <div class="slide-bg" style="background-image:url('${img(f.hero || f.img)}')"></div>
      <div class="slide-info">
        <h1 class="slide-title">${f.title}</h1>
        <div class="tags">
          <span>${f.year}</span><span class="tag">${f.quality}</span><span class="tag">${f.age}</span><span>Монгол хадмал</span>
        </div>
        <p>${f.desc}</p>
        <div class="hero-actions">
          <button class="btn-play" data-play="${f.id}">${ICON.play} Үзэх</button>
          <button class="btn-dark" data-list="${f.id}">${inList(f.id) ? ICON.check + " Жагсаалтад байгаа" : ICON.plus + " Миний жагсаалт"}</button>
          <button class="btn-text" data-open="${f.id}">${ICON.info} Дэлгэрэнгүй</button>
        </div>
      </div>
    </div>`).join("");

  const rowsHTML = ROWS.map((r) => {
    const list = FILMS.filter((f) => f.rows.includes(r.key)).slice(0, 6);
    if (!list.length) return "";
    return `
      <section>
        <div class="row-head">
          <h2>${r.title}</h2>
          <a class="see-all" href="#row-${r.key}">Бүгдийг харах ${ICON.arrow}</a>
        </div>
        <div class="cards">${list.map(cardHTML).join("")}</div>
      </section>`;
  }).join("");

  app.innerHTML = `
    <section class="hero" aria-label="Онцлох кино">
      ${slidesHTML}
      <button class="arrow prev" id="prevSlide" aria-label="Өмнөх">${ICON.left}</button>
      <button class="arrow next" id="nextSlide" aria-label="Дараах">${ICON.right}</button>
      <div class="dots">${slides.map((_, i) => `<button class="${i === slideIndex ? "on" : ""}" data-dot="${i}" aria-label="${i + 1}-р слайд"></button>`).join("")}</div>
    </section>
    <div class="rows">${rowsHTML}</div>`;

  showSlide(slideIndex);
  $("prevSlide").onclick = () => showSlide(slideIndex - 1);
  $("nextSlide").onclick = () => showSlide(slideIndex + 1);
}

function showSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dots button");
  if (!slides.length) return;
  slideIndex = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("on", i === slideIndex));
  dots.forEach((d, i) => d.classList.toggle("on", i === slideIndex));
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 7000); // 7 секунд тутамд солигдоно
}

// ---------- Жагсаалт хуудас (Кино, Сериал, Төрөл...) ----------
function renderGrid(title, subtitle, list, emptyText) {
  clearInterval(slideTimer);
  app.innerHTML = `
    <div class="page-head"><h1>${title}</h1><p>${subtitle || list.length + " бүтээл"}</p></div>
    <div class="grid-page">
      ${list.length ? `<div class="cards">${list.map(cardHTML).join("")}</div>` : `<div class="empty">${emptyText || "Одоогоор бүтээл алга."}</div>`}
    </div>`;
}

// ---------- Хуудас солих ----------
function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  $("searchInput").value = "";
  document.querySelectorAll(".menu > a").forEach((a) => a.classList.remove("active"));
  const mark = (name) => document.querySelector(`[data-route="${name}"]`)?.classList.add("active");

  if (hash === "movies") { mark("movies"); renderGrid("Кино", null, FILMS.filter((f) => f.type === "movie")); }
  else if (hash === "series") { mark("series"); renderGrid("Сериал", null, FILMS.filter((f) => f.type === "series")); }
  else if (hash === "mylist") {
    mark("mylist");
    renderGrid("Миний жагсаалт", null, myList.map(byId).filter(Boolean), "Жагсаалт хоосон байна. Киноны «+ Миний жагсаалт» товчийг дарж нэмээрэй.");
  }
  else if (hash.startsWith("row-")) {
    const r = ROWS.find((x) => x.key === hash.slice(4));
    if (r) renderGrid(r.title, null, FILMS.filter((f) => f.rows.includes(r.key)));
  }
  else if (hash.startsWith("genre-")) {
    const g = hash.slice(6);
    renderGrid(g, null, FILMS.filter((f) => f.genres.includes(g)));
  }
  else { mark("home"); renderHome(); }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

// ---------- Хайлт ----------
$("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { route(); return; }
  const list = FILMS.filter((f) => (f.title + " " + f.genres.join(" ") + " " + f.year).toLowerCase().includes(q));
  renderGrid(`“${e.target.value.trim()}”`, `${list.length} үр дүн олдлоо`, list, "Тохирох кино олдсонгүй. Өөр үгээр хайгаад үзээрэй.");
});
$("searchToggle").onclick = () => {
  const s = document.querySelector(".search");
  s.classList.toggle("open");
  if (s.classList.contains("open")) $("searchInput").focus();
};

// ---------- Төрөл цэс ----------
$("genreMenu").innerHTML = allGenres.map((g) => `<a href="#genre-${encodeURIComponent(g)}">${g}</a>`).join("");
$("genreBtn").onclick = (e) => {
  e.stopPropagation();
  const menu = $("genreMenu");
  menu.hidden = !menu.hidden;
  $("genreBtn").setAttribute("aria-expanded", String(!menu.hidden));
};

// ---------- Мэдэгдэл ----------
$("notifBox").innerHTML = "<h4>Шинэ бүтээлүүд</h4>" +
  FILMS.filter((f) => f.rows.includes("new")).slice(0, 3).map((f) =>
    `<button data-open="${f.id}"><img src="${img(f.img)}" alt=""><span>${f.title}<small>${f.year} · ${f.genres[0]}</small></span></button>`).join("");
$("bellBtn").onclick = (e) => {
  e.stopPropagation();
  $("notifBox").hidden = !$("notifBox").hidden;
  document.querySelector("#bellBtn .dot")?.remove();
};

// ---------- Дэлгэрэнгүй цонх ----------
function openDetail(id) {
  const f = byId(id);
  $("detail").innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${f.title}">
      <button class="close" data-close="detail" aria-label="Хаах">×</button>
      <div class="modal-img"><img src="${img(f.hero || f.img)}" alt="${f.title}"></div>
      <div class="modal-body">
        <h2>${f.title}</h2>
        <div class="tags">
          <span><span class="star">★</span> ${f.rating.toFixed(1)}</span><span>${f.year}</span>
          <span class="tag">${f.quality}</span><span class="tag">${f.age}</span><span>${lengthText(f)}</span>
        </div>
        <p>${f.desc}</p>
        <div class="genres">${f.genres.map((g) => `<span>${g}</span>`).join("")}<span>Монгол хадмал</span></div>
        <div class="hero-actions">
          <button class="btn-play" data-play="${f.id}">${ICON.play} Үзэх</button>
          <button class="btn-dark" data-list="${f.id}">${inList(f.id) ? ICON.check + " Жагсаалтад байгаа" : ICON.plus + " Миний жагсаалт"}</button>
        </div>
      </div>
    </div>`;
  $("detail").hidden = false;
}

// ---------- Тоглуулагч ----------
// data.js дотор кинонд video: "https://..." холбоос нэмэхэд энд тоглоно.
function openPlayer(id) {
  const f = byId(id);
  // Нэвтрээгүй хэрэглэгчийг эхлээд нэвтрүүлнэ
  if (window.AUTH_ENABLED && !window.currentUser) {
    $("detail").hidden = true;
    openLogin("login", "Кино үзэхийн тулд нэвтэрнэ үү.", id);
    return;
  }
  $("detail").hidden = true;
  $("player").innerHTML = `
    <button class="close" data-close="player" aria-label="Хаах">×</button>
    ${f.video
      ? `<iframe src="${f.video}" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : `<div class="player-empty"><h3>${f.title}</h3><p>Энэ киноны видео удахгүй нэмэгдэнэ.</p></div>`}`;
  $("player").hidden = false;
}

// ---------- Нэвтрэх ----------
// Нэвтрэх, бүртгүүлэх бүх код js/auth.js файлд байгаа.

// ---------- Миний жагсаалт товч ----------
function toggleList(id) {
  if (inList(id)) { myList = myList.filter((x) => x !== id); toast("Жагсаалтаас хаслаа"); }
  else { myList.push(id); toast("Миний жагсаалтад нэмлээ"); }
  saveList();
  document.querySelectorAll(`[data-list="${id}"]`).forEach((b) => {
    b.innerHTML = inList(id) ? ICON.check + " Жагсаалтад байгаа" : ICON.plus + " Миний жагсаалт";
  });
  if (location.hash === "#mylist") route();
}

let toastTimer;
function toast(text) {
  $("toast").textContent = text;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").hidden = true), 2200);
}

// ---------- Бүх товчийг нэг дор барих ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open],[data-play],[data-list],[data-close],[data-dot]");
  if (!e.target.closest(".dropdown")) $("genreMenu").hidden = true;
  if (!e.target.closest("#notifBox")) $("notifBox").hidden = true;
  if (e.target.classList.contains("overlay")) { e.target.hidden = true; return; }
  if (!t) return;
  if (t.dataset.play) openPlayer(+t.dataset.play);
  else if (t.dataset.list) toggleList(+t.dataset.list);
  else if (t.dataset.close) { $(t.dataset.close).hidden = true; if (t.dataset.close === "player") $("player").innerHTML = ""; }
  else if (t.dataset.dot) showSlide(+t.dataset.dot);
  else if (t.dataset.open) { $("notifBox").hidden = true; openDetail(+t.dataset.open); }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  ["player", "detail", "login"].forEach((id) => ($(id).hidden = true));
  $("player").innerHTML = "";
});

// Гүйлгэхэд толгой хэсэг бараан болно
window.addEventListener("scroll", () => $("topbar").classList.toggle("solid", window.scrollY > 40));

route();
