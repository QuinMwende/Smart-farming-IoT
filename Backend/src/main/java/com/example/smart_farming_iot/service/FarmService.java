package com.example.smart_farming_iot.service;

import com.example.smart_farming_iot.exception.ResourceNotFoundException;
import com.example.smart_farming_iot.model.Farm;
import com.example.smart_farming_iot.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;

    public FarmService(FarmRepository farmRepository) {
        this.farmRepository = farmRepository;
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
    }

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Farm createFarm(Farm farm) {
        if (farm.getName() == null || farm.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Farm name is required");
        }
        if (farm.getLocation() == null || farm.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Farm location is required");
        }
        return farmRepository.save(farm);
    }

    public Farm updateFarm(Long id, Farm farmDetails) {
        Farm farm = getFarmById(id);
        if (farmDetails.getName() != null && !farmDetails.getName().trim().isEmpty()) {
            farm.setName(farmDetails.getName());
        }
        if (farmDetails.getLocation() != null && !farmDetails.getLocation().trim().isEmpty()) {
            farm.setLocation(farmDetails.getLocation());
        }
        return farmRepository.save(farm);
    }

    public void deleteFarm(Long id) {
        Farm farm = getFarmById(id);
        farmRepository.delete(farm);
    }
}
