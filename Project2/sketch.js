let clips = [];

let draggedClip = null;
let dragGhost = null;

let piano;

let savedSequence = [];

let clipSounds = {};

let currentPreview = null;
let currentPreviewClip = null;

const TOTAL_LIFETIME = 60;
const FINAL_PHASE_TIME = 24;
const FALL_AT_REMAINING = 3;

let started = false;
let startTime = 0;

let phase = "waiting";
// waiting
// selecting
// dancing
// ended

let currentDanceSound = null;
let danceClipIndex = 0;

let sequenceFinished = false;


let idleImage;
let danceImages = [];
let graveImage;

const SAVE_KEY = "lastDance_memorial";

let memorialPlaying = false;
let memorialSound = null;

// Testing only
// could change to false for final version.
const SHOW_RESET_BUTTON = true;

let currentDanceImage = 0;
let lastDanceImageChange = 0;

const DANCE_IMAGE_INTERVAL = 700;

let characterX = 700;
let characterY = 360;
let characterSize = 180;

let fallStartTime = null;
const FALL_DURATION = 800;


async function setup() {
    createCanvas(900, 600);

    // Load all audio files first
    clipSounds.A = await loadSound("./assets/Clip_A.wav");
    clipSounds.B = await loadSound("./assets/Clip_B.wav");
    clipSounds.C = await loadSound("./assets/Clip_C.wav");
    clipSounds.D = await loadSound("./assets/Clip_D.wav");
    clipSounds.E = await loadSound("./assets/Clip_E.wav");
    clipSounds.F = await loadSound("./assets/Clip_F.wav");

    console.log("A sound =", clipSounds.A);
    console.log("A constructor =", clipSounds.A?.constructor?.name);
    console.log("A play =", clipSounds.A?.play);

    idleImage = await loadImage("./assets/MrD_Idle.png");

    danceImages[0] = await loadImage("./assets/MrD_Dance1.png");
    danceImages[1] = await loadImage("./assets/MrD_Dance2.png");
    danceImages[2] = await loadImage("./assets/MrD_Dance3.png");
    danceImages[3] = await loadImage("./assets/MrD_Dance4.png");

    graveImage = await loadImage("./assets/grave.png");

    piano = {
        x: width / 2,
        y: 420,
        w: 300,
        h: 140,
        highlighted: false
    };

    createClips();
}


function createClips() {

    const names = ["A", "B", "C", "D", "E", "F"];

    const startX = 120;
    const spacing = 130;

    for (let i = 0; i < names.length; i++) {

        let id = names[i];

        clips.push({
            id: id,

            x: startX + i * spacing,
            y: 150,

            w: 90,
            h: 60,

            sound: clipSounds[id],

            selected: false,
            deleted: false,

            wasHovered: false
        });
    }
    loadMemorial();

    if (SHOW_RESET_BUTTON) {
        createResetButton();
    }
}



function draw() {
    background(25);

    updateTimeline();

    // Memorial state
    if (phase === "ended") {
        drawPiano();
        drawGrave();
        return;
    }

    if (phase === "selecting") {
        updateClipPreview();
    }

    updateDanceImage();

    drawPiano();
    drawClips();
    drawDragGhost();
    drawSavedSequence();
    drawTimer();
    drawCharacter();
}




function updateClipPreview() {

    // While dragging, keep the current preview playing
    if (draggedClip) {
        return;
    }

    for (let clip of clips) {

        if (clip.deleted || clip.selected) {
            clip.wasHovered = false;
            continue;
        }

        let hovering = mouseInsideClip(clip);

        // Mouse enters
        if (
            hovering &&
            !clip.wasHovered
        ) {
            playPreview(clip);
        }

        // Mouse leaves
        if (
            !hovering &&
            clip.wasHovered &&
            currentPreviewClip === clip
        ) {
            stopPreview();
        }

        clip.wasHovered = hovering;
    }
}


// function drawTitle() {
//     fill(255);
//     noStroke();

//     textAlign(CENTER, CENTER);
//     textSize(28);

//     text("LAST DANCE", width / 2, 60);
// }

