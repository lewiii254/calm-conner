// ---------------------- Navigation ----------------------
function showSection(sectionId, button) {
    document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

// ---------------------- Breathing Exercise ----------------------
let breathingInterval;

function startBreathing() {
    const circle = document.getElementById("circle");
    const breathText = document.getElementById("breath-text");
    let phase = 0;

    clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
        if (phase === 0) {
            breathText.textContent = "Inhale... 🌬️";
            circle.style.transform = "scale(1.5)";
            phase = 1;
        } else if (phase === 1) {
            breathText.textContent = "Hold... ✋";
            phase = 2;
        } else {
            breathText.textContent = "Exhale... 😌";
            circle.style.transform = "scale(1)";
            phase = 0;
        }
    }, 4000);
}

function stopBreathing() {
    clearInterval(breathingInterval);
    document.getElementById("breath-text").textContent = "Press Start";
    document.getElementById("circle").style.transform = "scale(1)";
}

// ---------------------- Quotes ----------------------
const quotes = [
    "Peace comes from within. Do not seek it without. – Buddha",
    "You cannot control the waves, but you can learn to surf. – Jon Kabat-Zinn",
    "Every breath we take, every step we make, can be filled with peace and joy. – Thich Nhat Hanh",
    "Calm mind brings inner strength. – Dalai Lama",
    "Happiness is not something ready made. It comes from your own actions. – Dalai Lama"
];

function getQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote").textContent = quotes[randomIndex];
}
window.onload = getQuote;

// ---------------------- Journal ----------------------
function saveJournal() {
    const entry = document.getElementById("journal-entry").value;
    if (!entry.trim()) return alert("Please write something first.");

    let journal = JSON.parse(localStorage.getItem("journal")) || [];
    journal.push({ text: entry, date: new Date().toLocaleString() });
    localStorage.setItem("journal", JSON.stringify(journal));

    document.getElementById("journal-entry").value = "";
    displayJournal();
}

function displayJournal() {
    const journalList = document.getElementById("journal-list");
    journalList.innerHTML = "";

    let journal = JSON.parse(localStorage.getItem("journal")) || [];
    if (journal.length === 0) {
        journalList.innerHTML = "<p>No entries yet. Start writing 🌸</p>";
        return;
    }

    journal.forEach((entry, index) => {
        const entryDiv = document.createElement("div");
        entryDiv.classList.add("journal-entry");
        entryDiv.innerHTML = `
            <p><strong>${entry.date}</strong></p>
            <p>${entry.text}</p>
            <button onclick="editJournal(${index})">✏️ Edit</button>
            <button onclick="deleteJournal(${index})">❌ Delete</button>
            <hr>
        `;
        journalList.prepend(entryDiv);
    });
}

function deleteJournal(index) {
    let journal = JSON.parse(localStorage.getItem("journal")) || [];
    journal.splice(index, 1);
    localStorage.setItem("journal", JSON.stringify(journal));
    displayJournal();
}

function editJournal(index) {
    let journal = JSON.parse(localStorage.getItem("journal")) || [];
    document.getElementById("journal-entry").value = journal[index].text;
    journal.splice(index, 1);
    localStorage.setItem("journal", JSON.stringify(journal));
    displayJournal();
}

function clearJournal() {
    if (confirm("Clear all journal entries?")) {
        localStorage.removeItem("journal");
        displayJournal();
    }
}

function toggleJournalList() {
    document.getElementById("journal-list").classList.toggle("hidden");
}

// ---------------------- Journal Motivation Quotes ----------------------
const journalQuotes = [
    "✨ Your journal is your sanctuary. Write freely and honestly. 🌸",
    "Your thoughts matter. Write them here and let them bloom into clarity.",
    "This is your safe space — pour your heart out.",
    "A journal is a whisper from your soul. What is yours saying today?",
    "Each entry is a step toward peace. Begin with just one sentence.",
    "The page is listening — no judgment, only kindness.",
    "Capture the little sparks of today before they fade away.",
    "Your journal is a mirror for your heart. Let it reflect your truth."
];

function rotateJournalQuote() {
    const quoteElement = document.getElementById("journal-motivation");
    let index = 0;
    function showNextQuote() {
        quoteElement.style.opacity = 0;
        setTimeout(() => {
            quoteElement.textContent = journalQuotes[index];
            quoteElement.style.opacity = 1;
            index = (index + 1) % journalQuotes.length;
        }, 500);
    }
    showNextQuote();
    setInterval(showNextQuote, 6000);
}

// ---------------------- Mood Tracker ----------------------
let moodPieChart, moodLineChart;

