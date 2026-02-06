# SpotMTL 

**SpotMTL** is a web application designed to help users explore all the attractions that Montreal has to offer — from cultural landmarks and outdoor spots to restaurants and hidden gems. It provides an organized, visually engaging, and user-friendly platform to search, view, and categorize destinations across the city.

## Project Structure

Below is a general overview of the files and their roles within the project:


### authentication/
Handles all user login and signup functionalities:
- `Login.jsx` – UI and logic for user login.
- `Signup.jsx` – UI and logic for user registration.

### Components/
Reusable components across the app:
- `Footer.jsx` – Bottom footer for all pages.
- `NavBar.jsx` – Navigation bar with links.
- `ProtectedRoute.jsx` – Restricts page access unless authenticated.
- `SearchBar.jsx` – Multi-category search component for the main search page.
- `Header.jsx` - Header in all the different pages of the website.

### Pages/
Main application views:
- `Home.jsx` – Landing page or main dashboard after login.
- `Menu.jsx` – Possibly a navigation or menu page for different sections.
- `MyList.jsx` – Displays the user's saved attractions or favorites.
- `Search.jsx` – Advanced search interface to explore Montreal by categories.

### assets/
Static files such as images, icons, and logos.

---


## Configuration & Core Files

- `App.jsx` – Main application logic and route rendering.
- `App.css` – Global styles (may be overridden by Tailwind).
- `index.css` – Base styles used across the app.
- `main.jsx` – Entry point that renders `<App />` into the DOM.
- `index.html` – Root HTML file where the app is mounted.

### Configuration Files:
- `tailwind.config.js` – TailwindCSS setup and theme config.
- `vite.config.js` – Configuration for Vite (build tool).
- `.eslintrc.js` – Code style and linting rules.
- `package.json` – Project metadata and dependencies.
- `.gitignore` – Files and folders to exclude from version control.

---

_Note: File names and structure may evolve as the project grows._

## Tech Stack

### Languages & Frameworks
- **JavaScript** – Main scripting language used
- **JSX** – For building UI components in React
- **HTML5** & **CSS3** – Base web technologies

### UI & Styling
- **React.js** – Frontend framework for building dynamic interfaces
- **Tailwind CSS** – Utility-first CSS framework for styling components

### Platforms & Services
- **Firebase** – For authentication and image storage
- **GitHub** – Version control and collaboration
- **Vite** – Fast development build tool
- **Visual Studio Code** – Main development environment

---