function playPreview(clip) {

    // Stop previous clip
    if (currentPreview && currentPreview.isPlaying()) {
        currentPreview.stop();
    }

    currentPreview = clip.sound;
    currentPreviewClip = clip;

    currentPreview.play();
}
function stopPreview() {

    if (currentPreview && currentPreview.isPlaying()) {
        currentPreview.stop();
    }

    currentPreview = null;
    currentPreviewClip = null;
}

function saveClip(clip) {

    if (phase !== "selecting") {
        return;
    }

    if (clip.selected) {
        return;
    }

    if (currentPreviewClip === clip) {
        stopPreview();
    }

    clip.selected = true;

    savedSequence.push(clip.id);

    console.log("Saved sequence:", savedSequence);

    deleteRandomClip();
}


function drawClips() {

    for (let clip of clips) {

        if (clip.deleted || clip.selected) {
            continue;
        }

        let hovering = mouseInsideClip(clip);

        push();

        rectMode(CENTER);

        if (hovering) {
            fill(235);
            stroke(255);
            strokeWeight(3);
        }
        else {
            fill(210);
            stroke(255);
            strokeWeight(2);
        }

        rect(clip.x, clip.y, clip.w, clip.h, 6);

        fill(20);
        noStroke();

        textAlign(CENTER, CENTER);
        textSize(24);

        text(clip.id, clip.x, clip.y);

        pop();
    }
}


function drawPiano() {

    push();

    rectMode(CENTER);

    if (piano.highlighted) {
        fill(100);
        stroke(255);
        strokeWeight(4);
    }
    else {
        fill(55);
        stroke(150);
        strokeWeight(2);
    }

    rect(
        piano.x,
        piano.y,
        piano.w,
        piano.h,
        10
    );

    fill(255);
    noStroke();

    textAlign(CENTER, CENTER);
    textSize(22);

    text(
        "PIANO",
        piano.x,
        piano.y
    );

    pop();
}



function drawDragGhost() {

    if (!dragGhost) {
        return;
    }

    push();

    rectMode(CENTER);

    fill(255, 120);
    stroke(255, 180);
    strokeWeight(2);

    rect(
        dragGhost.x,
        dragGhost.y,
        dragGhost.w,
        dragGhost.h,
        6
    );

    fill(255);
    noStroke();

    textAlign(CENTER, CENTER);
    textSize(24);

    text(
        draggedClip.id,
        dragGhost.x,
        dragGhost.y
    );

    pop();
}



function drawSavedSequence() {

    fill(200);
    noStroke();

    textAlign(CENTER, CENTER);
    textSize(18);

    let sequenceText = "Saved: ";

    if (savedSequence.length === 0) {
        sequenceText += "none";
    }
    else {
        sequenceText += savedSequence.join(" → ");
    }

    text(
        sequenceText,
        width / 2,
        540
    );
}



function mousePressed() {

    // Memorial interaction
    if (phase === "ended") {

        userStartAudio();

        if (pointInsidePiano(mouseX, mouseY)) {
            startMemorialReplay();
        }

        return;
    }

    // First click starts the 60 second lifetime
    if (!started) {
        startPiece();
    }

    // No dragging outside selection phase
    if (phase !== "selecting") {
        return;
    }

    for (let i = clips.length - 1; i >= 0; i--) {

        let clip = clips[i];

        if (clip.deleted || clip.selected) {
            continue;
        }

        if (mouseInsideClip(clip)) {

            draggedClip = clip;

            if (currentPreviewClip !== clip) {
                playPreview(clip);
            }

            dragGhost = {
                x: clip.x,
                y: clip.y,
                w: clip.w,
                h: clip.h
            };

            break;
        }
    }
}


function mouseDragged() {

    if (phase !== "selecting") {
        return;
    }

    if (!dragGhost) {
        return;
    }

    dragGhost.x = mouseX;
    dragGhost.y = mouseY;

    piano.highlighted = pointInsidePiano(dragGhost.x, dragGhost.y);
}


