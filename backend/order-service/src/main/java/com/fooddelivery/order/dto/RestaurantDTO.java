package com.fooddelivery.order.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String cuisineType;
    private BigDecimal rating;
    private String imageUrl;
}
