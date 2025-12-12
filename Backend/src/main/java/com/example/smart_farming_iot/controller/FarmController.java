package com.example.smart_farming_iot.controller;

import com.example.smart_farming_iot.model.Farm;
import com.example.smart_farming_iot.model.SensorReading;
import com.example.smart_farming_iot.service.FarmService;
import com.example.smart_farming_iot.service.SensorReadingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    private final FarmService farmService;
    private final SensorReadingService readingService;

    public FarmController(FarmService farmService, SensorReadingService readingService) {
        this.farmService = farmService;
        this.readingService = readingService;
    }

    @GetMapping
    public ResponseEntity<List<Farm>> getAllFarms() {
        List<Farm> farms = farmService.getAllFarms();
        return ResponseEntity.ok(farms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {
        Farm farm = farmService.getFarmById(id);
        return ResponseEntity.ok(farm);
    }

    @PostMapping
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        Farm createdFarm = farmService.createFarm(farm);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFarm);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable Long id, @RequestBody Farm farmDetails) {
        Farm updatedFarm = farmService.updateFarm(id, farmDetails);
        return ResponseEntity.ok(updatedFarm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/readings")
    public ResponseEntity<List<SensorReading>> getReadings(@PathVariable("id") Long farmId,
                                                           @RequestParam(name = "days", defaultValue = "7") int days) {
        List<SensorReading> readings = readingService.getReadingsByFarmId(farmId, days);
        return ResponseEntity.ok(readings);
    }
}
