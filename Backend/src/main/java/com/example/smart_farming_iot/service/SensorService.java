package com.example.smart_farming_iot.service;

import com.example.smart_farming_iot.model.Sensor;
import com.example.smart_farming_iot.model.Farm;
import com.example.smart_farming_iot.repository.SensorRepository;
import com.example.smart_farming_iot.repository.FarmRepository;
import com.example.smart_farming_iot.exception.FarmNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorService {

    private final SensorRepository sensorRepository;
    private final FarmRepository farmRepository;

    public SensorService(SensorRepository sensorRepository, FarmRepository farmRepository) {
        this.sensorRepository = sensorRepository;
        this.farmRepository = farmRepository;
    }

    public List<Sensor> getAllSensors() {
        return sensorRepository.findAll();
    }

    public Sensor getSensorById(Long id) {
        return sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id: " + id));
    }

    public Sensor createSensor(Sensor sensor) {
        // Get farm ID from transient field or from farm object
        Long farmId = sensor.getFarmId() != null ? sensor.getFarmId() : 
                      (sensor.getFarm() != null ? sensor.getFarm().getId() : null);
        
        if (farmId != null) {
            Farm farm = farmRepository.findById(farmId)
                    .orElseThrow(() -> new FarmNotFoundException("Farm not found with id: " + farmId));
            sensor.setFarm(farm);
        } else {
            throw new FarmNotFoundException("Farm ID is required to create a sensor");
        }
        
        return sensorRepository.save(sensor);
    }

    public Sensor updateSensor(Long id, Sensor sensorDetails) {
        Sensor sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id: " + id));
        
        sensor.setType(sensorDetails.getType());
        sensor.setLocation(sensorDetails.getLocation());
        
        if (sensorDetails.getFarm() != null && sensorDetails.getFarm().getId() != null) {
            Farm farm = farmRepository.findById(sensorDetails.getFarm().getId())
                    .orElseThrow(() -> new FarmNotFoundException("Farm not found with id: " + sensorDetails.getFarm().getId()));
            sensor.setFarm(farm);
        }
        
        return sensorRepository.save(sensor);
    }

    public void deleteSensor(Long id) {
        Sensor sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id: " + id));
        sensorRepository.delete(sensor);
    }

    public List<Sensor> getSensorsByFarmId(Long farmId) {
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new FarmNotFoundException("Farm not found with id: " + farmId));
        return sensorRepository.findByFarm(farm);
    }
}
