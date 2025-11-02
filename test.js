// --- Step navigation logic ---
const steps = document.querySelectorAll("section");

function showStep(id) {
    steps.forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    localStorage.setItem("currentStep", id);
}

// Restore last step if reloaded
const savedStep = localStorage.getItem("currentStep");
if (savedStep) showStep(savedStep);

// --- Step 1: select event ---
document.querySelectorAll(".book-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".event-card");
        const eventData = {
            name: card.dataset.event,
            bg: card.dataset.bg,
        };
        localStorage.setItem("selectedEvent", JSON.stringify(eventData));
        showStep("step2");
    });
});

// --- Step 2: choose tickets ---
const qtyInput = document.getElementById("qty");
const buyTicky = document.getElementById("buyTicky");

buyTicky.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    if (qty <= 0 || qty > 10) {
        alert("Please choose between 1 and 10 tickets.");
        return;
    }
    localStorage.setItem("ticketsQty", qty);
    showStep("step3");
});

// --- Back buttons ---
document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => showStep(btn.dataset.back));
});

// --- Step 3: add participants ---
let participants = JSON.parse(localStorage.getItem("participants")) || [];
const form = document.getElementById("participantForm");
const list = document.getElementById("participantsList");
const nextBtn = document.getElementById("nextStepBtn");
const totalTickets = parseInt(localStorage.getItem("ticketsQty")) || 0;

// Render existing participants
updateList();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const participant = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
    };

    if (!participant.firstName || !participant.lastName || !participant.email || !participant.phone) {
        alert("Please fill all fields.");
        return;
    }

    participants.push(participant);
    localStorage.setItem("participants", JSON.stringify(participants));

    form.reset();
    updateList();
});

function updateList() {
    list.innerHTML = participants
        .map(
            (p, i) => `
    <div class="participant-card">
      <div>
        <strong>${p.firstName} ${p.lastName}</strong><br/>
        <small>${p.email}</small>
      </div>
      <button onclick="removeParticipant(${i})">✖</button>
    </div>`
        )
        .join("");

    nextBtn.disabled = participants.length < totalTickets;
}

window.removeParticipant = function(index) {
    participants.splice(index, 1);
    localStorage.setItem("participants", JSON.stringify(participants));
    updateList();
};