function mouseReleased() {

    if (phase !== "selecting") {

        draggedClip = null;
        dragGhost = null;
        piano.highlighted = false;

        return;
    }

    if (!draggedClip || !dragGhost) {
        return;
    }

    if (pointInsidePiano(dragGhost.x, dragGhost.y)) {
        saveClip(draggedClip);
    }

    draggedClip = null;
    dragGhost = null;

    piano.highlighted = false;
}




function mouseInsideClip(clip) {

    return (
        mouseX >= clip.x - clip.w / 2 &&
        mouseX <= clip.x + clip.w / 2 &&
        mouseY >= clip.y - clip.h / 2 &&
        mouseY <= clip.y + clip.h / 2
    );
}

function pointInsidePiano(x, y) {

    return (
        x >= piano.x - piano.w / 2 &&
        x <= piano.x + piano.w / 2 &&
        y >= piano.y - piano.h / 2 &&
        y <= piano.y + piano.h / 2
    );
}


function deleteRandomClip() {

    let availableClips = clips.filter((clip) => !clip.selected && !clip.deleted);

    if (availableClips.length === 0) {
        return;
    }

    let randomIndex = floor(random(availableClips.length));

    let clipToDelete = availableClips[randomIndex];

    if (currentPreviewClip === clipToDelete) {
        stopPreview();
    }

    clipToDelete.deleted = true;

    console.log("Deleted:", clipToDelete.id);
}

function getRemainingTime() {

    if (!started) {
        return TOTAL_LIFETIME;
    }

    let elapsed = (millis() - startTime) / 1000;

    return max(0, TOTAL_LIFETIME - elapsed);
}


function updateTimeline() {


    if (!started) {
        return;
    }

    let remaining = getRemainingTime();

    // Death
    if (remaining <= 0) {
        endPiece();
        return;
    }

    // Selection time ends
    if (phase === "selecting" && remaining <= FINAL_PHASE_TIME) {
        beginFinalPhase();
    }

    // Character falls at a fixed remaining time
    if (
        phase === "dancing" &&
        remaining <= FALL_AT_REMAINING &&
        fallStartTime === null
    ) {
        fallStartTime = millis();

        console.log("Character begins to fall.");
    }
}



function startPiece() {
    if (started) {
        return;
    }

    userStartAudio();

    started = true;
    startTime = millis();

    phase = "selecting";

    console.log("Life started.");
}



function beginFinalPhase() {
    if (phase !== "selecting") {
        return;
    }

    phase = "dancing";

    console.log("Last Dance begins.");

    stopPreview();

    // Cancel unfinished drag
    draggedClip = null;
    dragGhost = null;
    piano.highlighted = false;

    // Remove every clip that was not saved
    for (let clip of clips) {
        if (!clip.selected) {
            clip.deleted = true;
        }
    }

    danceClipIndex = 0;
    sequenceFinished = false;

    playSavedSequence(0);
}



function playSavedSequence(index) {

    if (phase !== "dancing") {
        return;
    }

    // Sequence finished
    if (index >= savedSequence.length) {

    currentDanceSound = null;
    sequenceFinished = true;

    console.log("Dance music finished.");

    return;
}

    let clipID = savedSequence[index];
    let sound = clipSounds[clipID];

    danceClipIndex = index;
    currentDanceSound = sound;

    console.log("Playing:", clipID);

    sound.onended(() => {

        if (phase !== "dancing") {
            return;
        }

        currentDanceSound = null;

        playSavedSequence(index + 1);
    });

    sound.play();
}


function endPiece() {
    if (phase === "ended") {
        return;
    }

    phase = "ended";

    stopPreview();

    if (currentDanceSound && currentDanceSound.isPlaying()) {
        currentDanceSound.stop();
    }

    currentDanceSound = null;

    draggedClip = null;
    dragGhost = null;
    piano.highlighted = false;

    saveMemorial();

    console.log("Life ended.");
}



