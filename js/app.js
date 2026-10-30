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
// CSS хувьсагч доторх зургийн хаягийг бүтэн болгоно (эс тэгвээс css/ хавтаснаас хайдаг)
const abs = (file) => new URL(img(file), location.href).href;
const allGenres = [...new Set(FILMS.flatMap((f) => f.genres))];
const posterOf = (f) => f.poster || f.img || f.wide;
const wideOf = (f) => f.wide || f.img || f.poster;
const heroOf = (f) => f.hero || f.wide || f.img || f.poster;
function lengthText(f) {
  if (f.type === "series") return `${f.seasons} улирал`;
  const h = Math.floor(f.duration / 60), m = f.duration % 60;
  return h ? `${h}ц ${m}м` : `${m} мин`;
}

const ICON = {
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3.5 21 12 6 20.5Z"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5 9-10"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrow: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const listBtnText = (id) => (inList(id) ? ICON.check + " Жагсаалтад байгаа" : ICON.plus + " Миний жагсаалт");

// ---------- Картууд ----------
// Босоо карт: зураг + зайтай нэр + доор нь он, хугацаа
function posterCard(f) {
  return `
    <button class="card" data-open="${f.id}">
      <div class="thumb">
        <img src="${img(posterOf(f))}" alt="" loading="lazy">
        <span class="shade"></span>
        <span class="badge">${f.quality}</span>
        <span class="pt">${f.title}</span>
      </div>
      <div class="card-title">${f.title}</div>
      <div class="card-meta">${f.year} · ${lengthText(f)}</div>
    </button>`;
}
// Өргөн карт: зураг + доод буланд жижиг шошго
function wideCard(f, label) {
  return `
    <button class="card" data-open="${f.id}" aria-label="${f.title}">
      <div class="thumb">
        <img src="${img(wideOf(f))}" alt="" loading="lazy">
        <span class="wide-label">${label || f.genres[0]}</span>
      </div>
    </button>`;
}

// ---------- Нүүр хуудас ----------
let slideIndex = 0, slideTimer;

function renderHome() {
  const slides = FILMS.filter((f) => f.featured);
  const slidesHTML = slides.map((f, i) => `
    <div class="slide ${i === slideIndex ? "on" : ""}">
      <div class="slide-bg" style="--hero:url('${abs(heroOf(f))}'); --mob:url('${abs(posterOf(f))}')"></div>
      <div class="slide-info">
        <div class="eyebrow">${f.eyebrow || (f.rows.includes("ai") ? "AI бүтээл" : "Онцлох")}</div>
        <h1 class="slide-title${f.title.length > 12 ? " long" : ""}">${f.title}</h1>
        <div class="meta">
          <span>${f.year}</span><span>${f.genres[0]}</span><span>${lengthText(f)}</span><span>${f.quality}</span>
          <span><span class="star">★</span> ${f.rating.toFixed(1)}</span>
        </div>
        <p>${f.desc}</p>
        <div class="hero-actions">
          <button class="btn-primary" data-play="${f.id}">${ICON.play} Үзэх</button>
          <button class="btn-outline" data-list="${f.id}">${listBtnText(f.id)}</button>
          <button class="icon-round" data-open="${f.id}" aria-label="Дэлгэрэнгүй">${ICON.info}</button>
        </div>
      </div>
    </div>`).join("");

  const rowsHTML = ROWS.map((r) => {
    const list = FILMS.filter((f) => f.rows.includes(r.key));
    if (!list.length) return "";
    const layout = r.layout || "poster";
    const cards = list.map((f) => (layout === "wide" ? wideCard(f, r.label) : posterCard(f))).join("");
    return `
      <section>
        <div class="row-head">
          <h2>${r.title}</h2>
          <a class="see-all" href="#row-${r.key}">Бүгдийг харах ${ICON.arrow}</a>
        </div>
        <div class="row-wrap">
          <div class="track ${layout}">${cards}</div>
          <button class="row-arrow prev" aria-label="Өмнөх" aria-disabled="true"><span class="round-arrow">${ICON.left}</span></button>
          <button class="row-arrow next" aria-label="Дараах"><span class="round-arrow">${ICON.right}</span></button>
        </div>
      </section>`;
  }).join("");

  app.innerHTML = `
    <section class="hero" aria-label="Онцлох кино">
      ${slidesHTML}
      <div class="slide-nums">${slides.map((_, i) => `<button class="${i === slideIndex ? "on" : ""}" data-dot="${i}" aria-label="${i + 1}-р слайд">${String(i + 1).padStart(2, "0")}</button>`).join("")}</div>
      <div class="hero-arrows">
        <button class="round-arrow" id="prevSlide" aria-label="Өмнөх">${ICON.left}</button>
        <button class="round-arrow" id="nextSlide" aria-label="Дараах">${ICON.right}</button>
      </div>
    </section>
    <div class="rows">${rowsHTML}</div>`;

  showSlide(slideIndex);
  $("prevSlide").onclick = () => showSlide(slideIndex - 1);
  $("nextSlide").onclick = () => showSlide(slideIndex + 1);
  setupRows();
  setupSwipe(document.querySelector(".hero"));
}

function showSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const nums = document.querySelectorAll(".slide-nums button");
  if (!slides.length) return;
  slideIndex = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("on", i === slideIndex));
  nums.forEach((d, i) => d.classList.toggle("on", i === slideIndex));
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 8000); // 8 секунд тутамд солигдоно
}

