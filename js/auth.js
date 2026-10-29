// =============================================
//  AIMOVIES — НЭВТРЭХ / БҮРТГҮҮЛЭХ (Firebase)
//  Тохиргоо: js/firebase-config.js
// =============================================

window.currentUser = null;
window.AUTH_ENABLED = false;
let auth = null;
let afterLoginPlay = null; // нэвтэрсний дараа тоглуулах киноны id

// Firebase тохиргоо бөглөгдсөн эсэхийг шалгана
try {
  if (typeof firebase !== "undefined" && typeof firebaseConfig !== "undefined" && !firebaseConfig.apiKey.includes("ЭНД")) {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    auth.languageCode = "mn";
    window.AUTH_ENABLED = true;
  }
} catch (err) {
  console.error("Firebase эхлэхэд алдаа гарлаа:", err);
}

// ---------- Алдааны мэдэгдлийг монголоор ----------
function authError(err) {
  const map = {
    "auth/invalid-email": "Имэйл хаяг буруу байна.",
    "auth/missing-email": "Имэйл хаягаа бичнэ үү.",
    "auth/email-already-in-use": "Энэ имэйлээр аль хэдийн бүртгүүлсэн байна. Нэвтрэх хэсгээр орно уу.",
    "auth/weak-password": "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.",
    "auth/missing-password": "Нууц үгээ бичнэ үү.",
    "auth/invalid-credential": "Имэйл эсвэл нууц үг буруу байна.",
    "auth/invalid-login-credentials": "Имэйл эсвэл нууц үг буруу байна.",
    "auth/wrong-password": "Нууц үг буруу байна.",
    "auth/user-not-found": "Энэ имэйлээр бүртгэл олдсонгүй.",
    "auth/too-many-requests": "Хэт олон удаа оролдлоо. Хэсэг хугацааны дараа дахин оролдоно уу.",
    "auth/network-request-failed": "Интернэт холболтоо шалгана уу.",
    "auth/popup-closed-by-user": "Google-ээр нэвтрэх цонхыг хаалаа.",
    "auth/popup-blocked": "Браузер цонхыг хаасан байна. Popup-ыг зөвшөөрөөд дахин оролдоно уу.",
    "auth/unauthorized-domain": "Энэ хаягаас нэвтрэх зөвшөөрөлгүй байна. Firebase дээр Authorized domains-д нэмнэ үү."
  };
  return map[err.code] || "Алдаа гарлаа: " + (err.message || err.code);
}

