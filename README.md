# WorkHub Employee Management System

WorkHub is a modern, full-stack, interactive employee management platform. It features a beautiful UI, secure authentication, and robust role-based access for teams of any size.

---

## 🚀 Features

- **Authentication:** Secure login/register, password hashing, admin/user roles
- **Employee CRUD:** Add, edit, delete, and view employee profiles
- **Role-based Access:** Admin dashboard, user self-edit, access control
- **Search & Filter:** Find employees by name, department, and status
- **Responsive UI:** Mobile-friendly, animated gradients, glassmorphism cards
- **Pagination & Modals:** Paginated lists, info modals, skeleton loading
- **Interactive Feedback:** Animated modals, error handling, confirmation dialogs

---

## 🛠 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Spring Boot (Java 17+) + MySQL
- **Database:** MySQL 8+
- **Deployment:** Vercel (frontend), Render (backend & database)

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/workhub.git
cd workhub
```

### 2. Setup the Database

- Create a MySQL database and user (see `database/provision-workhub-user.sql`)
- Update backend `src/main/resources/application.properties` with your DB credentials

### 3. Backend Setup

```bash
cd backend
mvn spring-boot:run
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. Environment Variables

**Frontend (`frontend/.env`):**

```
VITE_API_BASE_URL=http://localhost:8080
```

**Backend (`src/main/resources/application.properties`):**

```
spring.datasource.url=jdbc:mysql://localhost:3306/workhub_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=WORKHUB
spring.datasource.password=ChangeMe_S3cure!
```

---

## 🌐 Deployment

- **Frontend:** Import repo to [Vercel](https://vercel.com/), set build command/output directory, add env vars
- **Backend:** Import repo to [Render](https://render.com/), set build/start commands, add env vars
- **Database:** Use Render Managed MySQL or your own MySQL server

---

## 👥 Team

- Parth Waghe
- Sameer Balgar
- Nidhish Vartak
- Vedika Takke

---

## 📸 Screenshots

![Login Page](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Interactive Usage

- **Live Search:** Instantly filter employees by name, email, or position.
- **Animated Modals:** Get feedback for actions, errors, and confirmations.
- **Role-based UI:** Admins see extra controls; users can edit their own profile.
- **Pagination:** Browse large teams with smooth page transitions.

---

## 🗂️ Directory Structure

```
workhub/
├── backend/
│   └── src/
│       └── main/
│           └── java/
│           └── resources/
├── frontend/
│   └── src/
│       └── components/
│       └── services/
│   └── public/
├── database/
│   └── provision-workhub-user.sql
└── README.md
```

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

---

## 📬 Contact

For support or collaboration, open a GitHub issue or reach out to the team.
