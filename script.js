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
// ==================== STEP 3 → STEP 4 ====================

// Step 3 elements
const participantForm = document.getElementById("participantForm");
const participantsList = document.getElementById("participantsList");
const nextStepBtn = document.getElementById("nextStepBtn");
const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");

// Step 4 elements
const summaryTitle = document.getElementById("summary-title");
const summaryLocation = document.getElementById("summary-location");
const summaryDate = document.getElementById("summary-date");
const summaryQty = document.getElementById("summary-qty");
const summaryTotal = document.getElementById("summary-total");
const summaryImg = document.getElementById("summary-img");
const summaryParticipants = document.getElementById("summary-participants");
const confirmBookingBtn = document.getElementById("confirmBookingBtn");

let participants = [];

// Handle participant form submission
participantForm.addEventListener("submit", e => {
    e.preventDefault();

    // Create participant object
    const participant = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
    };

    // Basic validation
    if (!participant.firstName || !participant.lastName || !participant.email || !participant.phone) {
        alert("⚠️ Please fill in all participant fields.");
        return;
    }

    // Add to list
    participants.push(participant);

    // Display in the participants list
    const div = document.createElement("div");
    div.classList.add("participant-item");
    div.textContent = `${participant.firstName} ${participant.lastName} (${participant.email})`;
    participantsList.appendChild(div);

    // Reset form and enable Next button
    participantForm.reset();
    nextStepBtn.disabled = false;
});

// Go to Step 4 when "Next" is clicked
nextStepBtn.addEventListener("click", () => {
    step3.style.display = "none";
    step4.style.display = "block";

    // Retrieve booking data from localStorage
    const title = localStorage.getItem("eventTitle") || "No event";
    const location = localStorage.getItem("eventLocation") || "Unknown";
    const date = localStorage.getItem("eventDate") || "N/A";
    const qty = parseInt(localStorage.getItem("ticketsQty")) || 1;
    const img = localStorage.getItem("eventImg") || "";
    const total = (qty * 15).toFixed(2);

    // Fill summary section
    summaryTitle.textContent = title;
    summaryLocation.textContent = `📍 ${location}`;
    summaryDate.textContent = `📅 ${date}`;
    summaryQty.textContent = `🎟️ Tickets: ${qty}`;
    summaryTotal.textContent = `💰 Total: $${total}`;
    summaryImg.src = img;

    // Show participants
    summaryParticipants.innerHTML = "";
    participants.forEach((p, i) => {
        const pItem = document.createElement("p");
        pItem.textContent = `${i + 1}. ${p.firstName} ${p.lastName} — ${p.email} (${p.phone})`;
        summaryParticipants.appendChild(pItem);
    });
});

// Confirm booking
confirmBookingBtn.addEventListener("click", () => {
    alert("🎉 Booking confirmed successfully!");

    // Optional: clear saved data
    localStorage.removeItem("participants");
    localStorage.removeItem("lastBooking");
    localStorage.removeItem("ticketsQty");

    // Reset participants array
    participants = [];

    // Return to home or event list
    step4.style.display = "none";
    document.getElementById("events-section").style.display = "block";
});