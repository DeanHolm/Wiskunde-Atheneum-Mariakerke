import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyBcMCPdZAnM7kjmWn_uNuKqxm4_wNLDUes",
  authDomain: "schoolwebsite-teller.firebaseapp.com",
  databaseURL: "https://schoolwebsite-teller-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "schoolwebsite-teller",
  storageBucket: "schoolwebsite-teller.appspot.com",
  messagingSenderId: "526962109108",
  appId: "1:526962109108:web:63cabd95ec954de031c5e1",
  measurementId: "G-NW27LLN6GJ"
};

/* ================= INITIALISATIE ================= */

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/* ================= DATUM FUNCTIE ================= */

// Geeft bv: "2026-02-07"
function getTodayKey() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/* ================= DATABASE PADEN ================= */

const totalRef = ref(database, 'Visitors/total');
const todayKey = getTodayKey();
const todayRef = ref(database, 'Visitors/daily/' + todayKey);

/* ================= UNIEKE DAGBEZOEKER TELLEN ================= */

// Wat was de laatste dag dat deze browser geteld werd?
const lastCountedDate = localStorage.getItem('countedDate');

// Alleen tellen als deze browser vandaag nog niet geteld is
if (lastCountedDate !== todayKey) {

  // totaal verhogen
  runTransaction(totalRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });

  // vandaag verhogen
  runTransaction(todayRef, (currentValue) => {
    return (currentValue || 0) + 1;
  })
  .then(() => {
    console.log("Nieuwe unieke bezoeker vandaag geteld");
    localStorage.setItem('countedDate', todayKey);
  })
  .catch((error) => {
    console.error("Fout bij teller:", error);
  });
}

/* ================= REALTIME WEERGAVE ================= */

// Totaal aantal bezoekers
onValue(totalRef, (snapshot) => {
  const total = snapshot.val() || 0;

  const totalElement = document.getElementById('visitor-total');
  if (totalElement) {
    totalElement.innerText = total;
  }
});

// Bezoekers vandaag
onValue(todayRef, (snapshot) => {
  const today = snapshot.val() || 0;

  const todayElement = document.getElementById('visitor-today');
  if (todayElement) {
    todayElement.innerText = today;
  }
});
