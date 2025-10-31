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

    // LocalStorage
    if (selectedEvents.some(e => e.title === title)) {
        card.classList.add("selected");
    }

    card.addEventListener("click", () => {
        const image = card.querySelector("img").src;
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
        console.log("THE EVENT SHOICC", selectedEvents);
    });
});