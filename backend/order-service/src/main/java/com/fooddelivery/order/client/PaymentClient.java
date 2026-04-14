package com.fooddelivery.order.client;

import com.fooddelivery.order.dto.PaymentRequest;
import com.fooddelivery.order.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "${services.payment.url}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponse processPayment(@RequestBody PaymentRequest request);

    @GetMapping("/api/payments/order/{orderId}")
    PaymentResponse getPaymentByOrder(@PathVariable("orderId") Long orderId);
}
