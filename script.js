const loginForm = document.getElementById("login-form");
const loginPanel = document.getElementById("login-panel");
const mainUI = document.getElementById("main-ui");
const welcomeMsg = document.getElementById("welcome-msg");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

const sidebarButtons = document.querySelectorAll(".side-btn");
const contentPanels = document.querySelectorAll(".content-panel");

document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();  // ne frissüljön az oldal!

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const institute = document.getElementById("institute").value;

  const response = await fetch("https://etabla.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password, institute })
  });

  const data = await response.json();

  if (data.success) {
    // Sikeres login, megjelenítjük az adatokat
    showDashboard(data.data);
  } else {
    alert("Hiba a bejelentkezéskor: " + data.error);
  }
});


let currentUser = null;
let instituteCode = null;

function showPanel(panelId) {
  contentPanels.forEach(panel => {
    panel.classList.toggle("hidden", panel.id !== panelId);
  });

  sidebarButtons.forEach(btn => {
    btn.classList.toggle("bg-indigo-100", btn.dataset.panel === panelId);
    btn.classList.toggle("font-semibold", btn.dataset.panel === panelId);
    btn.classList.toggle("text-indigo-700", btn.dataset.panel === panelId);
  });
}

sidebarButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    showPanel(btn.dataset.panel);
  });
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  instituteCode = null;
  mainUI.classList.add("hidden");
  loginPanel.classList.remove("hidden");
  loginForm.reset();
  loginError.classList.add("hidden");
});

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginError.classList.add("hidden");

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();
  const institute = loginForm.institute.value.trim();

  if (!username || !password || !institute) {
    loginError.textContent = "Minden mezőt ki kell tölteni!";
    loginError.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch("https://etabla.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, institute })
    });
    const data = await response.json();

    if (data.success) {
      currentUser = username;
      instituteCode = institute;
      welcomeMsg.textContent = `Üdvözöl az e-Tábla, ${currentUser}!`;

      // UI váltás
      loginPanel.classList.add("hidden");
      mainUI.classList.remove("hidden");

      // Alap panel megjelenítése
      showPanel("evaluations");

      // Töltsük be az értékeléseket és más adatokat
      await loadEvaluations();
      await loadAbsences();
      await loadTimetable();
      await loadTests();

    } else {
      loginError.textContent = data.error || "Hiba a bejelentkezés során";
      loginError.classList.remove("hidden");
    }
  } catch (err) {
    loginError.textContent = "Hálózati hiba: " + err.message;
    loginError.classList.remove("hidden");
  }
});

// Dummy adatok betöltése, később backendről jöhet fetch

async function loadEvaluations() {
  const list = document.getElementById("evaluations-list");
  list.innerHTML = "";

  const dummy = [
    {subject: "Matematika", grade: "5", date: "2025-05-10"},
    {subject: "Fizika", grade: "4", date: "2025-05-09"},
    {subject: "Történelem", grade: "3", date: "2025-05-07"},
  ];

  dummy.forEach(item => {
    const el = document.createElement("div");
    el.className = "p-4 bg-white rounded shadow flex justify-between items-center";
    el.innerHTML = `<span class="font-semibold">${item.subject}</span> <span class="text-indigo-600 text-lg">${item.grade}</span> <span class="text-gray-400 text-sm">${item.date}</span>`;
    list.appendChild(el);
  });
}

async function loadAbsences() {
  const list = document.getElementById("absences-list");
  list.innerHTML = "";

  const dummy = [
    {date: "2025-05-05", reason: "Betegség", count: 2},
    {date: "2025-04-28", reason: "Hiányzás", count: 1},
  ];

  dummy.forEach(item => {
    const el = document.createElement("div");
    el.className = "p-4 bg-white rounded shadow flex justify-between items-center text-red-600";
    el.innerHTML = `<span>${item.date} - ${item.reason}</span> <span class="font-bold">${item.count} nap</span>`;
    list.appendChild(el);
  });
}

async function loadTimetable() {
  const list = document.getElementById("timetable-list");
  list.innerHTML = "";

  const dummy = [
    {time: "08:00 - 08:45", subject: "Magyar", teacher: "Kiss Anna"},
    {time: "08:55 - 09:40", subject: "Matematika", teacher: "Nagy Péter"},
    {time: "09:50 - 10:35", subject: "Angol", teacher: "Szabó Éva"},
  ];

  dummy.forEach(item => {
    const el = document.createElement("div");
    el.className = "p-4 bg-white rounded shadow";
    el.innerHTML = `<div class="font-semibold"></div>`;
    list.appendChild(el);
  });
}
