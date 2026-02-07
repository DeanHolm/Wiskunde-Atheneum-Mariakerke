"use strict";

let data, display, placeholder, placeholder2, goals, videos, exercises, corrections;

window.addEventListener('load', initialize);

async function initialize() {
    await fetchData();
    activateChapterClicks();
}

async function fetchData() {
        const response = await fetch('../data/data.json');
        data = await response.json();
}

function activateChapterClicks() {
    const images = document.querySelectorAll('#hoofdstukken img');

    images.forEach(image => {

        image.addEventListener('mouseover', function() {
            images.forEach(img => {
                if (img !== image) {
                    img.classList.add('dimmed');
                }
            });
        });

        image.addEventListener('mouseout', function() {
            images.forEach(img => {
                img.classList.remove('dimmed');
            });
        });

        image.addEventListener('click', showInfo);
    });
}

function showInfo() {
    display = document.querySelector("main");
    placeholder = document.getElementById("pijlentitel");
    const chapter = this.getAttribute('alt');
    
    emptyDisplay();
    showTitle(chapter);
    addArrow();
    addExtras();
    fillGoals(chapter);
    fillVideos(chapter);
    fillExercises(chapter);
    fillCorrections(chapter);
    scrollToTop();
}

function emptyDisplay() {
    let overzichten = document.getElementsByClassName('overview');
    for (let i = 0; i < overzichten.length; i++) {
        overzichten[i].classList.add('hidden');
    }
}

function addArrow() {
    let arrow = document.createElement("img");
    arrow.setAttribute("id", "pijl");
    arrow.setAttribute("src", "../images/Terug.png");
    arrow.setAttribute("alt", "pijl terugkeren");
    placeholder.appendChild(arrow);
    arrow.addEventListener('click',showChapters);
}

function showTitle(chapter) {
    const title = document.createElement('article');
    title.setAttribute("id","titel");
    title.textContent = chapter;
    placeholder.appendChild(title);
    display.appendChild(placeholder);
}

function addExtras() { 
    goals = document.createElement('article');
    goals.setAttribute("id", "goals");
    videos = document.createElement('article');
    videos.setAttribute("id", "videos");
    exercises = document.createElement('article');
    exercises.setAttribute("id", "exercises");
    corrections = document.createElement('article');
    corrections.setAttribute("id", "corrections");

    placeholder2 = document.createElement('div');
    placeholder2.appendChild(corrections);
    placeholder2.appendChild(goals);
    placeholder2.appendChild(exercises);
    placeholder2.appendChild(videos);
    display.appendChild(placeholder2);
}

function showChapters() {
    placeholder.innerHTML = "";
    placeholder2.innerHTML = "";
    
    let overzichten = document.getElementsByClassName('overview');
    for (let i = 0; i < overzichten.length; i++) {
        overzichten[i].classList.remove('hidden');
    }
}

function fillGoals(chapter) {
    const year = document.querySelector(".overview");
    const doelstellingen = data[year.id][chapter]["Doelstellingen"];
    const goalsContainer = document.getElementById("goals");

    goalsContainer.innerHTML = '';

    let title = document.createElement("h1");
    title.textContent = "Doelstellingen 🎯";
    goalsContainer.appendChild(title);

    for (const [title, goals] of Object.entries(doelstellingen)) {
        const titleElement = document.createElement("h2");
        titleElement.textContent = title;
        goalsContainer.appendChild(titleElement);

        const goalsContainerElement = document.createElement("div");

        goals.forEach(goal => {
            const goalContainer = document.createElement("div");
            goalContainer.id = "goal"
            const checkbox = document.createElement("input");
            checkbox.name = "doel";
            checkbox.type = "checkbox";
            checkbox.className = "goal-checkbox";
            
            const label = document.createElement("label");
            label.setAttribute("for", goal);
            label.textContent = goal;

            goalContainer.appendChild(checkbox);
            goalContainer.appendChild(label);

            goalsContainerElement.appendChild(goalContainer);
        });

        goalsContainer.appendChild(goalsContainerElement);
    }
}

