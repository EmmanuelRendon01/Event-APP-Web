/**
 * Main script for the public events page.
 * Handles loading events, contact form, and subscription form.
 */
import { getList, create } from './admin/admin.js';

/**
 * Base URL for the mock API (JSON Server)
 * @type {string}
 */
const URL = 'http://localhost:3000/';

/**
 * Container for displaying event cards.
 * @type {HTMLElement}
 */
const eventsContainer = document.querySelector('#eventCards');

/**
 * Loads all events from the API and renders them as cards.
 * @async
 * @function
 */
async function loadEvents() {
  const events = await getList(URL, 'events');

  eventsContainer.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("col-md-4");
    card.innerHTML = `
      <div class="card card-event mb-4">
        <img src="./assets/events_imgs/${event.image}" class="card-img-top" alt="${event.title}">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text">${event.date} - ${event.location}</p>
          <p class="card-text">${event.description}</p>
          
        </div>
      </div>
    `;
    eventsContainer.appendChild(card);
  });
}

// Initial load of all events
loadEvents();

/**
 * Contact form element for sending messages.
 * @type {HTMLFormElement|null}
 */
const contactForm = document.querySelector('section form');

/**
 * Handle contact form submission
 * @async
 * @function
 * @param {Event} e - The submit event
 */
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());
  data.date = new Date().toISOString().split('T')[0];

  await create(`${URL}contactMessages`, data);
  alert("Mensaje enviado con éxito.");
  contactForm.reset();
});

/**
 * Subscription form element for email subscriptions.
 * @type {HTMLFormElement|null}
 */
const subscribeForm = document.getElementById('subscribeForm');

/**
 * Handle subscription form submission
 * @async
 * @function
 * @param {Event} e - The submit event
 */
subscribeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = subscribeForm.querySelector('input[type="email"]').value;

  await create(`${URL}subscribers`, { email, date: new Date().toISOString().split('T')[0] });
  alert("Suscripción exitosa.");
  subscribeForm.reset();
});