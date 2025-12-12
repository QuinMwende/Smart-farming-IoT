# Smart Farming IoT Backend

A Spring Boot REST API for managing farms, sensors, and real-time sensor readings in an IoT agricultural system.

## Features

- **Farm Management**: CRUD operations for farms
- **Sensor Management**: Track sensors at different farm locations
- **Sensor Readings**: Log and retrieve sensor data over time
- **Real-time Data**: WebSocket support for live sensor updates (coming soon)
- **API Documentation**: OpenAPI 3.0 (Swagger) integration
- **Error Handling**: Comprehensive exception handling with proper HTTP status codes
- **Database**: H2 for development, MySQL for production

## Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+ (for production deployment)

## Getting Started

### Clone and Navigate

```bash
cd Smart-farming-IoT/Backend
```

### Build the Project

```bash
./mvnw -DskipTests package
```

### Run the Application

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### Access API Documentation

**Swagger UI**: http://localhost:8080/swagger-ui.html

**OpenAPI JSON**: http://localhost:8080/v3/api-docs

### H2 Database Console (Development)

**URL**: http://localhost:8080/h2-console

**JDBC URL**: `jdbc:h2:mem:smartdb`

**Username**: `sa`

**Password**: (leave empty)

## API Endpoints

### Farms

- `GET /api/farms` - Retrieve all farms
- `GET /api/farms/{id}` - Retrieve a specific farm
- `POST /api/farms` - Create a new farm
  ```json
  {
    "name": "Demo Farm",
    "location": "Nairobi"
  }
  ```
- `PUT /api/farms/{id}` - Update a farm
- `DELETE /api/farms/{id}` - Delete a farm

### Sensor Readings

- `GET /api/farms/{id}/readings?days=7` - Get readings from the last N days (default: 7)

## Database Schema

### Entities

#### Farm
```
- id (Long, PK, Auto-generated)
- name (String, required)
- location (String, required)
- sensors (One-to-Many relationship with Sensor)
```

#### Sensor
```
- id (Long, PK, Auto-generated)
- type (String, e.g., "soil_moisture", "temperature")
- location (String, e.g., "field-1", "greenhouse-1")
- farm_id (Long, FK to Farm)
- readings (One-to-Many relationship with SensorReading)
```

#### SensorReading
```
- id (Long, PK, Auto-generated)
- timestamp (Instant, timestamp with timezone)
- reading_value (Double, the sensor reading value)
- sensor_id (Long, FK to Sensor)
```

## Configuration

### application.properties

```properties
spring.application.name=Smart_farming_IoT

# H2 (Development)
spring.datasource.url=jdbc:h2:mem:smartdb
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver

# MySQL (Production) - uncomment and configure
# spring.datasource.url=jdbc:mysql://localhost:3306/smart_farming_db
# spring.datasource.username=root
# spring.datasource.password=your_password
# spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## Switching to MySQL

1. Install and run MySQL 8.0+
2. Create a database: `CREATE DATABASE smart_farming_db;`
3. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_farming_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.hibernate.ddl-auto=validate
   ```
4. Run the schema initialization script (see below)
5. Restart the application

## Production Deployment

### Database Schema Script

See `src/main/resources/schema.sql` for the complete MySQL schema.

### Build for Production

```bash
./mvnw -DskipTests clean package
java -jar target/smart-farming-iot-backend-0.0.1-SNAPSHOT.jar
```

### Docker Deployment (Optional)

Create a `Dockerfile` and push to a container registry.

## Error Handling

The API returns standard HTTP status codes:

- **200 OK** - Successful GET/PUT
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Invalid input or validation error
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side error

Error responses include timestamp, status, error type, and message:

```json
{
  "timestamp": "2025-12-12T12:03:50.000000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Farm not found with id: 999"
}
```

## Dependencies

- Spring Boot 3.1.6
- Spring Data JPA
- Spring Web
- Spring WebSocket
- H2 Database
- MySQL Connector/J
- springdoc-openapi (Swagger)
- Jackson (JSON processing)

## Project Structure

```
backend/
├── src/main/java/com/example/smart_farming_iot/
│   ├── SmartFarmingIoTApplication.java     # Main entry point
│   ├── DataInitializer.java                # Development data initialization
│   ├── controller/
│   │   └── FarmController.java             # REST endpoints
│   ├── service/
│   │   ├── FarmService.java                # Farm business logic
│   │   └── SensorReadingService.java       # Sensor reading business logic
│   ├── model/
│   │   ├── Farm.java                       # Farm entity
│   │   ├── Sensor.java                     # Sensor entity
│   │   └── SensorReading.java              # SensorReading entity
│   ├── repository/
│   │   ├── FarmRepository.java             # Farm data access
│   │   ├── SensorRepository.java           # Sensor data access
│   │   └── SensorReadingRepository.java    # SensorReading data access
│   └── exception/
│       ├── ResourceNotFoundException.java  # Custom exception
│       └── GlobalExceptionHandler.java     # Global exception handler
├── src/main/resources/
│   ├── application.properties              # Application configuration
│   └── schema.sql                          # MySQL schema (production)
├── pom.xml                                 # Maven configuration
└── README-backend.md                       # This file
```

## Testing

To run unit tests:

```bash
./mvnw test
```

## License

This project is part of the Smart Farming IoT initiative.
