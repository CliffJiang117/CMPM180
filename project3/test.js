import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getDatabase,
  ref,
  set
} from
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


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


document
  .getElementById("testButton")
  .addEventListener("click", async () => {

    await set(
      ref(database, "test/message"),
      "hello"
    );

    console.log("hello was written to Firebase");
  });