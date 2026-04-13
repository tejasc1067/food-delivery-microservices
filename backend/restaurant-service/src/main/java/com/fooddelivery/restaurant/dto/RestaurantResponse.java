package com.fooddelivery.restaurant.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String cuisineType;
    private BigDecimal rating;
    private String imageUrl;
}
