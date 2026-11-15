package com.server.server.service;

import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CreateProductRequestDTO;
import com.server.server.dto.ProductResponseDTO;
import com.server.server.dto.UpdateProductRequestDTO;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    //Update product details
    @CacheEvict(
            cacheNames = "productDetails",
            key = "#p0"
    )
    public ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO product) {
        Product existingProduct = productRepo.findById(productId)
                .orElseThrow(() -> new ApiException("Product not found", HttpStatus.NOT_FOUND));

        return updateProductDetails(existingProduct, product);
    }

    //Get all products
    public Page<ProductResponseDTO> getAllProducts(String keyword,
                                                   Set<Long> categoryIds,

                                                   BigDecimal minPrice,
                                                   BigDecimal maxPrice,
                                                   Double minRating,
                                                   Boolean inStock,
                                                   Integer stockMin,
                                                   Integer stockMax,
                                                   Set<Long> attributeValueIds, Pageable pageable) {
        Set<Long> expandedCategoryIds = new HashSet<>();
        if (categoryIds != null && !categoryIds.isEmpty()) {
            for (Long categoryId : categoryIds) {
                expandedCategoryIds.addAll(
                        getCategoryAndDescendantIds(categoryId)
                );
            }
        }
        Page<Product> products = productRepo.findAll(ProductSpecification.keyword(keyword)
                .and(ProductSpecification.categoryIds(expandedCategoryIds))
                .and(ProductSpecification.priceRange(minPrice, maxPrice))
                .and(ProductSpecification.minimumRating(minRating))
                .and(ProductSpecification.inStock(inStock))
                .and(ProductSpecification.stockRange(stockMin, stockMax))
                .and(ProductSpecification.attributeValueIds(attributeValueIds)), pageable);

        return products
                .map(this::toProductResponseDTO);

    }

    //Get latest deals of products
    public List<ProductResponseDTO> getDealsOfTheDay() {
        List<Product> products = productRepo.findDeals();
        return products.stream()

                .map(this::toProductResponseDTO)
                .toList();
    }

    //Get product by productId
    @Cacheable(
            cacheNames = "productDetails",
            key = "#p0"
    )
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

    //Update product details
    private ProductResponseDTO updateProductDetails(Product existingProduct, UpdateProductRequestDTO product) {
        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getCategoryId() != null) {
            Category category = categoryRepo.findById(product.getCategoryId())
                    .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
            existingProduct.setCategory(category);
        }
        if (product.getMrpPrice() != null) {
            existingProduct.setMrpPrice(product.getMrpPrice());
        }

        if (product.getDiscount() != null) {
            existingProduct.setDiscount(product.getDiscount());
        }
        if (product.getStockQuantity() != null) {
            existingProduct.setStockQuantity(product.getStockQuantity());
        }
        if (product.getImageUrls() != null) {
            existingProduct.setImageUrls(product.getImageUrls());
        }
        if (product.getAttributeValueIds() != null) {
            List<ProductAttributeValue> values = productAttributeValueRepo.findAllById(product.getAttributeValueIds());
            if (values.size() != product.getAttributeValueIds()
                    .size()) {
                throw new ApiException("One or more attribute values not found", HttpStatus.NOT_FOUND);
            }
            Set<ProductAttributeValue> attributeValues = new HashSet<>(values);
            existingProduct.setProductAttributeValues(attributeValues);
        }

        productRepo.save(existingProduct);
        return toProductResponseDTO(existingProduct);
    }
}
