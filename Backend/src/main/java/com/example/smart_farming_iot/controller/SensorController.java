package com.example.smart_farming_iot.controller;

import com.example.smart_farming_iot.model.Sensor;
import com.example.smart_farming_iot.service.SensorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping
    public ResponseEntity<List<Sensor>> getAllSensors() {
        List<Sensor> sensors = sensorService.getAllSensors();
        return ResponseEntity.ok(sensors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sensor> getSensorById(@PathVariable Long id) {
        Sensor sensor = sensorService.getSensorById(id);
        return ResponseEntity.ok(sensor);
    }

    @PostMapping
    public ResponseEntity<Sensor> createSensor(@RequestBody Sensor sensor) {
        Sensor createdSensor = sensorService.createSensor(sensor);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSensor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sensor> updateSensor(@PathVariable Long id, @RequestBody Sensor sensorDetails) {
        Sensor updatedSensor = sensorService.updateSensor(id, sensorDetails);
        return ResponseEntity.ok(updatedSensor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSensor(@PathVariable Long id) {
        sensorService.deleteSensor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/farm/{farmId}")
    public ResponseEntity<List<Sensor>> getSensorsByFarmId(@PathVariable Long farmId) {
        List<Sensor> sensors = sensorService.getSensorsByFarmId(farmId);
        return ResponseEntity.ok(sensors);
    }
}
