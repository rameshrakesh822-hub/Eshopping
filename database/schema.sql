
CREATE DATABASE IF NOT EXISTS shopzone_db;

USE shopzone_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PLACED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, stock, image_url)
SELECT 'Smartphone', 'Latest smartphone', 15000, 20, ''
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Smartphone'
);

INSERT INTO products (name, description, price, stock, image_url)
SELECT 'Laptop', 'High performance laptop', 45000, 10, ''
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Laptop'
);

INSERT INTO products (name, description, price, stock, image_url)
SELECT 'Headphones', 'Wireless headphones', 1500, 30, ''
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Headphones'
);

INSERT INTO products (name, description, price, stock, image_url)
SELECT 'Smart Watch', 'Modern smart watch', 2500, 15, ''
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Smart Watch'
);

CREATE USER IF NOT EXISTS 'shopzone_user'@'%'
IDENTIFIED BY 'ShopZone@123';

ALTER USER 'shopzone_user'@'%'
IDENTIFIED BY 'ShopZone@123';

GRANT SELECT, INSERT, UPDATE, DELETE
ON shopzone_db.*
TO 'shopzone_user'@'%';

FLUSH PRIVILEGES;
