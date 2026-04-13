package com.fooddelivery.order.service;

import com.fooddelivery.order.client.PaymentClient;
import com.fooddelivery.order.client.RestaurantClient;
import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderItem;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.exception.ResourceNotFoundException;
import com.fooddelivery.order.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantClient restaurantClient;
    private final PaymentClient paymentClient;

    @Transactional
    @CircuitBreaker(name = "restaurantService", fallbackMethod = "placeOrderFallback")
    @Retry(name = "restaurantService")
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        RestaurantDTO restaurant = restaurantClient.getRestaurant(request.getRestaurantId());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItemDTO menuItem = restaurantClient.getMenuItem(itemReq.getMenuItemId());
            BigDecimal itemTotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            orderItems.add(OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .name(menuItem.getName())
                    .quantity(itemReq.getQuantity())
                    .price(menuItem.getPrice())
                    .build());
        }

        Order order = Order.builder()
                .userId(userId)
                .restaurantId(restaurant.getId())
                .restaurantName(restaurant.getName())
                .status(OrderStatus.PLACED)
                .totalAmount(totalAmount)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        order = orderRepository.save(order);

        try {
            PaymentRequest paymentRequest = PaymentRequest.builder()
                    .orderId(order.getId())
                    .amount(totalAmount)
                    .method("CARD")
                    .build();
            paymentClient.processPayment(paymentRequest);
            order.setStatus(OrderStatus.CONFIRMED);
            order = orderRepository.save(order);
        } catch (Exception e) {
            log.error("Payment failed for order {}: {}", order.getId(), e.getMessage());
            order.setStatus(OrderStatus.CANCELLED);
            order = orderRepository.save(order);
        }

        return toResponse(order);
    }

    public OrderResponse placeOrderFallback(Long userId, OrderRequest request, Throwable t) {
        log.error("Circuit breaker triggered for placeOrder: {}", t.getMessage());
        throw new IllegalStateException("Restaurant service is currently unavailable. Please try again later.");
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return toResponse(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .menuItemId(item.getMenuItemId())
                        .name(item.getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .restaurantId(order.getRestaurantId())
                .restaurantName(order.getRestaurantName())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
