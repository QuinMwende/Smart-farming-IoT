package com.example.smart_farming_iot.repository;

import com.example.smart_farming_iot.model.Sensor;
import com.example.smart_farming_iot.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SensorRepository extends JpaRepository<Sensor, Long> {
    List<Sensor> findByFarm(Farm farm);
}
