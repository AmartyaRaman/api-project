# Task Box - Backend API

Task Management API built with Node.js, Express, and Drizzle ORM.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (e.g., [Neon.tech](https://neon.tech/))

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=8000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Installation & Database Sync
```bash
cd ./backend
npm install
# Sync schema with database
npx drizzle-kit push
```

### 4. Run Server
```bash
npm run dev
```
The API will be available at `http://localhost:8000/api/v1`.

---

## 🛠️ API Documentation

### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user (`name`, `email`, `password`, `role`). |
| `POST` | `/signin` | Login and receive a JWT cookie. |
| `POST` | `/signout` | Clear the auth cookie and logout. |

### 📝 Task Management (`/tasks`)
*All routes require Authentication via JWT cookie.*
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Fetch all tasks for the authenticated user. |
| `POST` | `/` | Create a new task (`task`). Default status: `incompleted`. |
| `PUT` | `/:id` | Update task content or status (`completed`/`incompleted`). |
| `DELETE` | `/:id` | Delete a specific task by ID. |

### 👥 User Oversight (`/users`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `Logged In` | Fetch the current user's profile info. |
| `GET` | `/admin/all`| `Admin Only` | Fetch all users and their respective tasks. |

---

## 🏗️ Architecture
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with Relational Query API.
- **Validation**: [Zod](https://zod.dev/) for strict request body validation.
- **Logging**: [Winston](https://github.com/winstonjs/winston) + [Morgan](https://github.com/expressjs/morgan) for clean request logs and error tracking.
- **Security**: JWT-based authentication in HTTP-only cookies and Bcrypt password hashing.

## 📁 Project Structure
- `controllers/`: Request handlers and business logic.
- `models/`: Drizzle schema and relationship definitions.
- `middlewares/`: JWT verification and Role-based access control.
- `validations/`: Zod schemas for input data.
- `routes/`: API endpoint definitions.
