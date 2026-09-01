import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5FsolRiukD6H1xUmOroLkT_hJekMhgzk",
  authDomain: "project-3-479c2.firebaseapp.com",
  databaseURL: "https://project-3-479c2-default-rtdb.firebaseio.com",
  projectId: "project-3-479c2",
  storageBucket: "project-3-479c2.firebasestorage.app",
  messagingSenderId: "617724418172",
  appId: "1:617724418172:web:c3181f7c1cda2eeb4651f9",
  measurementId: "G-XTM9BZWBMY"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const SUBMIT_KEY = "project4_has_submitted";

const WORD_BANKS = {
  noun: [
    "memory", "rain", "machine", "home", "shadow",
    "body", "ocean", "dream", "room", "fire"
  ],
  verb: [
    "remember", "forget", "follow", "disappear", "wait",
    "return", "carry", "become", "leave", "fall"
  ],
  adjective: [
    "empty", "broken", "distant", "quiet", "endless",
    "forgotten", "blue", "strange", "cold", "last"
  ]
};

// All timing values are in milliseconds. These are the main balance controls.
const TIMES = {
  appear: 700,      // Fade-in time before a word can be picked up.
  activeMin: 5000,  // Minimum time a world word remains draggable.
  activeMax: 9000,  // Maximum time a world word remains draggable.
  disappear: 1200,  // Fade-out time after the active state ends.
  refresh: 7000,    // Time between new batches in each area.
  decayMin: 7000,   // Minimum time before a slot loses one character.
  decayMax: 11000,  // Maximum time before a slot loses one character.
  discarded: 2500   // Time available to recover a discarded word.
};

const stage = document.querySelector("#stage");
const slots = [...document.querySelectorAll(".word-slot")];
const areas = [...document.querySelectorAll(".word-area")].map(element => ({
  element,
  type: element.dataset.type,
  lastSpawn: performance.now() - Math.random() * TIMES.refresh
}));
const words = new Set();
const dragGhost = document.querySelector("#drag-ghost");
const fieldView = document.querySelector("#field-view");
const galleryView = document.querySelector("#gallery-view");
const poemList = document.querySelector("#poem-list");
const submitButton = document.querySelector("#submit-button");
const submissionOutput = document.querySelector("#submission-output");
const nameModal = document.querySelector("#name-modal");
const authorInput = document.querySelector("#author-input");
const alreadySubmitted = localStorage.getItem(SUBMIT_KEY) === "true";
let drag = null;
let fieldLocked = false;
let submitting = false;

if (alreadySubmitted) submitButton.textContent = "VIEW GALLERY";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}

function createWord(text, options = {}) {
  const element = document.createElement("div");
  element.className = "world-word";
  element.textContent = text;
  stage.append(element);

  // The same object moves between the world and slots, so Anchor state is preserved.
  const word = {
    element,
    originalText: text,
    text,
    punctuation: options.punctuation || false,
    location: "world",
    state: options.state || "APPEAR",
    stateStart: performance.now(),
    activeTime: options.activeTime || random(TIMES.activeMin, TIMES.activeMax),
    areaType: options.areaType || null,
    x: options.x,
    y: options.y,
    frozen: false,
    dead: false,
    dragging: false,
    nextDecay: 0
  };

  words.add(word);
  if (word.state === "ACTIVE") element.classList.add("active", "loose");
  positionWord(word);

  element.addEventListener("pointerdown", event => {
    if (fieldLocked || word.location !== "world" || word.state !== "ACTIVE") return;
    word.dragging = true;
    startDrag({ kind: "world", word }, word.text, event);
  });

  return word;
}

function spawnBatch(area) {
  let count = 0;

  for (const word of words) {
    if (word.location === "world" && word.areaType === area.type) {
      count++;
    }
  }

  const amount = Math.min(randomInt(2, 3), 6 - count);
  const rect = area.element.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const availableWords = [...WORD_BANKS[area.type]];

  for (let i = 0; i < amount; i++) {
    const wordIndex = randomInt(0, availableWords.length - 1);
    const text = availableWords.splice(wordIndex, 1)[0];

    createWord(text, {
      areaType: area.type,
      x: rect.left - stageRect.left + random(35, rect.width - 35),
      y: rect.top - stageRect.top + random(35, rect.height - 35)
    });
  }
}

function positionWord(word) {
  word.element.style.left = `${word.x}px`;
  word.element.style.top = `${word.y}px`;
}

function setState(word, state, now = performance.now()) {
  word.state = state;
  word.stateStart = now;
  word.element.classList.toggle("active", state === "ACTIVE");
}

