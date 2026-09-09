// ---------- i18n ----------
const I18N = {
  fr: {
    dialLabel: "EN LECTURE",
    dialNoStation: "Aucune station",
    dialChoose: "Choisissez une station pour commencer",
    dialLive: "Lecture en direct",
    favTitle: "Ajouter aux favoris",
    playAria: "Lecture / Pause",
    recordTitle: "Enregistrer",
    muteAria: "Couper le son",
    tabStations: "Stations",
    tabSearch: "Recherche",
    tabFavorites: "Favoris",
    tabHistory: "Historique",
    tabRecordings: "Enregistrements",
    stationsHeading: "Stations suggérées",
    addStationBtn: "+ Ajouter une station",
    searchHeading: "Rechercher une radio",
    searchPlaceholder: "Nom, pays, genre… (ex. jazz, France, rock)",
    searchButton: "Chercher",
    searchHint: "Recherche via l'annuaire public Radio-Browser.",
    searchSearching: "Recherche en cours…",
    searchNoResults: "Aucun résultat.",
    searchResultsCount: (n) => `${n} résultat(s)`,
    searchUnavailable: "Recherche indisponible pour le moment (hors ligne ou API inaccessible).",
    favoritesHeading: "Favoris",
    favoritesEmpty: "Aucun favori pour l'instant. Touchez ♡ sur une station pour l'ajouter ici.",
    historyHeading: "Historique",
    historyClear: "Effacer",
    historyEmpty: "Les stations écoutées récemment apparaîtront ici.",
    recordingsHeading: "Enregistrements",
    recordingsClearAll: "Tout effacer",
    recordingsHint: "L'enregistrement capture le flux en cours de lecture jusqu'à ce que vous l'arrêtiez. Le fichier est ensuite téléchargeable.",
    recordingsEmpty: "Aucun enregistrement pour l'instant.",
    downloadBtn: "Télécharger",
    deleteBtn: "Supprimer",
    addDialogTitle: "Ajouter une station",
    addDialogNameLabel: "Nom",
    addDialogNamePlaceholder: "Ma radio",
    addDialogUrlLabel: "URL du flux",
    addDialogCancel: "Annuler",
    addDialogSubmit: "Ajouter",
    confirmCancel: "Annuler",
    confirmDelete: "Supprimer",
    confirmDeleteRecording: (name) => `Supprimer l'enregistrement "${name}" ? Cette action est définitive.`,
    confirmDeleteAllRecordings: "Supprimer tous les enregistrements ? Cette action est définitive.",
    toastFavAdded: "Ajouté aux favoris",
    toastFavRemoved: "Retiré des favoris",
    toastChooseStation: "Choisissez une station",
    toastChooseStationFirst: "Choisissez une station d'abord",
    toastPlaybackError: "Erreur de lecture du flux",
    toastCannotPlay: "Impossible de lire ce flux",
    toastStationAdded: "Station ajoutée",
    toastRecordingStarted: "Enregistrement démarré",
    toastRecordingUnsupported: "Enregistrement non pris en charge sur ce flux/navigateur",
    toastRecordingReady: "Enregistrement prêt à télécharger",
    toastRecordingDeleted: (name) => `"${name}" supprimé`,
    toastRecordingGenericDeleted: "Enregistrement supprimé",
    toastRecordingUnavailable: "Cet enregistrement n'est plus disponible (rechargement de page).",
    customStationTag: "Ajoutée manuellement",
    unnamedStation: "Sans nom",
    defaultRecordingName: "Enregistrement"
  },
  en: {
    dialLabel: "NOW PLAYING",
    dialNoStation: "No station",
    dialChoose: "Choose a station to get started",
    dialLive: "Live playback",
    favTitle: "Add to favorites",
    playAria: "Play / Pause",
    recordTitle: "Record",
    muteAria: "Mute",
    tabStations: "Stations",
    tabSearch: "Search",
    tabFavorites: "Favorites",
    tabHistory: "History",
    tabRecordings: "Recordings",
    stationsHeading: "Suggested stations",
    addStationBtn: "+ Add a station",
    searchHeading: "Search for a station",
    searchPlaceholder: "Name, country, genre… (e.g. jazz, France, rock)",
    searchButton: "Search",
    searchHint: "Search via the public Radio-Browser directory.",
    searchSearching: "Searching…",
    searchNoResults: "No results.",
    searchResultsCount: (n) => `${n} result(s)`,
    searchUnavailable: "Search unavailable right now (offline or API unreachable).",
    favoritesHeading: "Favorites",
    favoritesEmpty: "No favorites yet. Tap ♡ on a station to add it here.",
    historyHeading: "History",
    historyClear: "Clear",
    historyEmpty: "Recently played stations will appear here.",
    recordingsHeading: "Recordings",
    recordingsClearAll: "Clear all",
    recordingsHint: "Recording captures the stream currently playing until you stop it. The file can then be downloaded.",
    recordingsEmpty: "No recordings yet.",
    downloadBtn: "Download",
    deleteBtn: "Delete",
    addDialogTitle: "Add a station",
    addDialogNameLabel: "Name",
    addDialogNamePlaceholder: "My station",
    addDialogUrlLabel: "Stream URL",
    addDialogCancel: "Cancel",
    addDialogSubmit: "Add",
    confirmCancel: "Cancel",
    confirmDelete: "Delete",
    confirmDeleteRecording: (name) => `Delete recording "${name}"? This action is permanent.`,
    confirmDeleteAllRecordings: "Delete all recordings? This action is permanent.",
    toastFavAdded: "Added to favorites",
    toastFavRemoved: "Removed from favorites",
    toastChooseStation: "Choose a station",
    toastChooseStationFirst: "Choose a station first",
    toastPlaybackError: "Playback error",
    toastCannotPlay: "Unable to play this stream",
    toastStationAdded: "Station added",
    toastRecordingStarted: "Recording started",
    toastRecordingUnsupported: "Recording not supported for this stream/browser",
    toastRecordingReady: "Recording ready to download",
    toastRecordingDeleted: (name) => `"${name}" deleted`,
    toastRecordingGenericDeleted: "Recording deleted",
    toastRecordingUnavailable: "This recording is no longer available (page was reloaded).",
    customStationTag: "Added manually",
    unnamedStation: "Unnamed",
    defaultRecordingName: "Recording"
  }
};