function drawTimer() {

    let remaining = ceil(getRemainingTime());

    push();

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);

    // Main lifetime countdown
    textSize(52);

    text("00:" + nf(remaining, 2), width / 2, 48);

    // Current state / instruction
    textSize(15);

    if (phase === "waiting") {
        text("CLICK TO BEGIN", width / 2, 92);
    }
    else if (phase === "selecting") {

        text("SELECTION ENDS AT 00:24", width / 2, 92);
    }
    else if (phase === "dancing" && !sequenceFinished) 
    {

        text("LAST DANCE", width / 2, 92);
    }
    else if (
        phase === "dancing" &&
        sequenceFinished
    ) {
        text("THE MUSIC HAS ENDED", width / 2, 92);
    }
    else if (phase === "ended") {
        text("END", width / 2, 92);
    }

    pop();
}


function updateDanceImage() {


    if (phase !== "dancing" || fallStartTime !== null) return;

    if (millis() - lastDanceImageChange >= DANCE_IMAGE_INTERVAL) {
        let nextImage;

        do {
            nextImage = floor(random(danceImages.length));
        }
        while (nextImage === currentDanceImage && danceImages.length > 1);

        currentDanceImage = nextImage;

        lastDanceImageChange = millis();
    }
}

function drawCharacter() {

    push();

    imageMode(CENTER);

    // Before the Last Dance
    if (phase === "waiting" || phase === "selecting") {

        image(
            idleImage,
            characterX,
            characterY,
            characterSize,
            characterSize
        );
    }
    // Keep dancing until the fall time
    else if (phase === "dancing" && fallStartTime === null) {

        image(
            danceImages[currentDanceImage],
            characterX,
            characterY,
            characterSize,
            characterSize
        );
    }
    // Final fall
    else if (phase === "dancing" && fallStartTime !== null){
        drawFallenCharacter();
    }

    pop();
}

function drawFallenCharacter() {

    let fallProgress = constrain(
        (millis() - fallStartTime) / FALL_DURATION,
        0,
        1,
    );

    let angle = lerp(
        0,
        HALF_PI,
        fallProgress
    );

    push();

    translate(characterX, characterY);

    rotate(angle);

    imageMode(CENTER);

    image(
        idleImage,
        0,
        0,
        characterSize,
        characterSize
    );

    pop();
}


function drawGrave() {

    push();

    imageMode(CENTER);

    image(
        graveImage,
        characterX,
        characterY,
        characterSize,
        characterSize
    );

    pop();
}

function saveMemorial() {
    let saveData = {
        completed: true,
        sequence: savedSequence
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

    console.log("Memorial saved:", saveData);
}


function loadMemorial() {

    let saved = localStorage.getItem(SAVE_KEY);

    if (!saved) {
        return;
    }

    try {
        let saveData = JSON.parse(saved);

        if (!saveData.completed) {
            return;
        }

        if (Array.isArray(saveData.sequence)) {
            savedSequence = saveData.sequence.filter((id) => clipSounds[id]);
        }

        phase = "ended";

        console.log("Memorial loaded:", savedSequence);
    }
    catch (error) {
        console.error("Could not load memorial:", error);
    }
}

function startMemorialReplay() {

    if (memorialPlaying) {
        return;
    }

    if (savedSequence.length === 0) {
        return;
    }

    memorialPlaying = true;

    playMemorialClip(0);
}

function playMemorialClip(index) {

    if (index >= savedSequence.length) {
        memorialPlaying = false;
        memorialSound = null;

        return;
    }

    let clipID = savedSequence[index];

    memorialSound = clipSounds[clipID];

    memorialSound.onended(() => {
        memorialSound = null;

        playMemorialClip(index + 1);
    });

    memorialSound.play();
}



function createResetButton() {

    let button = document.createElement("button");

    button.innerText = "RESET SAVE";

    button.style.position = "fixed";
    button.style.right = "10px";
    button.style.bottom = "10px";

    button.style.opacity = "0.12";
    button.style.fontSize = "10px";

    button.style.cursor = "pointer";

    button.addEventListener("mouseenter", () => {
        button.style.opacity = "0.8";
    });

    button.addEventListener("mouseleave", () => {
        button.style.opacity = "0.12";
    });

    button.addEventListener("click", resetMemorial);

    document.body.appendChild(button);
}

function resetMemorial() {
    localStorage.removeItem(SAVE_KEY);

    console.log("Memorial reset.");

    location.reload();
}

