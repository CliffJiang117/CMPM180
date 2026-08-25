import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getDatabase,
  ref,
  get,
  set,
  push,
  remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import { generatePoem } from "./poem.js";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5FsolRiukD6H1xUmOroLkT_hJekMhgzk",
  authDomain: "project-3-479c2.firebaseapp.com",
  databaseURL: "https://project-3-479c2-default-rtdb.firebaseio.com",
  projectId: "project-3-479c2",
  storageBucket: "project-3-479c2.firebasestorage.app",
  messagingSenderId: "617724418172",
  appId: "1:617724418172:web:f07d3863dca868504651f9",
  measurementId: "G-TFZX9X2KB6"
};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);



// Device detection
function isMobileDevice() {
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") {
    return navigator.userAgentData.mobile;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth <= 1024);
}



// Show page based on device type
const mobilePage = document.getElementById("mobilePage");

const desktopPage = document.getElementById("desktopPage");

// Remember to change this!
//if (isMobileDevice()) {
if (false) {

  mobilePage.classList.remove("hidden");

} else {

  desktopPage.classList.remove("hidden");

}



// Format time as HHMM
function getTimeCode(date) {

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return hours + minutes;
}



// 
function getFirstCharacter(text) {
  const cleaned = text.trim();

  return Array.from(cleaned)[0].toUpperCase();
}



// password generation
function generatePassword(word1, word2, place, timeCode) {
  const first = getFirstCharacter(word1);

  const second = getFirstCharacter(word2);

  const third = getFirstCharacter(place);

  return first + second + third + timeCode;
}



// Make sure password is unique
async function makeUniquePassword(basePassword) {

  const passwordRef = ref(database, "active_passwords/" + basePassword);

  const snapshot = await get(passwordRef);


  if (!snapshot.exists()) {

    return basePassword;

  }


  // Collision occurred

  let password;

  do {

    const randomDigit = Math.floor(Math.random() * 10);

    password = basePassword + randomDigit;

    const checkRef = ref(database, "active_passwords/" + password);

    const checkSnapshot = await get(checkRef);

    if (!checkSnapshot.exists()) {
      return password;
    }

  } while (true);

}


// ---------------------------------------------------------
// Mobile form
const form = document.getElementById("mobileForm");

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const word1 = document.getElementById("word1").value.trim();
    const word2 = document.getElementById("word2").value.trim();


    const place = document.getElementById("place").value.trim();


    if (!word1 || !word2 || !place) {
      return;

    }


    try {

      // Get current Firebase server time
      const timeCode = getTimeCode(new Date());


      // EX: 
      // memory + Rain + santa Cruz + 2259
      // =MRS2259
      // if more then one member using same password? fixed
      // if not a word? fuck it, let them use it idc

      const basePassword = generatePassword(word1, word2, place, timeCode);


      const password = await makeUniquePassword(basePassword);


      // Store contribution in Firebase

      await set(
        ref(
          database,
          "active_passwords/" + password
        ),
        {
          word1,
          word2,
          place,
          time: timeCode
        }
      );


      // Show password

      document.getElementById("passwordDisplay").textContent = password;


      document.getElementById("mobileForm").classList.add("hidden");


      document.getElementById("passwordResult").classList.remove("hidden");


      console.log("Created password:", password);


    } catch (error) {

      console.error("Firebase error:", error);
    }

  }
);


// ---------------------------------------------------------
// Desktop password form

const desktopForm = document.getElementById("desktopForm");

const passwordInput = document.getElementById("passwordInput");

const passwordError = document.getElementById("passwordError");
const passwordPage = document.getElementById("passwordPage");

const poemPage = document.getElementById("poemPage");
const poemDisplay = document.getElementById("poemDisplay");


async function loadPoem() {
  try {
    const poemRef = ref(database, "poem_entries");
    const snapshot = await get(poemRef);

    if (!snapshot.exists()) {
      poemDisplay.textContent = "Nothing has arrived yet.";
      return;
    }

    const entries = Object.values(snapshot.val());

    poemDisplay.textContent = generatePoem(entries);

  } catch (error) {
    console.error("Could not load poem:", error);
    poemDisplay.textContent = "Could not load poem.";
  }
}


// Check if this computer has already submitted before

if (localStorage.getItem("hasSubmitted") === "true") {

  passwordPage.classList.add("hidden");
  poemPage.classList.remove("hidden");

  loadPoem();

}


// Password submission

desktopForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const password = passwordInput.value.trim().toUpperCase();


    if (!password) {
      return;
    }


    try {

      // Find password in Firebase

      const passwordRef = ref(database, "active_passwords/" + password);


      const snapshot = await get(passwordRef);


      // Password does not exist

      if (!snapshot.exists()) {
        passwordError.textContent = "Invalid password.";

        return;
      }


      // Get the data carried by the password

      const contribution = snapshot.val();

      console.log("Password found:", contribution);

      // Create a permanent poem entry
      const poemEntriesRef = ref(database, "poem_entries");


      await push(poemEntriesRef, contribution);


      // Delete temporary password
      await remove(passwordRef);

      // Remember that this desktop has already submitted
      localStorage.setItem("hasSubmitted", "true");


      // Switch to poem page

      passwordPage.classList.add("hidden");


      poemPage.classList.remove("hidden");


      console.log("Password redeemed:", password);

      await loadPoem();


    } catch (error) {

      console.error("Firebase error:", error);

      passwordError.textContent = "Something went wrong.";

    }

  }
);



// Reset desktop submission memory
const resetDesktopButton = document.getElementById("resetDesktop");

resetDesktopButton.addEventListener("click", function () {
  localStorage.removeItem("hasSubmitted");

  passwordPage.classList.remove("hidden");
  poemPage.classList.add("hidden");

  console.log("Desktop submission memory cleared.");
});
