package com.server.server.service;

import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CreateProductRequestDTO;
import com.server.server.dto.ProductResponseDTO;
import com.server.server.entity.Category;
import com.server.server.entity.Product;
import com.server.server.entity.ProductAttribute;
import com.server.server.entity.ProductAttributeValue;
import com.server.server.exception.ApiException;
import com.server.server.repository.CategoryRepo;
import com.server.server.repository.ProductAttributeValueRepo;
import com.server.server.repository.ProductRepo;
import com.server.server.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final ProductAttributeValueRepo productAttributeValueRepo;
    private final CategoryRepo categoryRepo;

    //create a new product
    public ProductResponseDTO createProduct(CreateProductRequestDTO dto) {
        List<ProductAttributeValue> values = productAttributeValueRepo.findAllById(dto.getAttributeValueIds());
        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
        if (values.size() != dto.getAttributeValueIds()
                .size()) {
            throw new ApiException("One or more attribute values not found", HttpStatus.NOT_FOUND);
        }
        Set<ProductAttributeValue> attributeValues = new HashSet<>(values);
        Product newProduct = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .mrpPrice(dto.getMrpPrice())
                .discount(dto.getDiscount())
                .productAttributeValues(attributeValues)
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .imageUrls(dto.getImageUrls())
                .build();
        Product savedProduct = productRepo.save(newProduct);
        return toProductResponseDTO(savedProduct);
    }

    //Get all products
    public List<ProductResponseDTO> getAllProducts(String keyword,
                                                   Set<Long> categoryIds,

                                                   BigDecimal minPrice,
                                                   BigDecimal maxPrice,
                                                   Double minRating,
                                                   Boolean inStock,
                                                   Integer stockMin,
                                                   Integer stockMax,
                                                   Set<Long> attributeValueIds) {
        Set<Long> expandedCategoryIds = new HashSet<>();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            for (Long categoryId : categoryIds) {
                expandedCategoryIds.addAll(
                        getCategoryAndDescendantIds(categoryId)
                );
            }
        }
        List<Product> products = productRepo.findAll(ProductSpecification.keyword(keyword)
                .and(ProductSpecification.categoryIds(expandedCategoryIds))
                .and(ProductSpecification.priceRange(minPrice, maxPrice))
                .and(ProductSpecification.minimumRating(minRating))
                .and(ProductSpecification.inStock(inStock))
                .and(ProductSpecification.stockRange(stockMin, stockMax))
                .and(ProductSpecification.attributeValueIds(attributeValueIds)));

        return products.stream()
                .map(this::toProductResponseDTO)
                .collect(Collectors.toList());
    }

    //Get latest deals of products
    public List<ProductResponseDTO> getDealsOfTheDay() {
        List<Product> products = productRepo.findDeals();
        return products.stream()

                .map(this::toProductResponseDTO)
                .toList();
    }

    //Get product by productId
    public ProductResponseDTO getProductByProductId(Long productId) {
        return productRepo.findById(productId)
                .map(this::toProductResponseDTO)
                .orElse(null);
    }


    public Set<Long> getCategoryAndDescendantIds(Long categoryId) {
        List<Category> categories = categoryRepo.findAll();
        Map<Long, List<Category>> childrenMap = categories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent()
                        .getId()));
        Set<Long> categoryIds = new HashSet<>();
        collectDescendantIds(categoryId, childrenMap, categoryIds);
        return categoryIds;
    }

    public void collectDescendantIds(Long categoryId, Map<Long, List<Category>> childrenMap, Set<Long> categoryIds) {
        if (!categoryIds.add(categoryId)) {
            return;
        }
        for (Category child : childrenMap.getOrDefault(categoryId, Collections.emptyList())) {
            collectDescendantIds(child.getId(), childrenMap, categoryIds);
        }
    }

    //Convert ProductAttribute entity and its values to ProductAttributeResponseDTO
    private AttributeResponseDTO toProductAttributeResponseDTO(ProductAttribute productAttribute, List<ProductAttributeValue> values) {
        return AttributeResponseDTO.builder()
                .id(productAttribute.getId())
                .name(productAttribute.getName())
                .values(values.stream()
                        .collect(Collectors.toMap(ProductAttributeValue::getId, ProductAttributeValue::getValue)))
                .build();
    }

    //Convert Product entity to ProductResponseDTO
    public ProductResponseDTO toProductResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .mrpPrice(product.getMrpPrice())
                .discount(product.getDiscount())
                .stockQuantity(product.getStockQuantity())
                .numRatings(product.getNumRatings())
                .categoryId(product.getCategory()
                        .getId())
                .categoryName(product.getCategory()
                        .getName())
                .categoryCode(product.getCategory()
                        .getCode())
                .imageUrls(product.getImageUrls())
                .attributes(product.getProductAttributeValues()
                        .stream()
                        .collect(Collectors.groupingBy(v -> v.getProductAttribute()
                                .getId()))

                        .values()
                        .stream()
                        .map(values -> {
                            ProductAttribute attribute = values.getFirst()
                                    .getProductAttribute();

                            return toProductAttributeResponseDTO(attribute, values);
                        })
                        .toList())

                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }


}
