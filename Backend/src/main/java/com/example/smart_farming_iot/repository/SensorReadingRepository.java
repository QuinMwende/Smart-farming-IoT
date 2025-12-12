package com.example.smart_farming_iot.repository;

import com.example.smart_farming_iot.model.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findBySensor_Farm_IdAndTimestampAfter(Long farmId, Instant after);
}
