// ---------- Config ----------
const RADIO_API_HOSTS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://at1.api.radio-browser.info"
];

const DEFAULT_STATIONS = [
  { name: "FIP", url: "https://icecast.radiofrance.fr/fip-hifi.aac", tags: "France · Éclectique" },
  { name: "France Info", url: "https://icecast.radiofrance.fr/franceinfo-hifi.aac", tags: "France · Actualités" },
  { name: "Radio Swiss Jazz", url: "https://stream.srg-ssr.ch/m/rsj/mp3_128", tags: "Suisse · Jazz" },
  { name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-128-mp3", tags: "USA · Ambient / Downtempo" },
  { name: "Radio Nova", url: "https://novazz.ice.infomaniak.ch/novazz-128.mp3", tags: "France · Musique éclectique" }
];

// ---------- State ----------
const player = document.getElementById("player");
let currentStation = null;   // { name, url, tags }
let mediaRecorder = null;
let recordedChunks = [];
let audioCtx = null;
let mediaStreamDest = null;
let mediaElementSource = null;
let searchStations = [];

// ---------- Storage helpers ----------
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

function getFavorites() { return store.get("wr_favorites", []); }
function setFavorites(list) { store.set("wr_favorites", list); }
function getHistory() { return store.get("wr_history", []); }
function setHistory(list) { store.set("wr_history", list); }
function getCustomStations() { return store.get("wr_custom_stations", []); }
function setCustomStations(list) { store.set("wr_custom_stations", list); }
function getRecordings() { return store.get("wr_recordings_meta", []); } // metadata only; blobs kept in memory this session

const recordingBlobs = {}; // id -> blob url, lost on reload (expected: browser storage of large audio blobs is out of scope for localStorage)

function stationKey(station) { return station.url; }

function isFavorite(station) {
  return getFavorites().some(s => stationKey(s) === stationKey(station));
}

// ---------- Toast ----------
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

// ---------- Tabs ----------
document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
  if (btn.dataset.tab === "favorites") renderFavorites();
  if (btn.dataset.tab === "history") renderHistory();
  if (btn.dataset.tab === "recordings") renderRecordings();
});

// ---------- Rendering station lists ----------
function heartIcon(active) {
  return `
    <svg viewBox="0 0 24 24" width="18" height="18" class="heart-icon" aria-hidden="true">
      <path d="M12 21s-7.2-4.5-9.8-8.8C.5 8.6 2.6 4.9 6.4 4.9c2 0 3.8 1.1 5.6 3.2 1.8-2.1 3.6-3.2 5.6-3.2 3.8 0 5.9 3.7 4.2 7.3C19.2 16.5 12 21 12 21z"
        fill="${active ? "var(--live)" : "none"}"
        stroke="${active ? "var(--live)" : "currentColor"}"
        stroke-width="1.7" stroke-linejoin="round"/>
    </svg>`;
}

function stationItemHTML(station, opts = {}) {
  const fav = isFavorite(station);
  return `
    <li class="station-item" data-url="${encodeURIComponent(station.url)}">
      <div class="station-info">
        <div class="station-title">${escapeHTML(station.name)}</div>
        <div class="station-sub">${escapeHTML(station.tags || station.url)}</div>
      </div>
      <button class="station-fav ${fav ? "active" : ""}" data-action="fav" aria-label="Favori">${heartIcon(fav)}</button>
    </li>
  `;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderDefaultStations() {
  const all = [...getCustomStations(), ...DEFAULT_STATIONS];
  const ul = document.getElementById("defaultStations");
  ul.innerHTML = all.map(s => stationItemHTML(s)).join("");
  attachStationHandlers(ul, all);
}

function renderFavorites() {
  const favs = getFavorites();
  const ul = document.getElementById("favoritesList");
  document.getElementById("favoritesEmpty").style.display = favs.length ? "none" : "block";
  ul.innerHTML = favs.map(s => stationItemHTML(s)).join("");
  attachStationHandlers(ul, favs);
}

function renderHistory() {
  const hist = getHistory();
  const ul = document.getElementById("historyList");
  document.getElementById("historyEmpty").style.display = hist.length ? "none" : "block";
  ul.innerHTML = hist.map(s => stationItemHTML(s)).join("");
  attachStationHandlers(ul, hist);
}

function renderSearchResults() {
  const results = document.getElementById("searchResults");
  results.innerHTML = searchStations.map(s => stationItemHTML(s)).join("");
  attachStationHandlers(results, searchStations);
}

function renderRecordings() {
  const recs = getRecordings();
  const ul = document.getElementById("recordingsList");
  document.getElementById("recordingsEmpty").style.display = recs.length ? "none" : "block";
  ul.innerHTML = recs.map(r => `
    <li class="station-item" data-rec="${r.id}">
      <div class="station-info">
        <div class="station-title">${escapeHTML(r.name)}</div>
        <div class="station-sub">${new Date(r.date).toLocaleString("fr-FR")}</div>
      </div>
      <button class="btn-link" data-action="download" data-rec="${r.id}">Télécharger</button>
    </li>
  `).join("");
  ul.querySelectorAll('[data-action="download"]').forEach(btn => {
    btn.addEventListener("click", () => downloadRecording(btn.dataset.rec));
  });
}

function attachStationHandlers(ul, list) {
  ul.querySelectorAll(".station-item").forEach(li => {
    const url = decodeURIComponent(li.dataset.url);
    const station = list.find(s => s.url === url);
    li.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="fav"]')) return;
      playStation(station);
    });
    const favBtn = li.querySelector('[data-action="fav"]');
    favBtn.addEventListener("click", () => toggleFavorite(station));
  });
}

