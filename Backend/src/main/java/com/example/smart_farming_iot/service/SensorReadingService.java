package com.example.smart_farming_iot.service;

import com.example.smart_farming_iot.model.SensorReading;
import com.example.smart_farming_iot.model.Sensor;
import com.example.smart_farming_iot.repository.SensorReadingRepository;
import com.example.smart_farming_iot.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class SensorReadingService {

    private final SensorReadingRepository readingRepository;
    private final SensorRepository sensorRepository;
    private final Random random = new Random();

    public SensorReadingService(SensorReadingRepository readingRepository, SensorRepository sensorRepository) {
        this.readingRepository = readingRepository;
        this.sensorRepository = sensorRepository;
    }

    public List<SensorReading> getReadingsByFarmId(Long farmId, int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Days must be greater than 0");
        }
        Instant after = Instant.now().minus(days, ChronoUnit.DAYS);
        return readingRepository.findBySensor_Farm_IdAndTimestampAfter(farmId, after);
    }

    public List<SensorReading> getReadingsBySensorId(Long sensorId, int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Days must be greater than 0");
        }
        Instant after = Instant.now().minus(days, ChronoUnit.DAYS);
        return readingRepository.findBySensor_IdAndTimestampAfter(sensorId, after);
    }

    public SensorReading createReading(SensorReading reading) {
        if (reading.getSensor() == null) {
            throw new IllegalArgumentException("Sensor is required");
        }
        return readingRepository.save(reading);
    }

    public List<SensorReading> generateReadingsForSensor(Long sensorId, int days) {
        Sensor sensor = sensorRepository.findById(sensorId)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id: " + sensorId));

        List<SensorReading> readings = new ArrayList<>();
        Instant now = Instant.now();
        int hoursPerDay = 24;
        int totalHours = days * hoursPerDay;

        for (int i = 0; i < totalHours; i++) {
            long timestamp = i * 3600;
            double value = generateRandomValue(sensor.getType());
            readings.add(new SensorReading(now.minusSeconds(timestamp), value, sensor));
        }

        return readingRepository.saveAll(readings);
    }

    private double generateRandomValue(String sensorType) {
        return switch (sensorType.toLowerCase()) {
            case "temperature" -> 15 + random.nextDouble() * 20; // 15-35°C
            case "humidity" -> 30 + random.nextDouble() * 50; // 30-80%
            case "pressure" -> 1000 + random.nextDouble() * 30; // 1000-1030 hPa
            case "soil_moisture" -> 0.2 + random.nextDouble() * 0.6; // 0.2-0.8
            case "wind_speed" -> random.nextDouble() * 10; // 0-10 m/s
            default -> random.nextDouble() * 100;
        };
    }
}
