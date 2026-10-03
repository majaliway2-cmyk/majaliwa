const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const inquiryForm = document.querySelector("#event-form");
const formResponse = document.querySelector("#form-response");
const preferredDate = inquiryForm.querySelector('[name="date"]');
const today = new Date();
preferredDate.min = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        primaryNav.classList.remove("is-open");
    }
});

inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formResponse.textContent = "Thank you for trying the demo. This sample form does not send or store your information.";
    inquiryForm.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();