// ---------- Нэвтрэх / бүртгүүлэх цонх ----------
// mode: "login" | "register" | "reset"
function openLogin(mode = "login", note = "", playId = null) {
  if (playId) afterLoginPlay = playId;
  const box = $("login");

  if (!window.AUTH_ENABLED) {
    box.innerHTML = `
      <div class="modal login">
        <button type="button" class="close" data-close="login" aria-label="Хаах">×</button>
        <h2>Нэвтрэх</h2>
        <p>Нэвтрэх систем удахгүй нээгдэнэ.</p>
      </div>`;
    box.hidden = false;
    return;
  }

  const google = `
    <button type="button" class="btn-google" id="googleBtn">
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
      Google-ээр үргэлжлүүлэх
    </button>
    <div class="or"><span>эсвэл</span></div>`;

  let body = "";
  if (mode === "login") {
    body = `
      <h2>Нэвтрэх</h2>
      <p>${note || "AIMOVIES-д тавтай морил"}</p>
      ${google}
      <label class="field">Имэйл<input id="authEmail" type="email" required autocomplete="email" placeholder="name@gmail.com"></label>
      <label class="field">Нууц үг<input id="authPass" type="password" required autocomplete="current-password" placeholder="••••••••"></label>
      <button type="button" class="link-btn right" data-auth="reset">Нууц үгээ мартсан уу?</button>
      <button class="btn-red" type="submit">Нэвтрэх</button>
      <p class="switch">Бүртгэлгүй юу? <button type="button" class="link-btn" data-auth="register">Бүртгүүлэх</button></p>`;
  } else if (mode === "register") {
    body = `
      <h2>Бүртгүүлэх</h2>
      <p>${note || "Шинэ бүртгэл үүсгэх"}</p>
      ${google}
      <label class="field">Нэр<input id="authName" type="text" required autocomplete="name" placeholder="Таны нэр"></label>
      <label class="field">Имэйл<input id="authEmail" type="email" required autocomplete="email" placeholder="name@gmail.com"></label>
      <label class="field">Нууц үг<input id="authPass" type="password" required minlength="6" autocomplete="new-password" placeholder="Хамгийн багадаа 6 тэмдэгт"></label>
      <label class="field">Нууц үг давтах<input id="authPass2" type="password" required minlength="6" autocomplete="new-password" placeholder="••••••••"></label>
      <button class="btn-red" type="submit">Бүртгүүлэх</button>
      <p class="switch">Бүртгэлтэй юу? <button type="button" class="link-btn" data-auth="login">Нэвтрэх</button></p>`;
  } else {
    body = `
      <h2>Нууц үг сэргээх</h2>
      <p>Бүртгэлтэй имэйлээ бичвэл нууц үг солих холбоос илгээнэ.</p>
      <label class="field">Имэйл<input id="authEmail" type="email" required autocomplete="email" placeholder="name@gmail.com"></label>
      <button class="btn-red" type="submit">Холбоос илгээх</button>
      <p class="switch"><button type="button" class="link-btn" data-auth="login">← Нэвтрэх рүү буцах</button></p>`;
  }

  box.innerHTML = `
    <form class="modal login" id="authForm" novalidate>
      <button type="button" class="close" data-close="login" aria-label="Хаах">×</button>
      ${body}
      <div class="form-msg" id="authMsg" hidden></div>
    </form>`;
  box.hidden = false;

  const msg = (text, ok) => {
    $("authMsg").textContent = text;
    $("authMsg").className = "form-msg" + (ok ? " ok" : " err");
    $("authMsg").hidden = false;
  };
  const busy = (on) => {
    box.querySelectorAll("button[type=submit], #googleBtn").forEach((b) => (b.disabled = on));
  };

  box.querySelectorAll("[data-auth]").forEach((b) => (b.onclick = () => openLogin(b.dataset.auth)));
  $("googleBtn")?.addEventListener("click", async () => {
    busy(true);
    try {
      await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (err) { msg(authError(err)); }
    busy(false);
  });

  $("authForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("authEmail").value.trim();
    busy(true);
    try {
      if (mode === "login") {
        await auth.signInWithEmailAndPassword(email, $("authPass").value);
      } else if (mode === "register") {
        const name = $("authName").value.trim();
        if (!name) throw { code: "custom", message: "Нэрээ бичнэ үү." };
        if ($("authPass").value !== $("authPass2").value) throw { code: "custom", message: "Нууц үг хоорондоо таарахгүй байна." };
        const cred = await auth.createUserWithEmailAndPassword(email, $("authPass").value);
        await cred.user.updateProfile({ displayName: name });
        await cred.user.sendEmailVerification().catch(() => {});
        updateHeader(auth.currentUser);
      } else {
        await auth.sendPasswordResetEmail(email);
        msg("Холбоос илгээлээ. Имэйлээ шалгана уу (Spam хавтсыг ч шалгаарай).", true);
      }
    } catch (err) {
      msg(err.code === "custom" ? err.message : authError(err));
    }
    busy(false);
  };

  setTimeout(() => box.querySelector("input")?.focus(), 50);
}

// ---------- Толгой хэсгийн профайл ----------
function initials(user) {
  const n = (user.displayName || user.email || "?").trim();
  return n.charAt(0).toUpperCase();
}

function updateHeader(user) {
  const avatar = $("avatarBtn");
  $("loginBtn").hidden = !!user;
  if (user) {
    avatar.classList.add("signed");
    avatar.innerHTML = user.photoURL
      ? `<img src="${user.photoURL}" alt="" referrerpolicy="no-referrer">`
      : `<span>${initials(user)}</span>`;
    avatar.setAttribute("aria-label", "Профайл: " + (user.displayName || user.email));
  } else {
    avatar.classList.remove("signed");
    avatar.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.5"/><path d="M3 21a9 9 0 0 1 18 0Z"/></svg>';
    avatar.setAttribute("aria-label", "Нэвтрэх");
  }
}

// Профайл цэс
const userMenu = document.createElement("div");
userMenu.className = "user-menu";
userMenu.hidden = true;
document.querySelector(".top-right").appendChild(userMenu);

function openUserMenu() {
  const u = window.currentUser;
  userMenu.innerHTML = `
    <div class="um-head">
      <strong>${u.displayName || "Хэрэглэгч"}</strong>
      <small>${u.email || ""}</small>
      ${u.emailVerified || u.providerData.some((p) => p.providerId === "google.com") ? "" : '<button class="link-btn" id="verifyBtn">Имэйлээ баталгаажуулах</button>'}
    </div>
    <a href="#mylist">Миний жагсаалт</a>
    <button id="logoutBtn">Гарах</button>`;
  userMenu.hidden = false;
  $("logoutBtn").onclick = async () => {
    userMenu.hidden = true;
    await auth.signOut();
    toast("Системээс гарлаа");
  };
  $("verifyBtn")?.addEventListener("click", async () => {
    try { await u.sendEmailVerification(); toast("Баталгаажуулах имэйл илгээлээ"); }
    catch (err) { toast(authError(err)); }
  });
}

$("loginBtn").onclick = () => openLogin("login");
$("avatarBtn").onclick = (e) => {
  e.stopPropagation();
  if (window.currentUser) userMenu.hidden ? openUserMenu() : (userMenu.hidden = true);
  else openLogin("login");
};
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu") && !e.target.closest("#avatarBtn")) userMenu.hidden = true;
});

// ---------- Нэвтрэлтийн төлөв өөрчлөгдөх бүрт ----------
if (auth) {
  auth.onAuthStateChanged((user) => {
    const wasSignedOut = !window.currentUser;
    window.currentUser = user;
    updateHeader(user);
    if (user && wasSignedOut && !$("login").hidden) {
      $("login").hidden = true;
      toast("Тавтай морил, " + (user.displayName || user.email) + "!");
      if (afterLoginPlay) { const id = afterLoginPlay; afterLoginPlay = null; openPlayer(id); }
    }
  });
}
