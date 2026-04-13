package com.fooddelivery.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {

    @NotBlank(message = "Name is required")
    private String name;
    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String category;
    private String imageUrl;
    private Boolean isAvailable;
}
