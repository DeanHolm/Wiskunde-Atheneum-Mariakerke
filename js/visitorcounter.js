import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

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

/* ====== HELPER: UNIEKE VISITOR ID ====== */
function generateVisitorId() {
  const nav = navigator.userAgent + navigator.language + screen.width + screen.height + screen.colorDepth + new Date().getTimezoneOffset();
  let hash = 0;
  for (let i = 0; i < nav.length; i++) {
    hash = ((hash << 5) - hash) + nav.charCodeAt(i);
    hash |= 0;
  }
  return 'v' + Math.abs(hash);
}

/* ====== DATUM ====== */
const todayKey = new Date().toISOString().split('T')[0];
const visitorId = generateVisitorId();

/* ====== DATABASE REFERENTIES ====== */
const totalRef = ref(database, 'Visitors/total_unique');
const todayRef = ref(database, 'Visitors/daily/' + todayKey);
const todayVisitorRef = ref(database, 'Visitors/daily/' + todayKey + '/' + visitorId);
const totalVisitorRef = ref(database, 'Visitors/unique_ids/' + visitorId);

/* ====== TEL UNIEKE BEZOEKER ====== */
get(todayVisitorRef).then(snapshot => {
  if (!snapshot.exists()) {
    // Markeer deze visitor als geteld vandaag
    set(todayVisitorRef, true);

    // Tel totaal aantal bezoekers vandaag
    runTransaction(todayRef, (current) => (current || 0) + 1);

    // Tel totaal unieke bezoekers ooit (sleutel = visitorId)
    get(totalVisitorRef).then(snap => {
      if (!snap.exists()) {
        set(totalVisitorRef, true);
        runTransaction(totalRef, (current) => (current || 0) + 1);
      }
    });

    console.log("Nieuwe unieke bezoeker vandaag geteld");
  } else {
    console.log("Deze bezoeker is vandaag al geteld");
  }
});

/* ====== REALTIME WEERGAVE ====== */
onValue(totalRef, (snapshot) => {
  const total = snapshot.val() || 0;
  const totalElement = document.getElementById('visitor-total');
  if (totalElement) totalElement.innerText = total;
});

onValue(todayRef, (snapshot) => {
  const today = snapshot.val() || 0;
  const todayElement = document.getElementById('visitor-today');
  if (todayElement) todayElement.innerText = today;
});
