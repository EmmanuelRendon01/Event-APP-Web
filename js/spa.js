/**
 * SPA (Single Page Application) logic for admin panel navigation.
 * Dynamically loads HTML components and their corresponding JS modules.
 */
const mainContent = document.getElementById("mainContent");

/**
 * Adds click event listeners to all navigation links with data-page attribute.
 * Loads the corresponding page component when clicked.
 */
document.querySelectorAll("[data-page]").forEach(link => {
  link.addEventListener("click", async e => {
    e.preventDefault();
    const page = e.target.getAttribute("data-page");
    loadPage(page);
  });
});

/**
 * Loads the HTML and JS module for the given page into the main content area.
 * @param {string} page - The page/component name to load
 * @async
 * @function
 */
async function loadPage(page) {
  const res = await fetch(`../pages/components/${page}.html`);
  const html = await res.text();

  mainContent.innerHTML = html;

  try {
    const module = await import(`./admin/${page}.js?cacheBust=${Date.now()}`);
  } catch (error) {
    console.warn(`No se pudo cargar el JS de ${page}`, error);
  }
}

// Load the default admin dashboard page on initial load
loadPage("adminIndex");
