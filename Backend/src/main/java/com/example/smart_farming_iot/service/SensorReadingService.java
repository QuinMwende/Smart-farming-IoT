package com.example.smart_farming_iot.service;

import com.example.smart_farming_iot.model.SensorReading;
import com.example.smart_farming_iot.repository.SensorReadingRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SensorReadingService {

    private final SensorReadingRepository readingRepository;

    public SensorReadingService(SensorReadingRepository readingRepository) {
        this.readingRepository = readingRepository;
    }

    public List<SensorReading> getReadingsByFarmId(Long farmId, int days) {
        if (days <= 0) {
            throw new IllegalArgumentException("Days must be greater than 0");
        }
        Instant after = Instant.now().minus(days, ChronoUnit.DAYS);
        return readingRepository.findBySensor_Farm_IdAndTimestampAfter(farmId, after);
    }

    public SensorReading createReading(SensorReading reading) {
        if (reading.getSensor() == null) {
            throw new IllegalArgumentException("Sensor is required");
        }
        return readingRepository.save(reading);
    }
}
