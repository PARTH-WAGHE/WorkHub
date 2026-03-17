-- WorkHub schema bootstrap script (PostgreSQL)
-- This file is executed by Spring Boot on application startup.
-- Prerequisite: workhub_db database and DB user must already exist.

CREATE TABLE IF NOT EXISTS employees (
	id BIGSERIAL PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	phone VARCHAR(255),
	phone_country_code VARCHAR(5),
	department VARCHAR(255),
	position VARCHAR(255),
	address VARCHAR(255),
	salary NUMERIC(19,2),
	currency VARCHAR(3),
	date_of_birth DATE,
	hire_date DATE,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	"role" VARCHAR(255) NOT NULL DEFAULT 'USER',
	password_hash VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_employees_email ON employees (email);
