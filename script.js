const API_URL = "https://etabla.onrender.com";

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const institute = document.getElementById("institute").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, institute })
    });

    if (!res.ok) throw new Error("Hibás bejelentkezés!");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("studentName", data.studentName);

    document.getElementById("student-name").textContent = data.studentName;
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    loadEvaluations();
    loadTimetable();
    loadHomework();

  } catch (err) {
    error.textContent = err.message;
  }
}

function logout() {
  localStorage.clear();
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
}

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

async function loadEvaluations() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/evaluations`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const evaluations = await res.json();

  const list = document.getElementById("evaluations-list");
  list.innerHTML = "";
  evaluations.forEach(ev => {
    const li = document.createElement("li");
    li.textContent = `${ev.TantargyNeve} - ${ev.ErtekelesErtek} (${ev.SulySzazalek}%)`;
    list.appendChild(li);
  });
}

async function loadTimetable() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/timetable`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const timetable = await res.json();

  const list = document.getElementById("timetable-list");
  list.innerHTML = "";
  timetable.forEach(lesson => {
    const li = document.createElement("li");
    li.textContent = `${lesson.OraKezdete} - ${lesson.TantargyNeve} (${lesson.TanarNeve})`;
    list.appendChild(li);
  });
}

async function loadHomework() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/homework`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const homeworks = await res.json();

  const list = document.getElementById("homework-list");
  list.innerHTML = "";
  homeworks.forEach(hw => {
    const li = document.createElement("li");
    li.textContent = `${hw.TantargyNeve}: ${hw.FeladatLeiras}`;
    list.appendChild(li);
  });
}
