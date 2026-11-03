package com.server.server.controller;

import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CreateProductRequestDTO;
import com.server.server.dto.ProductResponseDTO;
import com.server.server.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    //Create product endpoint
    @PostMapping("/create")
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody CreateProductRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(dto));
    }

    //Fetch all products endpoint
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(@RequestParam(required = false) String keyword,
                                                                   @RequestParam(required = false) Long categoryId,
                                                                   @RequestParam(required = false) Set<Long> categoryIds,

                                                                   @RequestParam(required = false) BigDecimal minPrice,
                                                                   @RequestParam(required = false) BigDecimal maxPrice,
                                                                   @RequestParam(required = false) Double minRating,
                                                                   @RequestParam(required = false) Boolean inStock,
                                                                   @RequestParam(required = false) Integer stockMin,
                                                                   @RequestParam(required = false) Integer stockMax,
                                                                   @RequestParam(required = false) Set<Long> attributeValueIds) {
        return ResponseEntity.ok(productService.getAllProducts(keyword, categoryIds,minPrice, maxPrice,
                minRating, inStock, stockMin, stockMax, attributeValueIds));
    }
}
