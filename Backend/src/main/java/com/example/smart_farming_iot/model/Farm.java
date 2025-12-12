package com.example.smart_farming_iot.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Sensor> sensors;

    public Farm() {}

    public Farm(String name, String location) {
        this.name = name;
        this.location = location;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public List<Sensor> getSensors() { return sensors; }
    public void setSensors(List<Sensor> sensors) { this.sensors = sensors; }
}