function fillVideos(chapter) {
    const year = document.querySelector(".overview");
    const videoLinks = data[year.id][chapter]["Filmpjes"];
    const videosContainer = document.getElementById("videos");

    videosContainer.innerHTML = '';

    let title = document.createElement("h1");
    title.textContent = "Filmpjes 🎬";
    videosContainer.appendChild(title);

    if (Object.keys(videoLinks).length > 0) {

        for (const [key, src] of Object.entries(videoLinks)) {
            const videoContainer = document.createElement("div");

            const titleElement = document.createElement("h2");
            titleElement.textContent = key;
            videoContainer.appendChild(titleElement);

            const image = document.createElement('img');
            image.src = "../images/filmpje.placeholder.png";
            image.alt = "Klik om de video te starten";
            image.style.cursor = "pointer";
            image.width = 640;
            image.height = 360;

            image.addEventListener('click', function() {
                const video = document.createElement('video');
                video.width = 640;
                video.height = 360;
                video.controls = true;
                video.autoplay = true;

                const sourceMP4 = document.createElement('source');
                sourceMP4.src = src;
                sourceMP4.type = 'video/mp4';

                video.appendChild(sourceMP4);

                const fallbackText = document.createTextNode('Je browser ondersteunt geen HTML5 video.');
                video.appendChild(fallbackText);
                videoContainer.replaceChild(video, image);
            });

            videoContainer.appendChild(image);
            videosContainer.appendChild(videoContainer);
        }
    } else {
        let messageContainer = document.createElement("div");
        let blankLine = document.createElement("br");
        messageContainer.appendChild(blankLine);
        let message = document.createElement("div");
        message.textContent = "Er zijn (nog) geen extra uitlegfilmpjes van dit hoofdstuk beschikbaar.";
        messageContainer.appendChild(message);
        videosContainer.appendChild(messageContainer);
    }
}




function fillExercises(chapter) {
    const year = document.querySelector(".overview");
    const exercisesLinks = data[year.id][chapter]["Oefeningen"];
    const exercisesContainer = document.getElementById("exercises");

    exercisesContainer.innerHTML = '';
    let title = document.createElement("h1");
    title.textContent = "Extra oefeningen 📝";
    exercisesContainer.appendChild(title);

    if (Object.keys(exercisesLinks).length > 0) {

        for (const [exercise, urls] of Object.entries(exercisesLinks)) {
            urls.forEach(url => {
                const listItem = document.createElement('div');

                const linkElement = document.createElement('a');
                linkElement.href = url;
                linkElement.textContent = exercise;
                linkElement.target = '_blank';

                const titleElement = document.createElement('p');
                titleElement.appendChild(linkElement);

                listItem.appendChild(titleElement);
                exercisesContainer.appendChild(listItem);
            });
        }
    } else {
        let messageContainer = document.createElement("div");
        let message = document.createElement("div");
        message.textContent = "Er zijn (nog) geen extra oefeningen van dit hoofdstuk beschikbaar.";
        messageContainer.appendChild(message);
        exercisesContainer.appendChild(messageContainer);
    }
}


function fillCorrections(chapter) {
    const year = document.querySelector(".overview");
    const corrections = data[year.id][chapter]["Correctiesleutels"];
    const correctionsContainer = document.getElementById("corrections");

    correctionsContainer.innerHTML = '';
    let title = document.createElement("h1");
    title.textContent = "Correctiesleutels ✅";
    correctionsContainer.appendChild(title);

    let artCorrections = document.getElementById("corrections");
    let divUitleg = document.createElement("div");
    let parUitleg = document.createElement("p");
    parUitleg.innerHTML = "🔴 = De leraar heeft de correctiesleutel nog niet openbaar gezet. <br> 🟢 = Open de correctiesleutel door erop te klikken. <br><br>";
    divUitleg.appendChild(parUitleg);
    artCorrections.appendChild(divUitleg);

    // Loop through corrections and create content
    for (const [key, [icon, src]] of Object.entries(corrections)) {
        const correctionContainer = document.createElement("div");

        // Create a paragraph for the title and icon
        const titleElement = document.createElement("p");

        // Create and add the icon element
        const iconElement = document.createElement("span");
        iconElement.textContent = icon;
        titleElement.appendChild(iconElement);

        // Create and add the title element (link or text)
        if (icon === '🔴') {
            // If the icon is 🔴, it means the link should not be clickable
            const textElement = document.createElement("span");
            textElement.textContent = " " + key;
            titleElement.appendChild(textElement);
        } else {
            // Otherwise, make the title a clickable link
            const linkElement = document.createElement('a');
            linkElement.href = src;
            linkElement.textContent = " " + key;
            linkElement.target = '_blank';

            titleElement.appendChild(linkElement);
        }

        // Append the titleElement to the correctionContainer
        correctionContainer.appendChild(titleElement);

        // Append the correctionContainer to the correctionsContainer
        correctionsContainer.appendChild(correctionContainer);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
    });
}


  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
  import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBcMCPdZAnM7kjmWn_uNuKqxm4_wNLDUes",
    authDomain: "schoolwebsite-teller.firebaseapp.com",
    databaseURL: "https://schoolwebsite-teller-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "schoolwebsite-teller",
    storageBucket: "schoolwebsite-teller.firebasestorage.app",
    messagingSenderId: "526962109108",
    appId: "1:526962109108:web:63cabd95ec954de031c5e1",
    measurementId: "G-NW27LLN6GJ"
  };

  // Initialiseer Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const visitorsRef = ref(database, 'Visitors/count');

  // Verhoog bezoekersaantal veilig
  runTransaction(visitorsRef, (currentValue) => (currentValue || 0) + 1);

  // Toon realtime op de pagina
  onValue(visitorsRef, (snapshot) => {
    const count = snapshot.val() || 0;
    document.getElementById('visitor-count').innerText = count;
  });