package com.server.server.controller;

import com.server.server.domain.OrderStatus;
import com.server.server.domain.PaymentMethod;
import com.server.server.dto.OrderResponseDTO;
import com.server.server.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    //Endpoint to get all orders for admin
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersForAdmin(@RequestParam(required = false) String keyword,
                                                                    @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersForAdmin(keyword, status));
    }


    //Endpoint to create a new order
    @PostMapping("/create/{addressId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> createOrder(@PathVariable Long addressId,
                                                        @AuthenticationPrincipal Jwt jwt,
                                                        @RequestParam(defaultValue = "UPI") PaymentMethod paymentMethod,
                                                        @RequestParam(required = false) String couponCode) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(userId, addressId, paymentMethod, couponCode));
    }

    //Endpoint to get all orders for user
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersForUser(
            @AuthenticationPrincipal Jwt jwt, @RequestParam(required = false) OrderStatus status) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(orderService.getOrderForUser(userId, status));
    }

    //Endpoint to update order status
    @PatchMapping("/update/status/{orderId}/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long orderId,
                                                  @PathVariable OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok()
                .build();
    }

}
