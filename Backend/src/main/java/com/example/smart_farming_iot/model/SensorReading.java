package com.example.smart_farming_iot.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant timestamp;

    private double readingValue;

    @ManyToOne(fetch = FetchType.LAZY)
    private Sensor sensor;

    public SensorReading() {}

    public SensorReading(Instant timestamp, double readingValue, Sensor sensor) {
        this.timestamp = timestamp;
        this.readingValue = readingValue;
        this.sensor = sensor;
    }

    public Long getId() { return id; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public double getReadingValue() { return readingValue; }
    public void setReadingValue(double readingValue) { this.readingValue = readingValue; }
    public Sensor getSensor() { return sensor; }
    public void setSensor(Sensor sensor) { this.sensor = sensor; }
}
