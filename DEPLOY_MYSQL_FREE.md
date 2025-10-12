# Deploy a Free MySQL Database (PlanetScale)

> Note: PlanetScale's free tier availability can vary by region/account and may require a card. If it appears paid for you, see the alternatives below.

This guide sets up a MySQL database using PlanetScale and connects your Spring Boot backend (on Render) without code changes.

## 1) Create a MySQL on PlanetScale

1. Go to https://planetscale.com/ and sign up.
   - You may need to add a credit card even for the free tier.
2. New Database → name it (e.g., `queuefree_db`) → choose a region → Create.
3. In the DB, go to Settings → “Passwords” → New Password.
   - Copy the generated username and password.
4. Go to “Connect” → pick “Java” (or “General”) → copy:
   - Host (e.g., `aws.connect.psdb.cloud`)
   - Database (the one you created)
   - Username
   - Password
   - SSL is required.

## 2) Configure your backend (Render)

Set these env vars in your Render Web Service (Backend → Environment → Add):

```
DB_HOST=YOUR_HOST_HERE              # e.g., aws.connect.psdb.cloud
DB_PORT=3306
DB_NAME=queuefree_db
DB_USER=YOUR_USERNAME_HERE
DB_PASSWORD=YOUR_PASSWORD_HERE
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect
```

Optional single URL:

```
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_HOST_HERE:3306/queuefree_db?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2
```

Notes:

- SSL is required on PlanetScale. Use `sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2`.
- Do NOT enable `allowPublicKeyRetrieval` with SSL.

## 3) Why no code change?

Your backend config already supports env variables:

- server port from `PORT`
- datasource from `SPRING_DATASOURCE_URL` or `DB_*` parts
- Hibernate dialect via `HIBERNATE_DIALECT` (defaults to MySQL)

So after setting env vars, just redeploy.

## 4) (Optional) Test locally

```
mysql -h YOUR_HOST_HERE -u YOUR_USERNAME_HERE -p --ssl-mode=REQUIRED queuefree_db -e "SELECT 1;"
```

## 5) Redeploy and verify

- Redeploy the backend on Render.
- Check logs for successful DB connection.
- Test login/register/CRUD from the frontend.

---

## If PlanetScale shows paid: Free alternatives (testing only)

These are truly free but limited/unstable for production. Steps are the same: create DB, copy host/user/password/db, set env vars as in section 2.

- db4free.net — Free MySQL for testing (public service, no SLA).
- freemysqlhosting.net — Free small MySQL instances (timeouts/limits apply).
- alwaysdata.com — Free plan (small quota), includes MySQL.

Use them only for demos/dev.

---

## Recommended free path on Render: Switch to Postgres (managed, no card)

Render offers a free managed Postgres. To use it:

1. Create a free Postgres on Render (Dashboard → New → Database → Postgres).  
   Copy: host, database, user, password, port (usually 5432).

2. In your Render backend service, set:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:5432/<DBNAME>
DB_USER=<USER>
DB_PASSWORD=<PASSWORD>
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

3. Ensure the PostgreSQL driver is in your backend (pom.xml):

```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.4</version>
</dependency>
```

4. Redeploy. Hibernate will create tables with `spring.jpa.hibernate.ddl-auto=update`.

This route is the easiest fully free managed option on Render.

---

## Other free MySQL providers (very limited)

These options are free but have strict limits and/or reliability tradeoffs. Important: your backend runs on Render, so the DB must allow remote connections.

- db4free.net

  - Pros: Public, remote connections allowed, quick signup.
  - Cons: For testing only, no SLA, frequent outages, shared instance.
  - Use: Host, user, password provided on signup; set the same env vars as in section 2.

- FreeMySQLHosting.net

  - Pros: Free remote MySQL with simple setup.
  - Cons: Idle timeouts, periodic resets, limited uptime and support.
  - Use: Dashboard shows host/port/user/pass/db; copy to env vars.

- AlwaysData (free plan)

  - Pros: Stable provider; remote MySQL allowed; small free quota.
  - Cons: Very small storage/CPU; may need to enable remote access and note custom port.
  - Use: Host and port from dashboard (e.g., sql-[region].alwaysdata.net:PORT), plus user/pass/db.

- HelioHost (free community hosting)

  - Pros: Free, remote MySQL possible with IP allowlist.
  - Cons: Queue-based provisioning, limited resources, variable uptime.
  - Use: Allow Render egress IPs (if needed) and copy host/user/pass/db.

- 000webhost / InfinityFree (web hosting)
  - Note: Often restrict remote MySQL; intended for PHP apps on same host.
  - Verdict: Usually NOT suitable for Render (remote) backends.

Quick env template (same as section 2):

