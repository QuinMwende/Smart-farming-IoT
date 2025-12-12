package com.example.smart_farming_iot.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Farm farm;

    @Transient
    @JsonProperty("farmId")
    private Long farmId;

    public Sensor() {}

    public Sensor(String type, String location, Farm farm) {
        this.type = type;
        this.location = location;
        this.farm = farm;
    }

    public Long getId() { return id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Farm getFarm() { return farm; }
    public void setFarm(Farm farm) { this.farm = farm; }
    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }
}
