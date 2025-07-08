/**
 * Protects admin pages by checking if the user is logged in as admin.
 * If not authenticated, redirects to the main page.
 */
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = '../index.html';
}
