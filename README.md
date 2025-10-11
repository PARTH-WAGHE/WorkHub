DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=queuefree_db
DB_USER=QUEUEFREE
DB_PASSWORD=ChangeMe_S3cure!
DB_SSL=false

# Optional unified URL (for ORMs/clients that support it)
DATABASE_URL=mysql://QUEUEFREE:ChangeMe_S3cure!@127.0.0.1:3306/queuefree_db
# QUEUEFREE - Employee Data Management

Prereqs:

- Node.js 18+
- Java 17+
- Maven 3.9+
- MySQL 8+

Backend:

1. Update backend/src/main/resources/application.properties with your DB username/password.
2. Create DB (auto-created if user has perms): queuefree
3. From c:\Project\QUEUEFREE\backend run: mvn spring-boot:run

Frontend:
Quick fix for MySQL [28000][1045] Access denied for user 'QUEUEFREE'@'localhost'

Steps:
- Log in as admin: mysql -u root -p -h 127.0.0.1 -P 3306
- Run the provisioning script:
  - Windows PowerShell:
    mysql -u root -p -h 127.0.0.1 -P 3306 < .\database\provision-queuefree-user.sql
- Test login:
  mysql -u QUEUEFREE -p -h 127.0.0.1 -P 3306 -D queuefree_db -e "SELECT 1;"
- Configure the app using .env (copy .env.example to .env and adjust the password).
- Prefer 127.0.0.1 to avoid host/resolve differences.
- If using older MySQL clients, switch the user to mysql_native_password (see comments in the SQL script).

Troubleshooting:
- SHOW GRANTS FOR 'QUEUEFREE'@'localhost';
- SHOW GRANTS FOR 'QUEUEFREE'@'127.0.0.1';
- Ensure the DB name, user, and password in your app exactly match MySQL.

1. From c:\Project\QUEUEFREE\frontend run: npm install
2. Start dev server: npm run dev (http://localhost:5173)

Notes:

- Vite proxy forwards /api to http://localhost:8080.
- If you deploy differently, adjust vite.config.js or backend CORS.