function toggleFavorite(station) {
  let favs = getFavorites();
  if (isFavorite(station)) {
    favs = favs.filter(s => stationKey(s) !== stationKey(station));
    showToast("Retiré des favoris");
  } else {
    favs.unshift(station);
    showToast("Ajouté aux favoris");
  }
  setFavorites(favs);
  renderDefaultStations();
  renderFavorites();
  renderSearchResults();
  updateFavButton();
}

// ---------- Playback ----------
function playStation(station) {
  currentStation = station;
  player.src = station.url;
  player.play().catch(() => showToast("Impossible de lire ce flux"));
  document.getElementById("stationName").textContent = station.name;
  document.getElementById("stationMeta").textContent = station.tags || "Lecture en direct";
  document.getElementById("dialGlow").classList.add("live");
  setPlayIcon(true);
  updateFavButton();
  pushHistory(station);
  updateMediaSession(station);
}

function pushHistory(station) {
  let hist = getHistory().filter(s => stationKey(s) !== stationKey(station));
  hist.unshift({ ...station, playedAt: Date.now() });
  hist = hist.slice(0, 30);
  setHistory(hist);
}

function updateFavButton() {
  const btn = document.getElementById("btnFav");
  if (!currentStation) { btn.innerHTML = heartIcon(false); btn.classList.remove("active"); return; }
  const fav = isFavorite(currentStation);
  btn.innerHTML = heartIcon(fav);
  btn.classList.toggle("active", fav);
}

function setPlayIcon(playing) {
  document.getElementById("iconPlay").style.display = playing ? "none" : "block";
  document.getElementById("iconPause").style.display = playing ? "block" : "none";
}

document.getElementById("btnPlay").addEventListener("click", () => {
  if (!currentStation) { showToast("Choisissez une station"); return; }
  if (player.paused) {
    player.play();
    setPlayIcon(true);
    document.getElementById("dialGlow").classList.add("live");
  } else {
    player.pause();
    setPlayIcon(false);
    document.getElementById("dialGlow").classList.remove("live");
  }
});

document.getElementById("btnFav").addEventListener("click", () => {
  if (!currentStation) { showToast("Choisissez une station"); return; }
  toggleFavorite(currentStation);
});

document.getElementById("volume").addEventListener("input", (e) => {
  player.volume = parseFloat(e.target.value);
});
player.volume = 0.9;

player.addEventListener("pause", () => setPlayIcon(false));
player.addEventListener("playing", () => {
  setPlayIcon(true);
  document.getElementById("dialGlow").classList.add("live");
});
player.addEventListener("error", () => {
  showToast("Erreur de lecture du flux");
  document.getElementById("dialGlow").classList.remove("live");
});

// ---------- MediaSession (contrôles verrouillés / notifications) ----------
function updateMediaSession(station) {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: station.name,
    artist: "WebRadio",
    album: station.tags || "",
  });
  navigator.mediaSession.setActionHandler("play", () => { player.play(); setPlayIcon(true); });
  navigator.mediaSession.setActionHandler("pause", () => { player.pause(); setPlayIcon(false); });
}

