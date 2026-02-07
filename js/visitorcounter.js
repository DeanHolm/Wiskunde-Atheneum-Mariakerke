import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

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
const visitorsRef = ref(database, 'Visitors/count');

// Check of deze bezoeker al geteld is
if (!localStorage.getItem('counted')) {
  runTransaction(visitorsRef, (currentValue) => (currentValue || 0) + 1)
    .then(() => {
      console.log("Nieuwe bezoeker geteld!");
      localStorage.setItem('counted', 'true'); // markeer als geteld
    })
    .catch((error) => console.error("Fout bij tellen:", error));
}

// Toon realtime teller op de pagina
onValue(visitorsRef, (snapshot) => {
  const count = snapshot.val() || 0;
  document.getElementById('visitor-count').innerText = count;
});
