package com.example.smart_farming_iot;

import com.example.smart_farming_iot.model.Farm;
import com.example.smart_farming_iot.model.Sensor;
import com.example.smart_farming_iot.model.SensorReading;
import com.example.smart_farming_iot.repository.FarmRepository;
import com.example.smart_farming_iot.repository.SensorReadingRepository;
import com.example.smart_farming_iot.repository.SensorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private final FarmRepository farmRepository;
    private final SensorRepository sensorRepository;
    private final SensorReadingRepository readingRepository;
    private final Random random = new Random();

    public DataInitializer(FarmRepository farmRepository, SensorRepository sensorRepository, SensorReadingRepository readingRepository) {
        this.farmRepository = farmRepository;
        this.sensorRepository = sensorRepository;
        this.readingRepository = readingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Database initialization disabled - create farms and sensors manually via API
        System.out.println("✓ DataInitializer ready - use the API to create farms and sensors");
    }
}
