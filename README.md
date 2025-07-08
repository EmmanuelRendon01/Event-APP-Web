# Events Web App

A web application for managing and promoting live music events. This project allows users to view upcoming events, subscribe for updates, send contact messages, and provides an admin panel for event and user management.

## Members

- Andres Felipe Marin Patiño
- Juan Camilo Sanchez Mendez
- Juan Esteban Sepulveda
- Emmanuel Rendon Goez

## Clan RITCHIE

## Features

- **Event Listing:** View a list of upcoming music events with details and images.
- **Contact Form:** Users can send messages to the organizers.
- **Subscription:** Users can subscribe with their email to receive updates.
- **Admin Panel:**
  - Login-protected access for administrators.
  - Manage (create, update, delete) events.
  - View and manage subscribers.
  - View and manage contact messages.
- **Route Protection:** Admin pages are protected and require authentication.

## Tech Stack

- **Frontend:** HTML, CSS (Bootstrap, custom styles), JavaScript (ES Modules)
- **Backend/Data:** JSON Server (using `db.json` as a mock database)

## Project Structure

```
assets/           # Images for events and UI
js/               # JavaScript source files
  admin/          # Admin panel scripts
pages/            # HTML pages and components
styles/           # CSS stylesheets
db.json           # Mock database (JSON Server)
index.html        # Main landing page
```

## Getting Started

### Prerequisites
- Node.js and npm installed
- [JSON Server](https://github.com/typicode/json-server) installed globally or locally

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```
2. **Install JSON Server (if not installed):**
   ```bash
   npm install -g json-server
   ```
3. **Start the mock backend:**
   ```bash
   json-server --watch db.json --port 3000
   ```
4. **Open `index.html` in your browser** (or use Live Server in VS Code)

### Admin Login
- Go to `/pages/login.html`
- Use the credentials from `db.json` (default: `Ramiro@gmail.com` / `admin123`)

### How to Add an Image to an Event – Important Note

- If you want to add an image, first download the image and place it in this folder: assets/events_imgs.
- Then, when creating the event, choose the image from the path I mentioned.
- That’s all! Now you should be able to see the image in the index.

## Customization
- Add or edit events, subscribers, and messages directly in `db.json` or via the admin panel.
- Update images in the `assets/` folder.

## Security Note
This project uses localStorage for admin authentication and is intended for educational/demo purposes. For production, implement a secure backend and authentication system.

## License
MIT