let currentLang = localStorage.getItem("wr_lang") || "fr";

function t(key, ...args) {
  const entry = (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.fr[key];
  return typeof entry === "function" ? entry(...args) : entry;
}

function stationTag(station) {
  if (station && station.tags && typeof station.tags === "object") {
    return station.tags[currentLang] || station.tags.fr || station.tags.en || "";
  }
  return (station && station.tags) || "";
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("wr_lang", lang);
  applyStaticTranslations();
  renderDefaultStations();
  renderFavorites();
  renderHistory();
  renderRecordings();
  updateFavButton();
  if (currentStation) {
    document.getElementById("stationMeta").textContent = stationTag(currentStation) || t("dialLive");
  }
}

document.getElementById("langSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn) return;
  setLanguage(btn.dataset.lang);
});

// ---------- Config ----------
const RADIO_API_HOSTS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://at1.api.radio-browser.info"
];

const DEFAULT_STATIONS = [
  { name: "FIP", url: "https://icecast.radiofrance.fr/fip-hifi.aac", tags: { fr: "France · Éclectique", en: "France · Eclectic" } },
  { name: "France Info", url: "https://icecast.radiofrance.fr/franceinfo-hifi.aac", tags: { fr: "France · Actualités", en: "France · News" } },
  { name: "Radio Swiss Jazz", url: "https://stream.srg-ssr.ch/m/rsj/mp3_128", tags: { fr: "Suisse · Jazz", en: "Switzerland · Jazz" } },
  { name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-128-mp3", tags: { fr: "USA · Ambiance / Downtempo", en: "USA · Ambient / Downtempo" } },
  { name: "Radio Nova", url: "https://novazz.ice.infomaniak.ch/novazz-128.mp3", tags: { fr: "France · Musique éclectique", en: "France · Eclectic music" } }
];

// ---------- State ----------
const player = document.getElementById("player");
let currentStation = null;   // { name, url, tags }
let mediaRecorder = null;
let recordedChunks = [];
let audioCtx = null;
let mediaStreamDest = null;

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

// ---------- Confirm dialog ----------
const confirmDialog = document.getElementById("confirmDialog");
function askConfirm(message) {
  return new Promise((resolve) => {
    document.getElementById("confirmMessage").textContent = message;
    confirmDialog.showModal();
    const okBtn = document.getElementById("confirmOk");
    const cancelBtn = document.getElementById("confirmCancel");
    function cleanup(result) {
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      confirmDialog.close();
      resolve(result);
    }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
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

function stationItemHTML(station) {
  const fav = isFavorite(station);
  const sub = stationTag(station) || station.url;
  return `
    <li class="station-item" data-url="${encodeURIComponent(station.url)}">
      <div class="station-info">
        <div class="station-title">${escapeHTML(station.name)}</div>
        <div class="station-sub">${escapeHTML(sub)}</div>
      </div>
      <button class="station-fav ${fav ? "active" : ""}" data-action="fav" aria-label="${t("favTitle")}">${heartIcon(fav)}</button>
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

function renderRecordings() {
  const recs = getRecordings();
  const ul = document.getElementById("recordingsList");
  document.getElementById("recordingsEmpty").style.display = recs.length ? "none" : "block";
  const localeTag = currentLang === "fr" ? "fr-FR" : "en-US";
  ul.innerHTML = recs.map(r => `
    <li class="station-item" data-rec="${r.id}">
      <div class="station-info">
        <div class="station-title">${escapeHTML(r.name)}</div>
        <div class="station-sub">${new Date(r.date).toLocaleString(localeTag)}</div>
      </div>
      <div class="rec-actions">
        <button class="btn-link" data-action="download" data-rec="${r.id}">${t("downloadBtn")}</button>
        <button class="btn-link btn-danger" data-action="delete" data-rec="${r.id}">${t("deleteBtn")}</button>
      </div>
    </li>
  `).join("");
  ul.querySelectorAll('[data-action="download"]').forEach(btn => {
    btn.addEventListener("click", () => downloadRecording(btn.dataset.rec));
  });
  ul.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener("click", () => deleteRecording(btn.dataset.rec));
  });
}

async function deleteRecording(id) {
  const meta = getRecordings();
  const rec = meta.find(r => r.id === id);
  const ok = await askConfirm(t("confirmDeleteRecording", rec ? rec.name : ""));
  if (!ok) return;
  const remaining = meta.filter(r => r.id !== id);
  store.set("wr_recordings_meta", remaining);
  if (recordingBlobs[id]) {
    URL.revokeObjectURL(recordingBlobs[id]);
    delete recordingBlobs[id];
  }
  showToast(rec ? t("toastRecordingDeleted", rec.name) : t("toastRecordingGenericDeleted"));
  renderRecordings();
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
  const nowFav = !isFavorite(station);
  if (!nowFav) {
    favs = favs.filter(s => stationKey(s) !== stationKey(station));
    showToast(t("toastFavRemoved"));
  } else {
    favs.unshift(station);
    showToast(t("toastFavAdded"));
  }
  setFavorites(favs);

  // Update the heart icon everywhere this station is currently shown
  // (Stations, Recherche, Historique, Favoris), not just the list clicked.
  const encoded = encodeURIComponent(station.url);
  document.querySelectorAll(`.station-item[data-url="${encoded}"] .station-fav`).forEach(btn => {
    btn.innerHTML = heartIcon(nowFav);
    btn.classList.toggle("active", nowFav);
  });

  renderFavorites(); // list membership changed: add or remove the row itself
  updateFavButton();
}

// ---------- Playback ----------
function playStation(station) {
  currentStation = station;
  player.src = station.url;
  player.play().catch(() => showToast(t("toastCannotPlay")));
  document.getElementById("stationName").textContent = station.name;
  document.getElementById("stationMeta").textContent = stationTag(station) || t("dialLive");
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
  if (!currentStation) { showToast(t("toastChooseStation")); return; }
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
  if (!currentStation) { showToast(t("toastChooseStation")); return; }
  toggleFavorite(currentStation);
});

document.getElementById("volume").addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  player.volume = v;
  if (v > 0 && player.muted) setMuted(false);
});
player.volume = 0.9;

// ---------- Mute ----------
let volumeBeforeMute = 0.9;
function setMuted(muted) {
  player.muted = muted;
  document.getElementById("btnMute").classList.toggle("muted", muted);
  document.getElementById("iconVolume").style.display = muted ? "none" : "block";
  document.getElementById("iconMuted").style.display = muted ? "block" : "none";
}
document.getElementById("btnMute").addEventListener("click", () => {
  if (player.muted) {
    setMuted(false);
  } else {
    volumeBeforeMute = player.volume || volumeBeforeMute;
    setMuted(true);
  }
});

player.addEventListener("pause", () => setPlayIcon(false));
player.addEventListener("playing", () => {
  setPlayIcon(true);
  document.getElementById("dialGlow").classList.add("live");
});
player.addEventListener("error", () => {
  showToast(t("toastPlaybackError"));
  document.getElementById("dialGlow").classList.remove("live");
});

// ---------- MediaSession (contrôles verrouillés / notifications) ----------
function updateMediaSession(station) {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: station.name,
    artist: "WebRadio",
    album: stationTag(station) || "",
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
  status.textContent = t("searchSearching");
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
          name: s.name || t("unnamedStation"),
          url: s.url_resolved || s.url,
          tags: [s.country, s.tags].filter(Boolean).join(" · ")
        }));
      if (!stations.length) {
        status.textContent = t("searchNoResults");
        return;
      }
      status.textContent = t("searchResultsCount", stations.length);
      results.innerHTML = stations.map(s => stationItemHTML(s)).join("");
      attachStationHandlers(results, stations);
      return;
    } catch {
      continue; // try next mirror
    }
  }
  status.textContent = t("searchUnavailable");
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
  list.unshift({ name, url, tags: { fr: "Ajoutée manuellement", en: "Added manually" } });
  setCustomStations(list);
  dialog.close();
  document.getElementById("addStationForm").reset();
  renderDefaultStations();
  showToast(t("toastStationAdded"));
});

// ---------- History clear ----------
document.getElementById("btnClearHistory").addEventListener("click", () => {
  setHistory([]);
  renderHistory();
});

// ---------- Recordings: clear all ----------
document.getElementById("btnClearRecordings").addEventListener("click", async () => {
  if (!getRecordings().length) return;
  const ok = await askConfirm(t("confirmDeleteAllRecordings"));
  if (!ok) return;
  Object.keys(recordingBlobs).forEach(id => URL.revokeObjectURL(recordingBlobs[id]));
  Object.keys(recordingBlobs).forEach(id => delete recordingBlobs[id]);
  store.set("wr_recordings_meta", []);
  renderRecordings();
});

// ---------- Recording ----------
document.getElementById("btnRecord").addEventListener("click", () => {
  if (!currentStation) { showToast(t("toastChooseStationFirst")); return; }
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecording();
  } else {
    startRecording();
  }
});

function startRecording() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(player);
    mediaStreamDest = audioCtx.createMediaStreamDestination();
    source.connect(mediaStreamDest);
    source.connect(audioCtx.destination); // keep audible

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(mediaStreamDest.stream);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start();

    document.getElementById("btnRecord").classList.add("recording");
    showToast(t("toastRecordingStarted"));
  } catch (err) {
    showToast(t("toastRecordingUnsupported"));
  }
}

function stopRecording() {
  if (mediaRecorder) mediaRecorder.stop();
  document.getElementById("btnRecord").classList.remove("recording");
}

function saveRecording() {
  const blob = new Blob(recordedChunks, { type: "audio/webm" });
  const id = "rec_" + Date.now();
  recordingBlobs[id] = URL.createObjectURL(blob);
  const meta = getRecordings();
  meta.unshift({ id, name: currentStation ? currentStation.name : t("defaultRecordingName"), date: Date.now() });
  store.set("wr_recordings_meta", meta.slice(0, 20));
  showToast(t("toastRecordingReady"));
  renderRecordings();
}

function downloadRecording(id) {
  const url = recordingBlobs[id];
  if (!url) { showToast(t("toastRecordingUnavailable")); return; }
  const meta = getRecordings().find(r => r.id === id);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(meta?.name || "recording").replace(/[^a-z0-9]/gi, "_")}.webm`;
  a.click();
}

// ---------- Init ----------
applyStaticTranslations();
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
