/**
 * Module for managing events in the admin panel.
 * Handles event creation, update, deletion, filtering, and rendering.
 */
import { getList, URL_DATA, create, update, remove } from "./admin.js";

/**
 * Table element for displaying events.
 * @type {HTMLElement}
 */
const eventsTable = document.getElementById("tableEvents");

/**
 * Input for filtering events by name, location, or date.
 * @type {HTMLInputElement}
 */
const filterInput = document.getElementById("eventsFilter");

/**
 * Form for updating an event.
 * @type {HTMLFormElement}
 */
const formUpdateEvent = document.getElementById('formUpdateEvent');

/**
 * Form for creating a new event.
 * @type {HTMLFormElement}
 */
const formCreateEvent = document.getElementById('formCreateEvent');

/**
 * Array to store all events.
 * @type {Array}
 */
let events = [];

/**
 * Stores the ID of the event currently selected for update.
 * @type {string|null}
 */
let selectedEventId = null;

/**
 * Renders the events table in the DOM.
 * @param {Array} data - Array of event objects to render
 */


const eventDateUpdate = document.getElementById("eventDateUpdate");
const inputFecha = document.getElementById("fechaEvento");
const today = new Date().toISOString().split("T")[0];
inputFecha.min = today;
eventDateUpdate.min = today;

function renderEventsTable(data) {
  eventsTable.innerHTML = "";

  if (data.length === 0) {
    eventsTable.innerHTML = `<tr><td colspan="5" class="text-center">No se encontraron eventos</td></tr>`;
    return;
  }

  data.forEach(event => {
    const row = document.createElement("tr");

    const statusBadge = {
      activo: "bg-success",
      cancelado: "bg-danger",
      inactivo: "bg-secondary"
    };

    row.innerHTML = `
      <td>${event.title}</td>
      <td>${event.date}</td>
      <td>${event.location}</td>
      <td><span class="badge ${statusBadge[event.status] || 'bg-light'}">${event.status}</span></td>
      <td>
        <button type="button" class="btn btn-sm btn-outline-warning me-1 update-event-btn" 
          data-bs-toggle="modal" data-bs-target="#modalUpdateEvent" data-id="${event.id}">
          Editar
        </button>
        <button type="button" class="btn btn-sm btn-outline-danger delete-event-btn" data-id="${event.id}">
          Eliminar
        </button>
      </td>
      `;

    eventsTable.appendChild(row);
  });

  eventsTable.querySelectorAll(".update-event-btn").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      selectedEventId = button.getAttribute("data-id");
      const selectedEvent = events.find(e => e.id == selectedEventId);
      if (selectedEvent) {
        fillUpdateModal(selectedEvent);
      }
    });
  });

  eventsTable.querySelectorAll(".delete-event-btn").forEach(button => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const id = button.getAttribute("data-id");
      const sure = confirm("¿Estás seguro de eliminar este evento?");
      if (sure) {
        try {
          await remove(URL_DATA, "events", id);
          await loadEvents();
          alert("Evento eliminado correctamente.");
        } catch (error) {
          alert("Error al eliminar el evento.");
        }
      }
    });
  });
}

/**
 * Fills the update modal with the selected event's data.
 * @param {Object} event - The event object to edit
 */
function fillUpdateModal(event) {
  document.getElementById("eventTitleUpdate").value = event.title;
  document.getElementById("eventDateUpdate").value = event.date;
  document.getElementById("eventCity").value = event.location;
  document.getElementById("eventStatusUpdate").value = event.status;
  document.getElementById("eventDescriptionUpdate").value = event.description;
}

/**
 * Handles the event update form submission.
 */
formUpdateEvent.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(formUpdateEvent);
    const requiredFields = {
      title: "Nombre",
      location: "Ciudad",
      date: "Fecha",
      status: "Estado",
      description: "Descripción",
      image: "Imagen"
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      const value = formData.get(key);

      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (key === 'image' && value.name === '')
      ) {
        alert(`El campo ${label} es obligatorio.`);
        return;
      }

      // Eliminar espacios al inicio y al final (menos para imagen)
      if (typeof value === 'string') {
        formData.set(key, value.trim());
      }
    }
    
    const data = Object.fromEntries(formData.entries());
    const file = formData.get('image');
    data.image = file?.name || '';
    if (selectedEventId) {
      await update(URL_DATA, selectedEventId, "events", data);
      await loadEvents();
      alert("Evento actualizado correctamente.");
    }
  } catch (error) {
    alert("Error al actualizar el evento.");
  }
});

/**
 * Handles the event creation form submission.
 */
formCreateEvent.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(formCreateEvent);

    const requiredFields = {
      title: "Nombre",
      location: "Ciudad",
      date: "Fecha",
      description: "Descripción",
      image: "Imagen"
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      const value = formData.get(key);

      if (
        !value ||
        (typeof value === 'string' && value.trim() === '') ||
        (key === 'image' && value.name === '')
      ) {
        alert(`El campo ${label} es obligatorio.`);
        return;
      }

      // Eliminar espacios al inicio y al final (menos para imagen)
      if (typeof value === 'string') {
        formData.set(key, value.trim());
      }
    }


    const data = Object.fromEntries(formData.entries());
    const file = formData.get('image');
    data.image = file?.name || '';

    data.status = "activo";

    const date = formData.get('date');
    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      alert("La fecha no puede ser menor que la fecha actual.");
      return;
    }

    await create(`${URL_DATA}events`, data);
    const modalCreate = bootstrap.Modal.getInstance(document.getElementById('modalCrearEvento'));
    modalCreate.hide();
    await loadEvents();
    alert("Evento creado correctamente.");
    formCreateEvent.reset();
  } catch (error) {
    alert("Error al crear el evento.");
  }
});

/**
 * Filters events in real time as the user types in the filter input.
 */
filterInput.addEventListener("input", filterEvents);

/**
 * Filters the events array and renders the filtered results.
 */
function filterEvents() {
  const query = filterInput.value.toLowerCase();
  const filtered = events.filter(event =>
    event.title.toLowerCase().includes(query) ||
    event.location.toLowerCase().includes(query) ||
    event.date.includes(query)
  );
  renderEventsTable(filtered);
}

/**
 * Loads all events from the API and renders them.
 * @async
 * @function
 */
async function loadEvents() {
  try {
    events = await getList(URL_DATA, "events");
    renderEventsTable(events);
  } catch (error) {
    alert("Error al cargar los eventos.");
  }
}

// Initial load of all events
loadEvents();
