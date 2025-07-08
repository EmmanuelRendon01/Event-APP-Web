window.addEventListener("beforeunload", () => {
  console.warn("🚨 Se está recargando la página");
});

import { getList, create } from './admin/admin.js';

const URL = 'http://localhost:3000/';
const eventsContainer = document.querySelector('#eventCards');

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

loadEvents();

// CONTACT FORM
const contactForm = document.querySelector('section form');

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);

  // Campos requeridos con nombres en español
  const requiredFields = {
    name: "Nombre",
    email: "Correo electrónico",
    message: "Mensaje"
  };

  // Validación y limpieza
  for (const [key, label] of Object.entries(requiredFields)) {
    const value = formData.get(key);

    if (!value || value.trim() === '') {
      alert(`El campo ${label} es obligatorio.`);
      return;
    }

    // Validación de formato de correo (solo para el campo 'email')
    if (key === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
      }
    }

    // Limpiar espacios
    formData.set(key, value.trim());
  }

  // Preparar datos
  const data = Object.fromEntries(formData.entries());
  data.date = new Date().toISOString().split('T')[0];

  // Enviar mensaje
  await create(`${URL}contactMessages`, data);
  alert("Mensaje enviado con éxito.");
  contactForm.reset();
});

// SUBSCRIPTION FORM
const subscribeForm = document.getElementById('subscribeForm');

subscribeForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const emailInput = subscribeForm.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  // Validación de campo vacío
  if (!email) {
    alert("El campo correo es obligatorio.");
    return;
  }

  // Validación de formato simple de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor ingresa un correo válido.");
    return;
  }

  // Verificar si el correo ya está suscrito
  const subscribers = await getList(URL, 'subscribers');
  const emailExists = subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());

  if (emailExists) {
    alert("Este correo ya está suscrito.");
    return;
  }

  await create(`${URL}subscribers`, { email, date: new Date().toISOString().split('T')[0] });
  alert("Suscripción exitosa.");
  subscribeForm.reset();
});
