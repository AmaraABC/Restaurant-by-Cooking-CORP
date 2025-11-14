CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL,
    userrole VARCHAR(100) NOT NULL DEFAULT 'client'
);

CREATE TABLE table_reservation (
    id BIGSERIAL PRIMARY KEY,
    table_number INT NOT NULL,
    seats INT NOT NULL,
    emplacement VARCHAR(100) 
);

CREATE TABLE reservation (
    id BIGSERIAL PRIMARY KEY,
    users_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    reservation_time TIME NOT NULL,
    reservation_date DATE NOT NULL,
    guests INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (table_id) REFERENCES table_reservation(id)
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    users_id BIGINT NOT NULL,
    order_status VARCHAR(100) NOT NULL DEFAULT 'en attente',
    price NUMERIC(8,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (users_id) REFERENCES users(id)
);