function setMood(mood) {
    let emoji = mood === "Happy" ? "😊" : mood === "Calm" ? "😌" : "😢";
    let color = mood === "Happy" ? "#FFD93D" : mood === "Calm" ? "#6BCB77" : "#4D96FF";
    let suggestion = mood === "Happy" ? "Keep spreading the positivity! 🌞" :
                     mood === "Calm" ? "Stay present and enjoy the moment. 🌿" :
                     "It's okay to feel sad. This too shall pass. 💙";

    document.getElementById("mood-log").innerHTML = `<span style="font-size:1.5em">${emoji}</span> You are feeling: <strong style="color:${color}">${mood}</strong>`;
    document.getElementById("mood-quote").textContent = suggestion;

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    moods.push({ mood, emoji, color, date: new Date().toLocaleString() });
    localStorage.setItem("moods", JSON.stringify(moods));

    loadMoodHistory();
    updateMoodInsights();
    updateMoodCharts();
}

function loadMoodHistory() {
    const historyList = document.getElementById("mood-history");
    historyList.innerHTML = "";

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    if (moods.length === 0) {
        historyList.innerHTML = "<li>No moods tracked yet 🌸</li>";
        return;
    }

    moods.slice().reverse().forEach(entry => {
        const li = document.createElement("li");
        li.innerHTML = `<span style="font-size:1.2em">${entry.emoji}</span> 
            <span style="color:${entry.color}"><strong>${entry.mood}</strong></span> 
            <small>(${entry.date})</small>`;
        historyList.appendChild(li);
    });
}

function updateMoodInsights() {
    const insightsBox = document.getElementById("mood-insights");
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    if (moods.length === 0) {
        insightsBox.textContent = "No mood insights yet 🌸";
        return;
    }
    let counts = { Happy: 0, Calm: 0, Sad: 0 };
    moods.forEach(m => counts[m.mood]++);
    let topMood = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    let emoji = topMood === "Happy" ? "😊" : topMood === "Calm" ? "😌" : "😢";
    insightsBox.textContent = `Most frequent mood: ${emoji} ${topMood} (${counts[topMood]} times)`;
}

function clearMoods() {
    if (confirm("Clear all mood history?")) {
        localStorage.removeItem("moods");
        loadMoodHistory();
        updateMoodInsights();
        updateMoodCharts();
    }
}

// Charts
function updateMoodCharts() {
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    if (moods.length === 0) {
        if (moodPieChart) moodPieChart.destroy();
        if (moodLineChart) moodLineChart.destroy();
        return;
    }

    let counts = { Happy: 0, Calm: 0, Sad: 0 };
    moods.forEach(m => counts[m.mood]++);

    // Pie Chart
    if (moodPieChart) moodPieChart.destroy();
    const pieCtx = document.getElementById("moodPieChart").getContext("2d");
    moodPieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: ["Happy 😊", "Calm 😌", "Sad 😢"],
            datasets: [{ data: [counts.Happy, counts.Calm, counts.Sad], backgroundColor: ["#FFD93D", "#6BCB77", "#4D96FF"] }]
        }
    });

    // Line Chart
    if (moodLineChart) moodLineChart.destroy();
    const lineCtx = document.getElementById("moodLineChart").getContext("2d");
    moodLineChart = new Chart(lineCtx, {
        type: "line",
        data: {
            labels: moods.map(m => m.date),
            datasets: [{
                label: "Mood Over Time",
                data: moods.map(m => m.mood === "Happy" ? 3 : m.mood === "Calm" ? 2 : 1),
                borderColor: "#4D96FF",
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0, max: 4, stepSize: 1,
                    ticks: {
                        callback: v => v === 1 ? "😢 Sad" : v === 2 ? "😌 Calm" : v === 3 ? "😊 Happy" : ""
                    }
                }
            }
        }
    });
}

// ---------------------- Contact Form ----------------------
document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon. 💌");
    e.target.reset();
});

// ---------------------- Chatbot ----------------------
function sendMessage() {
    const input = document.getElementById("chat-input");
    const chatWindow = document.getElementById("chat-window");
    const userMessage = input.value.trim();
    if (!userMessage) return;

    chatWindow.innerHTML += `<div>You: ${userMessage}</div>`;

    let response = "I'm here to listen 🌿";
    if (userMessage.toLowerCase().includes("hello")) response = "Hello! How are you feeling today?";
    else if (userMessage.toLowerCase().includes("sad")) response = "I'm sorry you're feeling sad 💙";
    else if (userMessage.toLowerCase().includes("happy")) response = "That's wonderful! 🌸";
    else if (userMessage.toLowerCase().includes("calm")) response = "Calmness is a gift 🌿";

    chatWindow.innerHTML += `<div style="color:green">Bot: ${response}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    input.value = "";
}

// ---------------------- On Page Load ----------------------
window.addEventListener("DOMContentLoaded", () => {
    rotateJournalQuote();
    displayJournal();
    loadMoodHistory();
    updateMoodInsights();
    updateMoodCharts();
});
WINDOW