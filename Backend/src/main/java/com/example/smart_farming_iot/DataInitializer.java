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

@Component
public class DataInitializer implements CommandLineRunner {

    private final FarmRepository farmRepository;
    private final SensorRepository sensorRepository;
    private final SensorReadingRepository readingRepository;

    public DataInitializer(FarmRepository farmRepository, SensorRepository sensorRepository, SensorReadingRepository readingRepository) {
        this.farmRepository = farmRepository;
        this.sensorRepository = sensorRepository;
        this.readingRepository = readingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (farmRepository.count() > 0) return;

        Farm farm = new Farm("Demo Farm", "Nairobi");
        farm = farmRepository.save(farm);

        Sensor s1 = new Sensor("soil_moisture", "field-1", farm);
        Sensor s2 = new Sensor("temperature", "greenhouse-1", farm);
        sensorRepository.saveAll(List.of(s1, s2));

        List<SensorReading> readings = new ArrayList<>();
        Instant now = Instant.now();
        for (int i=0;i<10;i++) {
            readings.add(new SensorReading(now.minusSeconds(i * 3600), 20 + i, s2));
            readings.add(new SensorReading(now.minusSeconds(i * 3600), 0.2 + i * 0.1, s1));
        }
        readingRepository.saveAll(readings);
    }
}
