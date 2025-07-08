/**
 * Module for managing subscriber emails in the admin panel.
 * Handles listing, filtering, and deleting subscriptions.
 */
import { getList, remove, URL_DATA } from "./admin.js";

/**
 * Input for filtering subscriptions by email or date.
 * @type {HTMLInputElement}
 */
const emailFilter = document.getElementById("emailFilter");

/**
 * Table element for displaying subscriptions.
 * @type {HTMLElement}
 */
const subscriptionsTable = document.getElementById("subscriptionsTable");

/**
 * Array to store all subscriptions.
 * @type {Array}
 */
let subscriptions = [];

/**
 * Renders the subscriptions table in the DOM.
 * @param {Array} data - Array of subscription objects to render
 */
function renderTable(data) {
  subscriptionsTable.innerHTML = "";

  if (data.length === 0) {
    subscriptionsTable.innerHTML = `<tr><td colspan="3" class="text-center">No hay subscripciones aún</td></tr>`;
    return;
  }

  data.forEach(sub => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sub.email}</td>
      <td>${sub.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${sub.id}">Eliminar</button>
      </td>
    `;

    subscriptionsTable.appendChild(row);
  });

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const sure = confirm("¿Estas seguro de eliminar esta suscripcion?");
      if (sure) {
        await remove(URL_DATA, "subscribers", id);
        await loadSubscriptions();
      }
    });
  });
}

/**
 * Filters subscriptions in real time as the user types in the filter input.
 */
function filterSubscriptions() {
  const query = emailFilter.value.toLowerCase();
  const filtered = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(query) || sub.date.includes(query)
  );
  renderTable(filtered);
}

/**
 * Loads all subscriptions from the API and renders them.
 * @async
 * @function
 */
async function loadSubscriptions() {
  subscriptions = await getList(URL_DATA, "subscribers");
  renderTable(subscriptions);
}

// Listen for input changes to filter subscriptions
emailFilter.addEventListener("input", filterSubscriptions);

// Initial load of all subscriptions
loadSubscriptions();