```
DB_HOST=<HOST>
DB_PORT=3306
DB_NAME=<DBNAME>
DB_USER=<USER>
DB_PASSWORD=<PASSWORD>
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect
# Or single URL:
# SPRING_DATASOURCE_URL=jdbc:mysql://<HOST>:3306/<DBNAME>?useSSL=true
```

Tips:

- Some free hosts require SSL or a custom port; add to JDBC URL as needed.
- If remote access is blocked, it won’t work from Render. Prefer providers that explicitly allow external connections.

---

## Connect to AlwaysData (free plan)

You’ve created a MySQL database on AlwaysData (e.g., `queuefree_db`). Now connect the backend.

1. Find your MySQL connection info

- AlwaysData Dashboard → Databases → MySQL → your database
- Copy:
  - Host (e.g., sql-[region].alwaysdata.net or <account>-mysql.alwaysdata.net)
  - Port (usually 3306)
  - Database name (often prefixed with your account name, e.g., <account>\_queuefree_db)
  - Username (MySQL user; can be your account or a DB-specific user)
  - Password (the one you set for that MySQL user)

2. Set Render backend env vars

```
DB_HOST=<HOST_FROM_ALWAYS_DATA>      # e.g., sql-xx.alwaysdata.net
DB_PORT=3306
DB_NAME=<ACCOUNT_PREFIX>_queuefree_db
DB_USER=<MYSQL_USERNAME>
DB_PASSWORD=<MYSQL_PASSWORD>
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect
```

Optional single URL (TLS recommended by AlwaysData):

```
SPRING_DATASOURCE_URL=jdbc:mysql://<HOST_FROM_ALWAYS_DATA>:3306/<ACCOUNT_PREFIX>_queuefree_db?useSSL=true
```

3. Redeploy backend

- Your application.properties already reads these env vars. No code changes needed.
- After deploy, check Render logs for “HikariPool-1 - Start completed” and no SQL errors.

4. Test the DB connection (optional)

```
mysql -h <HOST_FROM_ALWAYS_DATA> -P 3306 -u <MYSQL_USERNAME> -p <ACCOUNT_PREFIX>_queuefree_db -e "SELECT 1;"
```

Notes:

- AlwaysData DB names are often prefixed with your account (e.g., myacct_queuefree_db). Use the exact name shown in the dashboard.
- If AlwaysData shows a custom port, replace 3306 accordingly.
- Keep credentials in Render env; never commit them.

---

## Quick connect with AlwaysData (from your screenshot)

Use the values you already have:

- Host (DB_HOST): mysql-queuefree.alwaysdata.net
- Port (DB_PORT): 3306
- Database (DB_NAME): queuefree_db
- Username (DB_USER): open MySQL → USERS to see the username (e.g., queuefree). Create/reset a password if needed.
- Password (DB_PASSWORD): the password you set for that MySQL user.

Set these environment variables on your backend (Render → Service → Environment → Add):

```
DB_HOST=mysql-queuefree.alwaysdata.net
DB_PORT=3306
DB_NAME=queuefree_db
DB_USER=queuefree_app
DB_PASSWORD=REPLACE_WITH_YOUR_PASSWORD
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect
```

Or single JDBC URL (TLS recommended by AlwaysData):

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql-queuefree.alwaysdata.net:3306/queuefree_db?useSSL=true
DB_USER=queuefree_app
DB_PASSWORD=REPLACE_WITH_YOUR_PASSWORD
```

Test (optional):

```
mysql -h mysql-queuefree.alwaysdata.net -P 3306 -u <YOUR_MYSQL_USERNAME> -p queuefree_db -e "SELECT 1;"
```

Notes:

- If DB name is prefixed differently in AlwaysData, use exactly what you see (e.g., account_queuefree_db).
- After setting env vars, redeploy the backend on Render.

---

## Fix Render "backend/backend" path error

Render could not find /backend/backend because Root Directory and Dockerfile Path were combined incorrectly.

Use ONE of these:

- Option A (recommended):

  - Root Directory: backend
  - Dockerfile Path: Dockerfile

- Option B:
  - Root Directory: (leave blank)
  - Dockerfile Path: backend/Dockerfile

Frontend service equivalents:

- Option A:

  - Root Directory: frontend
  - Dockerfile Path: Dockerfile

- Option B:
  - Root Directory: (leave blank)
  - Dockerfile Path: frontend/Dockerfile

Notes:

- Runtime: Docker (no build/start commands needed).
- Backend port: server.port uses PORT env (defaults 8080).
- Set env: DB_HOST, DB_PORT=3306, DB_NAME, DB_USER, DB_PASSWORD, HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect (or use SPRING_DATASOURCE_URL).
