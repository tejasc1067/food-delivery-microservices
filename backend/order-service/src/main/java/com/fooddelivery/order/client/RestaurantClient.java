package com.fooddelivery.order.client;

import com.fooddelivery.order.dto.MenuItemDTO;
import com.fooddelivery.order.dto.RestaurantDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "restaurant-service", url = "${services.restaurant.url}")
public interface RestaurantClient {

    @GetMapping("/api/restaurants/{id}")
    RestaurantDTO getRestaurant(@PathVariable("id") Long id);

    @GetMapping("/api/menu-items/{id}")
    MenuItemDTO getMenuItem(@PathVariable("id") Long id);

    @GetMapping("/api/restaurants/{restaurantId}/menu")
    List<MenuItemDTO> getMenu(@PathVariable("restaurantId") Long restaurantId);
}
