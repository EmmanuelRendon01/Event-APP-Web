/**
 * Handles admin login functionality.
 * Validates credentials and manages session for admin access.
 */
import { getList, URL_DATA } from "./admin/admin.js"

/**
 * Login form element for admin authentication.
 * @type {HTMLFormElement}
 */
const form = document.getElementById('loginForm');

// Handle login form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Fetch list of administrators from the API
    const administrators = await getList(URL_DATA, 'admin');

    // Get email and password input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate admin credentials
    const validateAdmin = administrators.find(admin =>
        admin.email === email && admin.password === password
    );

    if (validateAdmin) {
        alert("Inicio de sesión exitoso");
        window.location.href = "./admin.html";
        localStorage.setItem('adminLoggedIn', 'true');
    } else {
        alert("Correo o contraseña incorrectos");
    }
})