function updateWorldWord(word, now) {
  if (word.location !== "world" || word.dragging) return;

  const elapsed = now - word.stateStart;

  if (word.state === "APPEAR") {
    word.element.style.opacity = Math.min(elapsed / TIMES.appear, 1);
    if (elapsed >= TIMES.appear) setState(word, "ACTIVE", now);
  } else if (word.state === "ACTIVE") {
    word.element.style.opacity = 1;
    if (elapsed >= word.activeTime) setState(word, "DISAPPEAR", now);
  } else {
    word.element.style.opacity = Math.max(1 - elapsed / TIMES.disappear, 0);
    if (elapsed >= TIMES.disappear) removeWord(word);
  }
}

function placeInSlot(word, index) {
  if (slots[index].word) return false;
  if (word.location === "world") word.element.remove();

  word.location = "slot";
  word.areaType = null;
  word.dragging = false;

  // Frozen words keep their Anchor and never restart the decay timer.
  if (!word.frozen) word.nextDecay = performance.now() + random(TIMES.decayMin, TIMES.decayMax);

  slots[index].word = word;
  renderSlot(index);
  return true;
}

function discardToWorld(word, clientX, clientY) {
  const rect = stage.getBoundingClientRect();

  word.location = "world";
  word.areaType = null;
  word.x = clientX - rect.left;
  word.y = clientY - rect.top;
  word.dragging = false;
  word.activeTime = TIMES.discarded;
  word.element.textContent = word.text;
  word.element.className = "world-word active loose";
  word.element.style.opacity = 1;
  stage.append(word.element);

  positionWord(word);
  setState(word, "ACTIVE");
}

function removeWord(word) {
  words.delete(word);
  word.element.remove();
}

function updateDecay(now) {
  if (fieldLocked) return;

  slots.forEach((slot, index) => {
    const word = slot.word;
    if (!word || word.punctuation || word.frozen || word.dead || now < word.nextDecay) return;

    const characters = [...word.text];
    const livingPositions = [];

    for (let i = 0; i < characters.length; i++) {
      if (characters[i] !== "_" && characters[i] !== "·" && characters[i] !== " ") {
        livingPositions.push(i);
      }
    }

    if (livingPositions.length > 0) {
      const chosen = livingPositions[randomInt(0, livingPositions.length - 1)];
      characters[chosen] = "_";
    }

    word.text = characters.join("");

    if (livingPositions.length <= 1) {
      word.dead = true;
      word.text = "";

      for (const character of word.originalText) {
        word.text += character === " " ? " " : "·";
      }
    } else {
      word.nextDecay = now + random(TIMES.decayMin, TIMES.decayMax);
    }

    renderSlot(index);
  });
}

function renderSlot(index) {
  const slot = slots[index];
  const word = slot.word;
  slot.textContent = word ? word.text : "";
  slot.classList.toggle("has-word", Boolean(word));
  slot.classList.toggle("frozen", Boolean(word && word.frozen));
  slot.classList.toggle("dead", Boolean(word && word.dead));
}

function startDrag(data, text, event) {
  if (fieldLocked) return;

  event.preventDefault();
  drag = data;
  dragGhost.textContent = text;
  dragGhost.style.display = "block";
  moveGhost(event.clientX, event.clientY);
  window.addEventListener("pointerup", finishDrag, { once: true });
}

function moveGhost(x, y) {
  dragGhost.style.left = `${x}px`;
  dragGhost.style.top = `${y}px`;
}

