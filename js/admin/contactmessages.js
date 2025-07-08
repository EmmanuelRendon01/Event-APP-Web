/**
 * Module for managing and displaying contact messages in the admin panel.
 * Fetches messages, renders them, and handles deletion and filtering.
 */
import { getList, remove, URL_DATA } from "./admin.js";

/**
 * Container for displaying contact message cards.
 * @type {HTMLElement}
 */
const container = document.getElementById("contactMessagesContainer");

/**
 * Input for filtering messages by name, email, or message content.
 * @type {HTMLInputElement}
 */
const filterInput = document.getElementById("filterMessages");

/**
 * Stores all contact messages fetched from the API.
 * @type {Array}
 */
let allMessages = [];

/**
 * Loads all contact messages from the API and renders them.
 * @async
 * @function
 */
async function loadMessages() {
  allMessages = await getList(URL_DATA, 'contactMessages');
  renderMessages(allMessages);
}

/**
 * Renders a list of contact messages as cards in the DOM.
 * @param {Array} messages - The messages to render
 */
function renderMessages(messages) {
  container.innerHTML = "";

  if (messages.length === 0) {
    container.innerHTML = "<p class='text-center'>No hay mensajes de contacto</p>";
    return;
  }

  messages.forEach(msg => {
    const card = document.createElement("div");
    card.className = "col-md-6";
    card.innerHTML = `
      <div class="card bg-dark text-white shadow border border-light rounded-4">
        <div class="card-body">
          <h5 class="card-title">${msg.name}</h5>
          <h6 class="card-subtitle mb-2 text-info">${msg.email}</h6>
          <p class="card-text">${msg.message}</p>
          <small class="text-secondary">Enviado el ${msg.date}</small>
          <div class="text-end mt-3">
            <button class="btn btn-outline-danger btn-sm btn-delete-message" data-id="${msg.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".btn-delete-message").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const sure = confirm("¿Estás seguro de eliminar este mensaje?");
      if (sure) {
        await remove(URL_DATA, "contactMessages", id);
        await loadMessages();
      }
    });
  });
}

/**
 * Filters messages in real time as the user types in the filter input.
 */
filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase();

  const filtered = allMessages.filter(msg =>
    msg.name.toLowerCase().includes(query) ||
    msg.email.toLowerCase().includes(query) ||
    msg.message.toLowerCase().includes(query)
  );

  renderMessages(filtered);
});

// Initial load of all messages
loadMessages();
