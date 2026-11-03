package com.server.server.controller;

import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CreateAttributeRequestDTO;
import com.server.server.service.ProductAttributeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {
    private final ProductAttributeService productAttributeService;

    //Fetch all  attributes
    @GetMapping("/all")
    public ResponseEntity<List<AttributeResponseDTO>> getAllProductAttributes() {
        return ResponseEntity.ok(productAttributeService.getAllAttributes());
    }

    //Endpoint for creating a new product attribute
    @PostMapping("/create")
    public ResponseEntity<AttributeResponseDTO> createProductAttribute(@RequestBody CreateAttributeRequestDTO dto) {
        // Implementation for creating a product attribute will go here
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productAttributeService.createAttributes(dto));
    }

    //Endpoint for updating an existing product attribute
    @PatchMapping("/update/attribute-name/{attributeId}")
    public ResponseEntity<AttributeResponseDTO> updateProductAttributeName(@PathVariable Long attributeId, @RequestParam String name) {
        // Implementation for creating a product attribute will go here
        return ResponseEntity.status(HttpStatus.OK)
                .body(productAttributeService.updateAttributeName(attributeId, name));
    }


    //Endpoint for adding a new attribute value to an existing product attribute
    @PutMapping("/add/attribute-value/{attributeId}")
    public ResponseEntity<Map<Long, String>> addProductAttributeValue(@PathVariable Long attributeId, @RequestParam String value) {
        // Implementation for creating a product attribute will go here
        return ResponseEntity.status(HttpStatus.OK)
                .body(productAttributeService.addAttributeValue(attributeId, value));
    }


    //Endpoint to remove attribute values from an existing product attribute
    @DeleteMapping("/delete/attribute-value/{valueId}")
    public ResponseEntity<Void> deleteAttributeValues(@PathVariable Long valueId
    ) {
        productAttributeService.deleteAttributeValue(valueId);
        return ResponseEntity.noContent()
                .build();
    }

    //Endpoint for deleting a product attribute
    @DeleteMapping("/delete/attribute/{attributeId}")
    public ResponseEntity<Void> deleteProductAttribute(@PathVariable Long attributeId) {
        productAttributeService.deleteAttribute(attributeId);
        return ResponseEntity.noContent()
                .build();

    }


}
