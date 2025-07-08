/**
 * Loads and displays admin dashboard statistics.
 * Handles logout and fetches event, message, and subscriber data.
 */
import { getList, URL_DATA } from "./admin.js";

/**
 * Logout button event handler.
 * Removes admin session and redirects to home page.
 */
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
  localStorage.removeItem('adminLoggedIn');
  window.location.href = '../../index.html';
})

/**
 * Loads dashboard statistics and updates the DOM with event, message, and subscriber counts.
 * Fetches data from the API and calculates totals for each category.
 * @async
 * @function
 */
async function loadDashboardData() {
  const events = await getList(URL_DATA, "events");
  const messages = await getList(URL_DATA, "contactMessages");
  const emails = await getList(URL_DATA, "subscribers");

  // Count totals and categories
  const total = events.length;
  const cancelados = events.filter(e => e.status === "cancelado").length;
  const inactivos = events.filter(e => e.status === "inactivo").length;
  const totalEmails = emails.length;
  const totalMessages = messages.length;

  // Update DOM with statistics
  document.getElementById("countTotal").textContent = total;
  document.getElementById("countCancelled").textContent = cancelados;
  document.getElementById("countInactive").textContent = inactivos;
  document.getElementById("countEmails").textContent = totalEmails;
  document.getElementById("countMessages").textContent = totalMessages;
}

// Initialize dashboard data on page load
loadDashboardData();
