-- Run as an admin user (e.g., root). Adjust database name and password as needed.

-- Create the application database if missing
CREATE DATABASE IF NOT EXISTS `queuefree_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the QUEUEFREE user for both localhost and 127.0.0.1
CREATE USER IF NOT EXISTS 'QUEUEFREE'@'localhost' IDENTIFIED BY 'ChangeMe_S3cure!';
CREATE USER IF NOT EXISTS 'QUEUEFREE'@'127.0.0.1' IDENTIFIED BY 'ChangeMe_S3cure!';

-- If your client/driver does not support caching_sha2_password, uncomment the following:
-- ALTER USER 'QUEUEFREE'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ChangeMe_S3cure!';
-- ALTER USER 'QUEUEFREE'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'ChangeMe_S3cure!';

-- Grant privileges on the application database
GRANT ALL PRIVILEGES ON `queuefree_db`.* TO 'QUEUEFREE'@'localhost';
GRANT ALL PRIVILEGES ON `queuefree_db`.* TO 'QUEUEFREE'@'127.0.0.1';

-- Apply changes
FLUSH PRIVILEGES;

-- Optional: Verify the user entries
-- SELECT user, host, plugin FROM mysql.user WHERE user = 'QUEUEFREE';
-- SHOW GRANTS FOR 'QUEUEFREE'@'localhost';
-- SHOW GRANTS FOR 'QUEUEFREE'@'127.0.0.1';

