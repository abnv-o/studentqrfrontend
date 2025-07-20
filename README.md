# Student QR Frontend

This is the frontend application for the **Student QR Visual Cryptography** system. It provides a user-friendly interface for interacting with the secure backend, allowing for the generation and reconstruction of encrypted student QR codes.

---

## Table of Contents

- [Project Description](#project-description)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Workflow](#workflow)
- [Screenshots](#screenshots)
- [Installation and Setup](#installation-and-setup)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Project Description

The **Student QR Frontend** is a modern, responsive web application built with **React**. It serves as the client-side interface for a student management system that uses a novel security approach: **(2,2) Visual Cryptography**. The application allows administrators or authorized users to generate two secure "shares" from a student's QR code. These shares individually appear as random noise but, when combined, reveal the original QR code.

### Key Features

* **User-Friendly Interface:** Clean and intuitive design for managing student QR codes.
* **Generate QR Shares:** Interface with the backend to split a student's QR code into two encrypted shares.
* **Display Shares:** Clearly present the two generated shares for distribution or storage.
* **Responsive Design:** Ensures a seamless experience across different devices.
* **API Integration:** Communicates with the secure Django backend to handle all data and cryptographic operations.

---

## Tech Stack

* **React:** A popular JavaScript library for building user interfaces.
* **Axios:** A promise-based HTTP client for making API requests to the backend.
* **HTML5 & CSS3:** For structuring and styling the application.
* **React Router:** For handling client-side routing.

---

## Workflow

The application follows a simple yet secure workflow:

1.  **Select a Student:** The user selects a student from the interface.
2.  **Request Shares:** The user clicks a button to trigger an API call to the backend.
3.  **Backend Processing:** The backend retrieves the student's QR code and applies the visual cryptography algorithm to generate two shares.
4.  **Display Shares:** The frontend receives the paths to the two share images and displays them to the user.
5.  **Reconstruction:** The two shares can then be downloaded or printed. When physically overlaid, they reveal the original student QR code.

---

## Screenshots

*(Placeholder for screenshots of the application's interface)*

*Add screenshots here to showcase the application's UI, such as the main dashboard, the share generation view, and the displayed shares.*

---

## Installation and Setup

To get a local copy of the frontend up and running, follow these steps.

### Prerequisites

* Node.js and npm (or yarn)
* A running instance of the [Student QR Backend](https://github.com/abnv-o/studentqrbackend.git)

### Step-by-Step Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/abnv-o/studentqrfrontend.git](https://github.com/abnv-o/studentqrfrontend.git)
    cd studentqrfrontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
    or if you use yarn:
    ```sh
    yarn install
    ```

3.  **Run the development server:**
    ```sh
    npm start
    ```
    or
    ```sh
    yarn start
    ```

4.  **Open the application:**
    The application will be running at `http://localhost:3000`.

---

## Configuration

To connect the frontend to your backend API, you may need to configure the base URL for API requests.

* Locate the API service files (e.g., in `src/services/api.js` or a similar directory).
* Change the `baseURL` to match the address of your running backend server (e.g., `http://127.0.0.1:8000/api`).

```javascript
// Example in a hypothetical api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)', // <-- Change this URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