function slotAt(x, y) {
  return slots.findIndex(slot => {
    const rect = slot.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
}

function insideStage(x, y) {
  const rect = stage.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function finishDrag(event) {
  if (!drag) return;

  const data = drag;
  const target = slotAt(event.clientX, event.clientY);
  dragGhost.style.display = "none";
  drag = null;

  if (data.kind === "world") {
    const word = data.word;

    if (target >= 0 && !slots[target].word) placeInSlot(word, target);
    else if (insideStage(event.clientX, event.clientY)) {
      const rect = stage.getBoundingClientRect();
      word.x = event.clientX - rect.left;
      word.y = event.clientY - rect.top;
      word.areaType = null;
      word.element.classList.add("loose");
      word.dragging = false;
      positionWord(word);
    } else word.dragging = false;
  } else if (data.kind === "slot") {
    const source = data.index;
    const word = slots[source].word;
    if (!word) return;

    if (target >= 0 && target !== source) {
      const other = slots[target].word;
      slots[target].word = word;
      slots[source].word = other;
      renderSlot(source);
      renderSlot(target);
    } else if (insideStage(event.clientX, event.clientY)) {
      slots[source].word = null;
      renderSlot(source);
      discardToWorld(word, event.clientX, event.clientY);
    }
  } else if (data.kind === "punctuation" && target >= 0 && !slots[target].word) {
    const rect = stage.getBoundingClientRect();
    const word = createWord(data.text, {
      punctuation: true,
      state: "ACTIVE",
      x: rect.width / 2,
      y: rect.height / 2
    });

    placeInSlot(word, target);
  } else if (data.kind === "anchor" && target >= 0) {
    const word = slots[target].word;
    if (word && !word.punctuation && !word.frozen && !word.dead) {
      word.frozen = true;
      data.tool.classList.add("used");
      data.tool.disabled = true;
      renderSlot(target);
    }
  }
}

slots.forEach((slot, index) => {
  slot.addEventListener("pointerdown", event => {
    if (slot.word) {
      startDrag({ kind: "slot", index }, slot.word.text, event);
    }
  });
});

document.querySelectorAll(".punctuation").forEach(tool => {
  tool.addEventListener("pointerdown", event => {
    const text = tool.dataset.text;
    startDrag({ kind: "punctuation", text }, text, event);
  });
});

document.querySelectorAll(".anchor").forEach(tool => {
  tool.addEventListener("pointerdown", event => {
    if (!tool.disabled) {
      startDrag({ kind: "anchor", tool }, "◆", event);
    }
  });
});

window.addEventListener("pointermove", event => {
  areas.forEach(area => {
    const rect = area.element.getBoundingClientRect();
    const inside = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );

    const mouseX = inside ? `${event.clientX - rect.left}px` : "-200px";
    const mouseY = inside ? `${event.clientY - rect.top}px` : "-200px";
    area.element.style.setProperty("--mouse-x", mouseX);
    area.element.style.setProperty("--mouse-y", mouseY);
  });

  if (drag) moveGhost(event.clientX, event.clientY);
});

submitButton.addEventListener("click", () => {
  if (localStorage.getItem(SUBMIT_KEY) === "true") {
    showGallery();
    return;
  }

  const line = getCurrentLine();
  if (!line) {
    submissionOutput.textContent = "The line is empty.";
    return;
  }

  showNameModal();
});

document.querySelector("#confirm-submit").addEventListener("click", submitPoem);

document.querySelector("#back-button").addEventListener("click", () => {
  galleryView.classList.add("hidden");
  fieldView.classList.remove("hidden");
});

document.querySelector("#reset-button").addEventListener("click", () => {
  localStorage.removeItem(SUBMIT_KEY);
  location.reload();
});

async function showGallery() {
  fieldView.classList.add("hidden");
  galleryView.classList.remove("hidden");
  poemList.textContent = "LOADING";

  try {
    const snapshot = await get(ref(database, "project4_poems"));
    const savedPoems = Object.values(snapshot.val() || {});
    savedPoems.sort((a, b) => (a.time || 0) - (b.time || 0));
    poemList.textContent = "";

    for (const poem of savedPoems) {
      const entry = document.createElement("div");
      const lineElement = document.createElement("div");
      const authorElement = document.createElement("div");

      entry.className = "poem-entry";
      lineElement.className = "poem-line";
      authorElement.className = "poem-author";
      lineElement.textContent = poem.line || "";
      authorElement.textContent = `— ${poem.author}`;

      entry.append(lineElement);
      if (poem.author) entry.append(authorElement);
      poemList.append(entry);
    }

    if (savedPoems.length === 0) poemList.textContent = "No preserved lines yet.";
  } catch (error) {
    poemList.textContent = "Could not load the archive.";
    console.error(error);
  }
}

function update(now) {
  areas.forEach(area => {
    if (now - area.lastSpawn >= TIMES.refresh) {
      spawnBatch(area);
      area.lastSpawn = now;
    }
  });

  [...words].forEach(word => updateWorldWord(word, now));
  updateDecay(now);
  requestAnimationFrame(update);
}

areas.forEach(spawnBatch);
requestAnimationFrame(update);

function getCurrentLine() {
  const parts = [];

  for (const slot of slots) {
    if (slot.word) parts.push(slot.word.text);
  }

  return parts.join(" ").replace(/\s+([,.!?;:])/g, "$1");
}

function showNameModal() {
  authorInput.value = "";
  nameModal.classList.remove("hidden");
  authorInput.focus();
}

function hideNameModal() {
  nameModal.classList.add("hidden");
}

async function submitPoem() {
  if (submitting) return;

  const line = getCurrentLine();
  const author = authorInput.value.trim();

  if (!line) {
    hideNameModal();
    submissionOutput.textContent = "The line is empty.";
    return;
  }

  submitting = true;
  document.querySelector("#confirm-submit").textContent = "SAVING";

  try {
    await push(ref(database, "project4_poems"), {
      line,
      author,
      time: Date.now()
    });

    localStorage.setItem(SUBMIT_KEY, "true");
    fieldLocked = true;
    fieldView.classList.add("locked");
    submitButton.textContent = "VIEW GALLERY";
    submissionOutput.textContent = "PRESERVED";
    hideNameModal();
    await showGallery();
  } catch (error) {
    submissionOutput.textContent = "Could not save. Try again.";
    console.error(error);
  }

  document.querySelector("#confirm-submit").textContent = "PRESERVE";
  submitting = false;
}
