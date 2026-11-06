package com.server.server.controller;

import com.server.server.domain.OrderStatus;
import com.server.server.domain.PaymentMethod;
import com.server.server.dto.OrderResponseDTO;
import com.server.server.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    //Endpoint to create a new order
    @PostMapping("/create/{addressId}")
    public ResponseEntity<OrderResponseDTO> createOrder(@PathVariable Long addressId,
                                                        @RequestParam Long userId,
                                                        @RequestParam(defaultValue = "UPI") PaymentMethod paymentMethod,
                                                        @RequestParam(required = false) String couponCode) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(userId, addressId, paymentMethod, couponCode));
    }

    //Endpoint to get all orders for user
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getOrdersForUser(
            @RequestParam Long userId, @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrderForUser(userId, status));
    }

}
