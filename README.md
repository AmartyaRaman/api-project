# Task Box - Full Stack Task Management
### Live Link -> https://api-project-6bhd.onrender.com/

## ⚡ Quick Start (Monorepo)

### 1. Initial Setup
```bash
# Install everything
cd backend && npm install
cd ../frontend && npm install

# Build the frontend once
npm run build
```

### 2. Run the App
```bash
cd backend
npm run dev
```
Visit **`http://localhost:8000`**. The UI and API are both powered by this single command!

---

## 🛠️ API Documentation

### 🔐 Auth (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register user (`name`, `email`, `password`, `role`). |
| `POST` | `/signin` | Login and receive a JWT cookie. |
| `POST` | `/signout`| Clear the auth cookie and logout. |

### 📝 Tasks (`/tasks`)
*Requires Auth*
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Fetch all tasks for the logged-in user. |
| `POST` | `/` | Create task (`task`). Default: `incompleted`. |
| `PUT` | `/:id` | Update task content or status (`completed`/`incompleted`). |
| `DELETE`| `/:id` | Delete a specific task by ID. |

### 👥 Users (`/users`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `Log In` | Fetch current user profile. |
| `GET` | `/admin/all`| `Admin` | Detailed view of all users & tasks (Excludes admins). |

---

## 📝 Roles & Permissions
- **User**: Can manage (create/edit/delete) their own personal tasks.
- **Admin**: Has a system-wide oversight dashboard to monitor all users and their tasks. Admins do not manage their own tasks.

---

## 🏗️ Integrated Tech Stack

| Layer | technologies |
| :--- | :--- |
| **Backend** | Node.js, Express, Drizzle ORM, Zod, Winston, Morgan |
| **Database** | PostgreSQL (Relational Query API) |
| **Frontend** | React, Vite, Tailwind CSS v4, Lucide React, Axios |
| **Security** | JWT (HTTP-only cookies), Bcrypt Hashing |
| **Design**   | 3D Neobrutalist / Black & White |

---

## 📁 Detailed Structure

### Backend
- `controllers/`: Business logic and database operations.
- `models/`: Drizzle schema and relationship definitions.
- `middlewares/`: JWT verification and `isAdmin` role-based guards.
- `validations/`: Zod schemas for input validation.

### Frontend
- `context/`: AuthContext for global user state and API setup.
- `pages/`: Dashboard (User/Admin views) and Auth pages.
- `index.css`: Tailwind v4 configuration and 3D design utilities.