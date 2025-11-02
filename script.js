const container = document.getElementById("eventsContainer");
const leftBtn = document.querySelector(".scroll-btn.left");
const rightBtn = document.querySelector(".scroll-btn.right");
const cards = document.querySelectorAll(".event-card");
let selectedEvents = JSON.parse(localStorage.getItem("selectedEvents")) || [];

// Scroll buttons
leftBtn.addEventListener("click", () => {
    container.scrollBy({ left: -250, behavior: "smooth" });
});
rightBtn.addEventListener("click", () => {
    container.scrollBy({ left: 250, behavior: "smooth" });
});

// Click to select card
cards.forEach(card => {
    const title = card.querySelector("h3").innerText;
    if (selectedEvents.some(e => e.title === title)) {
        card.classList.add("selected");
    }

    card.addEventListener("click", () => {
        const image = card.querySelector(".img img").src;
        const date = card.querySelector(".date").innerText;
        const place = card.querySelector(".place").innerText;
        const people = parseInt(card.querySelector(".people").innerText);

        const eventData = { title, image, date, place, people };

        if (card.classList.contains("selected")) {
            card.classList.remove("selected");
            selectedEvents = selectedEvents.filter(e => e.title !== title);
        } else {
            card.classList.add("selected");
            selectedEvents.push(eventData);
        }

        localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));
    });
});

// ------------------- SECTION 2 ---------------------
const bookBtns = document.querySelectorAll(".book");
const eventsSection = document.getElementById("events-section");
const bookingSection = document.getElementById("booking-section");
const backBtn = document.getElementById("backBtn");

const titleEl = document.getElementById("event-title");
const locationEl = document.getElementById("event-location");
const dateEl = document.getElementById("event-date");
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const countEl = document.getElementById("count");
const priceEl = document.querySelector(".price");
const buyBtn = document.querySelector(".buy-btn");

let count = 1;
let pricePerTicket = 15;
let totalPrice = pricePerTicket;
let selectedCard = null;

// BOOK NOW
bookBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        e.stopPropagation();

        selectedCard = e.target.closest(".event-card");

        const title = selectedCard.querySelector("h3").innerText;
        const location = selectedCard.querySelector(".place").innerText;
        const date = selectedCard.querySelector(".date").innerText;
        const img = selectedCard.querySelector(".img img").src;
        const seats = parseInt(selectedCard.querySelector(".people").innerText);

        // SAVE AT localStorage
        localStorage.setItem("eventTitle", title);
        localStorage.setItem("eventLocation", location);
        localStorage.setItem("eventDate", date);
        localStorage.setItem("eventImg", img);
        localStorage.setItem("eventSeats", seats);

        eventsSection.style.display = "none";
        bookingSection.style.display = "block";

        count = 1;
        totalPrice = pricePerTicket;
        updateBookingPage();
    });
});


function updateBookingPage() {
    titleEl.textContent = localStorage.getItem("eventTitle");
    locationEl.textContent = localStorage.getItem("eventLocation");
    dateEl.textContent = localStorage.getItem("eventDate");

    bookingSection.style.backgroundImage = `url(${localStorage.getItem("eventImg")})`;
    countEl.textContent = count;
    priceEl.textContent = totalPrice + "$";
}


plusBtn.addEventListener("click", () => {
    count++;
    totalPrice = count * pricePerTicket;
    countEl.textContent = count;
    priceEl.textContent = totalPrice + "$";
});

minusBtn.addEventListener("click", () => {
    if (count > 1) {
        count--;
        totalPrice = count * pricePerTicket;
        countEl.textContent = count;
        priceEl.textContent = totalPrice + "$";
    }
});

// BACK
backBtn.addEventListener("click", () => {
    bookingSection.style.display = "none";
    eventsSection.style.display = "block";
});




// --- BUY TICKY BUTTON ---

buyBtn.addEventListener("click", () => {
    const availableSeats = parseInt(localStorage.getItem("eventSeats"));
    const newSeats = availableSeats - count;

    if (newSeats < 0) {
        // If not enough seats, show a small inline message instead of alert
        const warning = document.createElement("p");
        warning.textContent = "❌ Not enough seats available!";
        warning.style.color = "red";
        warning.style.marginTop = "10px";
        bookingSection.appendChild(warning);
        setTimeout(() => warning.remove(), 2000);
        return;
    }

    // Update seats number in original card
    selectedCard.querySelector(".people").innerHTML = `<i>👥</i> ${newSeats}`;
    localStorage.setItem("eventSeats", newSeats);

    // Save booking data to localStorage
    const bookingData = {
        title: localStorage.getItem("eventTitle"),
        location: localStorage.getItem("eventLocation"),
        date: localStorage.getItem("eventDate"),
        qty: count,
        total: totalPrice,
        remainingSeats: newSeats,
    };

    localStorage.setItem("lastBooking", JSON.stringify(bookingData));
    localStorage.setItem("ticketsQty", count);

    // --- Move to Step 3 (Add Participants section) ---
    bookingSection.style.display = "none"; // Hide Step 2
    document.getElementById("step3").style.display = "block"; // Show Step 3
    document.getElementById("step3").classList.add("active");
});
// --- STEP 3: ADD PARTICIPANTS ---
let participants = JSON.parse(localStorage.getItem("participants")) || [];
const form = document.getElementById("participantForm");
const list = document.getElementById("participantsList");
const nextBtn = document.getElementById("nextStepBtn");
const totalTickets = parseInt(localStorage.getItem("ticketsQty")) || 0;

// Restore existing participants
updateList();

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const participant = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
    };

    // Validation
    if (!participant.firstName || !participant.lastName || !participant.email || !participant.phone) {
        alert("Please fill all fields.");
        return;
    }

    participants.push(participant);
    localStorage.setItem("participants", JSON.stringify(participants));

    form.reset();
    updateList();
});

// Update participants list
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

// Remove participant
window.removeParticipant = function(index) {
    participants.splice(index, 1);
    localStorage.setItem("participants", JSON.stringify(participants));
    updateList();
};