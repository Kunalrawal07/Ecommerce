// Fetch session status to check if the user is logged in
function checkLoginStatus() {
    fetch('/session-status')  // Create a route to check session status
        .then(response => response.json())
        .then(data => {
            const navbar = document.getElementById('navbar');
            if (data.loggedIn) {
                navbar.innerHTML = `
                    <ul>
                        <li><a href="/profile">Profile</a></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                `;
            } else {
                navbar.innerHTML = `
                    <ul>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/signup">Signup</a></li>
                    </ul>
                `;
            }
        })
        .catch(error => console.error('Error checking login status:', error));
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
