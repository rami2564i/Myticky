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
        const people = card.querySelector(".people").innerText;

        const eventData = { title, image, date, place, people };

        if (card.classList.contains("selected")) {
            card.classList.remove("selected");
            selectedEvents = selectedEvents.filter(e => e.title !== title);
        } else {
            card.classList.add("selected");
            selectedEvents.push(eventData);
        }

        localStorage.setItem("selectedEvents", JSON.stringify(selectedEvents));
        console.log("THE EVENT SELECTED", selectedEvents);
    });
});

// Page elements
const bookBtns = document.querySelectorAll(".book");
const eventsSection = document.getElementById("events-section");
const bookingSection = document.getElementById("booking-section");
const backBtn = document.getElementById("backBtn");

// Elements for displaying booking data
const titleEl = document.getElementById("event-title");
const locationEl = document.getElementById("event-location");
const dateEl = document.getElementById("event-date");

// Count controls
const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const countEl = document.getElementById("count");
let count = 1;

// On "BOOK NOW" click
bookBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        e.stopPropagation();

        const card = e.target.closest(".event-card");

        // Reading data from inner elements
        const title = card.querySelector("h3").innerText;
        const location = card.querySelector(".place").innerText;
        const date = card.querySelector(".date").innerText;
        const img = card.querySelector(".img img").src;

        // Save data to localStorage  
        localStorage.setItem("eventTitle", title);
        localStorage.setItem("eventLocation", location);
        localStorage.setItem("eventDate", date);
        localStorage.setItem("eventImg", img);

        // Display second page  
        eventsSection.style.display = "none";
        bookingSection.style.display = "block";

        // Update the second page  
        updateBookingPage();
    });
});

// Update ticket page data
function updateBookingPage() {
    const title = localStorage.getItem("eventTitle");
    const location = localStorage.getItem("eventLocation");
    const date = localStorage.getItem("eventDate");
    const img = localStorage.getItem("eventImg");

    titleEl.textContent = title;
    locationEl.textContent = location;
    dateEl.textContent = date;

    bookingSection.style.backgroundImage = `url(${img})`;
}

// Back to the first page
backBtn.addEventListener("click", () => {
    bookingSection.style.display = "none";
    eventsSection.style.display = "block";
});

// Increment/decrement count
plusBtn.addEventListener("click", () => {
    count++;
    countEl.textContent = count;
});

minusBtn.addEventListener("click", () => {
    if (count > 1) count--;
    countEl.textContent = count;
})