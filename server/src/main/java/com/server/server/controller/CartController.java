package com.server.server.controller;


import com.server.server.dto.AddProductToCartRequestDTO;
import com.server.server.dto.CartItemResponseDTO;
import com.server.server.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    //Add product to cart
    @PostMapping("/add")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CartItemResponseDTO> addToCart(@RequestBody AddProductToCartRequestDTO dto, @AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cartService.addToCart(dto, userId));
    }


    //Get all cart items for a user
    @GetMapping("/items")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    //Endpoint Increase quantity of a cart item
    @PatchMapping("/items/{cartItemId}/increase")
    public ResponseEntity<CartItemResponseDTO> increaseQuantity(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal Jwt jwt) {

        Long userId = jwt.getClaim("userId");

        return ResponseEntity.ok(
                cartService.increaseQuantity(cartItemId, userId)
        );
    }

    //Endpoint Decrease quantity of a cart item
    @PatchMapping("/items/{cartItemId}/decrease")
    public ResponseEntity<CartItemResponseDTO> decreaseQuantity(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal Jwt jwt) {

        Long userId = jwt.getClaim("userId");

        return ResponseEntity.ok(
                cartService.decreaseQuantity(cartItemId, userId)
        );
    }
}
