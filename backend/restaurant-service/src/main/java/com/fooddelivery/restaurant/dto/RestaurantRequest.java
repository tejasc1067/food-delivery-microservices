package com.fooddelivery.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantRequest {

    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    private String address;
    private String city;
    private String cuisineType;
    private BigDecimal rating;
    private String imageUrl;
}