// ---------- Search (Radio-Browser API) ----------
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = document.getElementById("searchInput").value.trim();
  const status = document.getElementById("searchStatus");
  const results = document.getElementById("searchResults");
  if (!q) return;
  status.textContent = "Recherche en cours…";
  results.innerHTML = "";

  for (const host of RADIO_API_HOSTS) {
    try {
      const res = await fetch(
        `${host}/json/stations/search?name=${encodeURIComponent(q)}&limit=25&hidebroken=true&order=clickcount&reverse=true`,
        { headers: { "User-Agent": "WebRadioPWA/1.0" } }
      );
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const stations = data
        .filter(s => s.url_resolved || s.url)
        .map(s => ({
          name: s.name || "Sans nom",
          url: s.url_resolved || s.url,
          tags: [s.country, s.tags].filter(Boolean).join(" · ")
        }));
      if (!stations.length) {
        status.textContent = "Aucun résultat.";
        return;
      }
      status.textContent = `${stations.length} résultat(s)`;
      searchStations = stations;
      renderSearchResults();
      return;
    } catch {
      continue; // try next mirror
    }
  }
  status.textContent = "Recherche indisponible pour le moment (hors ligne ou API inaccessible).";
});

// ---------- Add custom station ----------
const dialog = document.getElementById("addStationDialog");
document.getElementById("btnAddStation").addEventListener("click", () => dialog.showModal());
document.getElementById("addCancel").addEventListener("click", () => dialog.close());
document.getElementById("addStationForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("addName").value.trim();
  const url = document.getElementById("addUrl").value.trim();
  if (!name || !url) return;
  const list = getCustomStations();
  list.unshift({ name, url, tags: "Ajoutée manuellement" });
  setCustomStations(list);
  dialog.close();
  document.getElementById("addStationForm").reset();
  renderDefaultStations();
  showToast("Station ajoutée");
});

// ---------- History clear ----------
document.getElementById("btnClearHistory").addEventListener("click", () => {
  setHistory([]);
  renderHistory();
});

// ---------- Recording ----------
document.getElementById("btnRecord").addEventListener("click", () => {
  if (!currentStation) { showToast("Choisissez une station d'abord"); return; }
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecording();
  } else {
    startRecording();
  }
});

function startRecording() {
  try {
    if (!window.MediaRecorder) throw new Error("MediaRecorder unavailable");
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (!mediaElementSource) {
      mediaElementSource = audioCtx.createMediaElementSource(player);
      mediaStreamDest = audioCtx.createMediaStreamDestination();
      mediaElementSource.connect(mediaStreamDest);
      mediaElementSource.connect(audioCtx.destination);
    }

    recordedChunks = [];
    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"]
      .find(type => MediaRecorder.isTypeSupported(type));
    mediaRecorder = new MediaRecorder(mediaStreamDest.stream, mimeType ? { mimeType } : undefined);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start();

    document.getElementById("btnRecord").classList.add("recording");
    showToast("Enregistrement démarré");
  } catch (err) {
    console.error("Recording failed", err);
    showToast("Ce flux ou ce navigateur ne permet pas l'enregistrement");
  }
}

function stopRecording() {
  if (mediaRecorder) mediaRecorder.stop();
  document.getElementById("btnRecord").classList.remove("recording");
}

function saveRecording() {
  if (!recordedChunks.length) {
    showToast("Aucune donnée audio à enregistrer");
    return;
  }
  const blob = new Blob(recordedChunks, { type: mediaRecorder?.mimeType || "audio/webm" });
  const id = "rec_" + Date.now();
  recordingBlobs[id] = URL.createObjectURL(blob);
  const meta = getRecordings();
  meta.unshift({
    id,
    name: currentStation ? currentStation.name : "Enregistrement",
    date: Date.now(),
    type: blob.type
  });
  store.set("wr_recordings_meta", meta.slice(0, 20));
  showToast("Enregistrement prêt à télécharger");
  renderRecordings();
}

function downloadRecording(id) {
  const url = recordingBlobs[id];
  if (!url) { showToast("Cet enregistrement n'est plus disponible (rechargement de page)."); return; }
  const meta = getRecordings().find(r => r.id === id);
  const a = document.createElement("a");
  a.href = url;
  const extension = meta?.type?.includes("ogg") ? "ogg" : "webm";
  a.download = `${(meta?.name || "enregistrement").replace(/[^a-z0-9]/gi, "_")}.${extension}`;
  a.click();
}

// ---------- Init ----------
renderDefaultStations();
renderFavorites();
renderHistory();
renderRecordings();
updateFavButton();

// ---------- Service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