// Эгнээг сумаар гүйлгэх
function setupRows() {
  document.querySelectorAll(".row-wrap").forEach((wrap) => {
    const track = wrap.querySelector(".track");
    const prev = wrap.querySelector(".prev"), next = wrap.querySelector(".next");
    const thumb = track.querySelector(".thumb");
    if (thumb) wrap.style.setProperty("--h", thumb.offsetHeight + "px");
    const update = () => {
      prev.setAttribute("aria-disabled", String(track.scrollLeft < 8));
      next.setAttribute("aria-disabled", String(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8));
    };
    prev.onclick = () => track.scrollBy({ left: -track.clientWidth * 0.8 });
    next.onclick = () => track.scrollBy({ left: track.clientWidth * 0.8 });
    track.addEventListener("scroll", update, { passive: true });
    update();
  });
}
window.addEventListener("resize", () => { if (document.querySelector(".row-wrap")) setupRows(); });

// Утсан дээр хуруугаар шударч слайд солих
function setupSwipe(el) {
  let x0 = null;
  el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) showSlide(slideIndex + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// ---------- Жагсаалт хуудас (Кино, Сериал, Төрөл...) ----------
function renderGrid(title, subtitle, list, emptyText) {
  clearInterval(slideTimer);
  app.innerHTML = `
    <div class="page-head"><h1>${title}</h1><p>${subtitle || list.length + " бүтээл"}</p></div>
    <div class="grid-page">
      ${list.length ? `<div class="grid">${list.map(posterCard).join("")}</div>` : `<div class="empty">${emptyText || "Одоогоор бүтээл алга."}</div>`}
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
  FILMS.slice(0, 3).map((f) =>
    `<button data-open="${f.id}"><img src="${img(wideOf(f))}" alt=""><span>${f.title}<small>${f.year} · ${f.genres[0]}</small></span></button>`).join("");
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
      <div class="modal-img"><img src="${img(wideOf(f))}" alt=""></div>
      <div class="modal-body">
        <h2>${f.title}</h2>
        <div class="meta">
          <span>${f.year}</span><span>${f.genres[0]}</span><span>${lengthText(f)}</span><span>${f.quality}</span><span>${f.age}</span>
          <span><span class="star">★</span> ${f.rating.toFixed(1)}</span>
        </div>
        ${f.desc ? `<p>${f.desc}</p>` : ""}
        <div class="genres">${f.genres.map((g) => `<span>${g}</span>`).join("")}</div>
        <div class="hero-actions">
          <button class="btn-primary" data-play="${f.id}">${ICON.play} Үзэх</button>
          <button class="btn-outline" data-list="${f.id}">${listBtnText(f.id)}</button>
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
    b.innerHTML = listBtnText(id);
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
