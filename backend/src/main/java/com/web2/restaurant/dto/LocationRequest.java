package com.web2.restaurant.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationRequest {
    private double latitude;
    private double longitude;
    private double radius;

    public LocationRequest(double latitude, double longitude, double radius) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
    }
}
