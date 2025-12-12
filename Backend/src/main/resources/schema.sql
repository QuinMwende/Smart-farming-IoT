-- H2 Schema for Smart Farming IoT (Development Database)
-- This schema is automatically executed on startup for H2

CREATE TABLE IF NOT EXISTS farm (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sensor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sensor_reading (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_id BIGINT NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    reading_value DOUBLE NOT NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensor(id) ON DELETE CASCADE
);
