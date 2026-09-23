// AVIATOR LAB
// Educational simulation only.
// This does NOT predict real gambling outcomes.

const multiplierEl = document.getElementById("multiplier");
const statusEl = document.getElementById("status");
const roundNumberEl = document.getElementById("roundNumber");
const progressBar = document.getElementById("progressBar");

const predictionEl = document.getElementById("prediction");
const confidenceEl = document.getElementById("confidence");
const confidenceFill = document.getElementById("confidenceFill");

const historyEl = document.getElementById("history");

const totalRoundsEl = document.getElementById("totalRounds");
const averageEl = document.getElementById("average");
const highestEl = document.getElementById("highest");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");


// -----------------------------
// APP STATE
// -----------------------------

let running = false;
let roundNumber = 1001;
let currentMultiplier = 1.00;

let roundHistory = [];

let timer = null;


// -----------------------------
// SIMULATED CRASH GENERATOR
// -----------------------------
//
// This creates outcomes for OUR educational
// simulator. It is not connected to Aviator,
// Betika, or any real gambling platform.
//

function generateCrashPoint() {

    const random = Math.random();

    let crash;

    if (random < 0.50) {
        crash = 1.00 + Math.random() * 1.00;
    }

    else if (random < 0.75) {
        crash = 2.00 + Math.random() * 1.50;
    }

    else if (random < 0.92) {
        crash = 3.50 + Math.random() * 3.50;
    }

    else if (random < 0.98) {
        crash = 7.00 + Math.random() * 8.00;
    }

    else {
        crash = 15.00 + Math.random() * 35.00;
    }

    return Number(crash.toFixed(2));
}


// -----------------------------
// START ROUND
// -----------------------------

function startRound() {

    if (!running) return;

    currentMultiplier = 1.00;

    const crashPoint = generateCrashPoint();

    roundNumber++;

    roundNumberEl.textContent = roundNumber;

    statusEl.textContent = "ROUND STARTING...";

    progressBar.style.width = "0%";

    let startTime = Date.now();

    timer = setInterval(() => {

        const elapsed = (Date.now() - startTime) / 1000;

        // Smooth multiplier growth
        currentMultiplier = Math.exp(elapsed * 0.18);

        currentMultiplier =
            Number(currentMultiplier.toFixed(2));

        multiplierEl.textContent =
            currentMultiplier.toFixed(2) + "x";

        statusEl.textContent = "FLYING";

        let progress =
            Math.min(
                (currentMultiplier / crashPoint) * 100,
                100
            );

        progressBar.style.width =
            progress + "%";


        // Crash
        if (currentMultiplier >= crashPoint) {

            clearInterval(timer);

            currentMultiplier = crashPoint;

            multiplierEl.textContent =
                crashPoint.toFixed(2) + "x";

            statusEl.textContent = "💥 SIMULATED CRASH";

            progressBar.style.width = "100%";

            saveRound(crashPoint);

            setTimeout(() => {

                if (running) {
                    startRound();
                }

            }, 2500);
        }

    }, 50);
}


// -----------------------------
// SAVE ROUND
// -----------------------------

function saveRound(result) {

    roundHistory.unshift({
        round: roundNumber,
        multiplier: result
    });

    // Keep only the latest 50 rounds
    if (roundHistory.length > 50) {
        roundHistory.pop();
    }

    updateHistory();

    updateStatistics();

    calculateEducationalPrediction();
}


// -----------------------------
// HISTORY DISPLAY
// -----------------------------

function updateHistory() {

    historyEl.innerHTML = "";

    roundHistory.slice(0, 15).forEach(item => {

        const element =
            document.createElement("div");

        element.className = "history-item";

        element.textContent =
            item.multiplier.toFixed(2) + "x";

        historyEl.appendChild(element);

    });
}


// -----------------------------
// STATISTICS
// -----------------------------

function updateStatistics() {

    if (roundHistory.length === 0) {

        totalRoundsEl.textContent = "0";
        averageEl.textContent = "0.00x";
        highestEl.textContent = "0.00x";

        return;
    }

    const values =
        roundHistory.map(x => x.multiplier);

    const total =
        values.reduce((sum, value) => sum + value, 0);

    const average =
        total / values.length;

    const highest =
        Math.max(...values);

    totalRoundsEl.textContent =
        roundHistory.length;

    averageEl.textContent =
        average.toFixed(2) + "x";

    highestEl.textContent =
        highest.toFixed(2) + "x";
}


// -----------------------------
// EDUCATIONAL ANALYSIS
// -----------------------------
//
// Important:
// This is statistical analysis of our
// simulator's previous rounds.
//
// It does NOT know or guarantee the
// next real-world gambling result.
//

function calculateEducationalPrediction() {

    if (roundHistory.length < 5) {

        predictionEl.textContent =
            "Need more simulated rounds";

        confidenceEl.textContent = "0%";

        confidenceFill.style.width = "0%";

        return;
    }


    const recent =
        roundHistory
            .slice(0, 10)
            .map(x => x.multiplier);


    const average =
        recent.reduce(
            (sum, value) => sum + value,
            0
        ) / recent.length;


    const sorted =
        [...recent].sort((a, b) => a - b);


    const median =
        sorted[
            Math.floor(sorted.length / 2)
        ];


    // Educational estimate based on
    // previous simulated values.

    let lower =
        Math.max(
            1.10,
            (average * 0.75)
        );

    let upper =
        Math.max(
            lower + 0.50,
            (median * 1.60)
        );


    lower =
        Number(lower.toFixed(2));

    upper =
        Number(upper.toFixed(2));


    // Keep the confidence deliberately
    // moderate rather than pretending
    // that the algorithm is certain.

    let confidence =
        50 + Math.min(
            25,
            recent.length * 1.5
        );


    confidence =
        Math.round(confidence);


    predictionEl.textContent =
        lower.toFixed(2) +
        "x – " +
        upper.toFixed(2) +
        "x";


    confidenceEl.textContent =
        confidence + "%";

    confidenceFill.style.width =
        confidence + "%";
}


// -----------------------------
// START BUTTON
// -----------------------------

startBtn.addEventListener("click", () => {

    if (!running) {

        running = true;

        startBtn.textContent =
            "⏸ STOP SIMULATION";

        statusEl.textContent =
            "STARTING...";

        startRound();

    }

    else {

        running = false;

        clearInterval(timer);

        startBtn.textContent =
            "▶ START SIMULATION";

        statusEl.textContent =
            "SIMULATION STOPPED";
    }

});


// -----------------------------
// RESET
// -----------------------------

resetBtn.addEventListener("click", () => {

    running = false;

    clearInterval(timer);

    roundNumber = 1001;

    currentMultiplier = 1.00;

    roundHistory = [];

    multiplierEl.textContent =
        "1.00x";

    roundNumberEl.textContent =
        roundNumber;

    statusEl.textContent =
        "WAITING FOR ROUND";

    progressBar.style.width =
        "0%";

    predictionEl.textContent =
        "Calculating...";

    confidenceEl.textContent =
        "0%";

    confidenceFill.style.width =
        "0%";

    startBtn.textContent =
        "▶ START SIMULATION";

    updateHistory();

    updateStatistics();

});


// -----------------------------
// INITIAL STATE
// -----------------------------

updateHistory();

updateStatistics();

calculateEducationalPrediction();
