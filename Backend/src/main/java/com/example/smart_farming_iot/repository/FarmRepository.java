package com.example.smart_farming_iot.repository;

import com.example.smart_farming_iot.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmRepository extends JpaRepository<Farm, Long> {
}
