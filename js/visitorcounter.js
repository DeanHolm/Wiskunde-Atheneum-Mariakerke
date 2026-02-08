import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function generateVisitorId() {
  const nav = navigator.userAgent + navigator.language + screen.width + screen.height + screen.colorDepth + new Date().getTimezoneOffset();
  let hash = 0;
  for (let i = 0; i < nav.length; i++) {
    hash = ((hash << 5) - hash) + nav.charCodeAt(i);
    hash |= 0;
  }
  return 'v' + Math.abs(hash);
}

const todayKey = new Date().toISOString().split('T')[0];
const visitorId = generateVisitorId();

const todayVisitorRef = ref(database, 'Visitors/daily/' + todayKey + '/' + visitorId);
const totalVisitorRef = ref(database, 'Visitors/unique_ids/' + visitorId);

/* ====== Tel unieke bezoekers ====== */
get(todayVisitorRef).then(snapshot => {
  if (!snapshot.exists()) {
    set(todayVisitorRef, true);      // voeg toe aan vandaag
    get(totalVisitorRef).then(snap => {
      if (!snap.exists()) {
        set(totalVisitorRef, true); // voeg toe aan totaal uniek
      }
    });
    console.log("Nieuwe unieke bezoeker vandaag geteld");
  } else {
    console.log("Deze bezoeker is vandaag al geteld");
  }
});

/* ====== Realtime weergave ====== */
const visitorTodayElement = document.getElementById('visitor-today');
const visitorTotalElement = document.getElementById('visitor-total');

onValue(ref(database, 'Visitors/daily/' + todayKey), (snapshot) => {
  const todayData = snapshot.val() || {};
  visitorTodayElement.innerText = Object.keys(todayData).length;
});

onValue(ref(database, 'Visitors/unique_ids'), (snapshot) => {
  const totalData = snapshot.val() || {};
  visitorTotalElement.innerText = Object.keys(totalData).length;
});

