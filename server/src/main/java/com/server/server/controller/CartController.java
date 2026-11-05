package com.server.server.controller;


import com.server.server.dto.AddProductToCartRequestDTO;
import com.server.server.dto.CartItemResponseDTO;
import com.server.server.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    //Add product to cart
    @PostMapping("/add")
    public ResponseEntity<CartItemResponseDTO> addToCart(@RequestBody AddProductToCartRequestDTO dto, @RequestParam Long userId) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cartService.addToCart(dto, userId));
    }


    //Get all cart items for a user
    @GetMapping("/items/{userId}")
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }
}
