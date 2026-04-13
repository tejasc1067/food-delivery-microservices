package com.fooddelivery.restaurant.controller;

import com.fooddelivery.restaurant.dto.*;
import com.fooddelivery.restaurant.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping("/api/restaurants/{restaurantId}/menu")
    public ResponseEntity<List<MenuItemResponse>> getMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuItemService.getMenuByRestaurant(restaurantId));
    }

    @GetMapping("/api/menu-items/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItem(id));
    }

    @PostMapping("/api/restaurants/{restaurantId}/menu")
    public ResponseEntity<MenuItemResponse> create(@PathVariable Long restaurantId,
                                                    @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemService.createMenuItem(restaurantId, request));
    }

    @PutMapping("/api/menu-items/{id}")
    public ResponseEntity<MenuItemResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, request));
    }

    @DeleteMapping("/api/menu-items/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
