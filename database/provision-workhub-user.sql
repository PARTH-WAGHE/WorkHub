-- WorkHub Database Provisioning Script
-- Run this in your AlwaysData MySQL panel or command line

-- Create the main database
CREATE DATABASE IF NOT EXISTS workhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create main user (if using command line access)
-- Note: In AlwaysData panel, create user 'workhub' manually
-- CREATE USER 'workhub'@'%' IDENTIFIED BY 'WorkHub_S3cure!2025';
-- GRANT ALL PRIVILEGES ON workhub_db.* TO 'workhub'@'%';

-- Create application user (if using command line access)
-- Note: In AlwaysData panel, create user 'workhub_app' manually
-- CREATE USER 'workhub_app'@'%' IDENTIFIED BY 'WorkHubApp_S3cure!2025';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON workhub_db.* TO 'workhub_app'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify database exists
SHOW DATABASES LIKE 'workhub_db';
