package com.server.server.service;

import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CreateAttributeRequestDTO;
import com.server.server.entity.ProductAttribute;
import com.server.server.entity.ProductAttributeValue;
import com.server.server.exception.ApiException;
import com.server.server.repository.ProductAttributeRepo;
import com.server.server.repository.ProductAttributeValueRepo;
import com.server.server.repository.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductAttributeService {
    private final ProductAttributeRepo productAttributeRepo;
    private final ProductAttributeValueRepo productAttributeValueRepo;
    private final ProductRepo productRepo;

    //Get all attributes
    @Cacheable(
            cacheNames = "attributes",
            key = "'all'"
    )
    public List<AttributeResponseDTO> getAllAttributes() {
        return productAttributeRepo.findAll()
                .stream()
                .map(this::toProductAttributeResponseDTO)
                .toList();
    }


    //Create attributes
    @Transactional
    @CacheEvict(
            cacheNames = "attributes",
            allEntries = true
    )
    public AttributeResponseDTO createAttributes(CreateAttributeRequestDTO createAttributeRequestDTO) {

        ProductAttribute productAttribute = ProductAttribute.builder()
                .name(createAttributeRequestDTO.getName())
                .build();

        productAttribute.setValues(
                createAttributeRequestDTO.getValues()
                        .stream()
                        .map(value -> ProductAttributeValue.builder()
                                .value(value)
                                .productAttribute(productAttribute)
                                .build())
                        .collect(Collectors.toSet())
        );

        ProductAttribute updatedProductAttribute = productAttributeRepo.save(productAttribute);
        return toProductAttributeResponseDTO(updatedProductAttribute);

    }


    //Update attributes
    @CacheEvict(
            cacheNames = "attributes",
            allEntries = true
    )
    public AttributeResponseDTO updateAttributeName(Long attributeId, String newName) {
        ProductAttribute productAttribute = productAttributeRepo.findById(attributeId)
                .orElseThrow(() -> new ApiException("Product attribute not found", HttpStatus.NOT_FOUND));
        productAttribute.setName(newName);

        productAttribute = productAttributeRepo.save(productAttribute);
        return toProductAttributeResponseDTO(productAttribute);
    }

    //Add attribute values
    @Transactional
    @CacheEvict(
            cacheNames = "attributes",
            allEntries = true
    )
    public Map<Long, String> addAttributeValue(Long attributeId, String value) {
        ProductAttribute productAttribute = productAttributeRepo.findById(attributeId)
                .orElseThrow(() -> new ApiException(
                        "Product attribute not found",
                        HttpStatus.NOT_FOUND
                ));

        ProductAttributeValue newValue = ProductAttributeValue.builder()
                .productAttribute(productAttribute)
                .value(value)
                .build();

        newValue = productAttributeValueRepo.save(newValue);

        return Map.of(newValue.getId(), newValue.getValue());
    }

    //Delete attribute value
    public void deleteAttributeValue(Long valueId) {
        if (!productAttributeValueRepo.existsById(valueId)) {
            throw new ApiException("Product attribute value not found", HttpStatus.NOT_FOUND);
        }
        if (productRepo.existsByProductAttributeValuesId(valueId)) {
            throw new ApiException("Product attribute value is in use", HttpStatus.BAD_REQUEST);
        }

        productAttributeValueRepo.deleteById(valueId);
    }

    //Get attribute value ids based on their names and values
    public List<Long> findAttributeValueIds(
            Map<String, List<String>> requestedAttributes
    ) {
        if (requestedAttributes == null || requestedAttributes.isEmpty()) {
            return List.of();
        }

        return requestedAttributes.entrySet()
                .stream()
                .flatMap(entry ->
                        productAttributeValueRepo
                                .findByProductAttribute_NameIgnoreCaseAndValueIn(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                                .stream()
                )
                .map(ProductAttributeValue::getId)
                .toList();
    }

    //To convert ProductAttribute entity and its values to ProductAttributeResponseDTO
    private AttributeResponseDTO toProductAttributeResponseDTO(ProductAttribute productAttribute) {
        return AttributeResponseDTO.builder()
                .id(productAttribute.getId())
                .name(productAttribute.getName())
                .values(productAttribute.getValues()
                        .stream()
                        .collect(Collectors.toMap(ProductAttributeValue::getId, ProductAttributeValue::getValue))
                )
                .build();
    }


    //Delete attribute
    public void deleteAttribute(Long attributeId) {
        if (!productAttributeRepo.existsById(attributeId)) {
            throw new ApiException("Product attribute not found", HttpStatus.NOT_FOUND);
        }
        productAttributeRepo.deleteById(attributeId);
    }
}
