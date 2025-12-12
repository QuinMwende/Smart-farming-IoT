package com.example.smart_farming_iot.repository;

import com.example.smart_farming_iot.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorRepository extends JpaRepository<Sensor, Long> {
}
