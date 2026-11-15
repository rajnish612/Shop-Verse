package com.server.server.service;

import com.server.server.dto.AddProductToCartRequestDTO;
import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CartItemResponseDTO;
import com.server.server.entity.*;
import com.server.server.exception.ApiException;
import com.server.server.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ProductRepo productRepo;
    private final ProductAttributeRepo productAttributeRepo;
    private final ProductAttributeValueRepo productAttributeValueRepo;
    private final UserRepo userRepo;

    @Transactional
    public CartItemResponseDTO addToCart(
            AddProductToCartRequestDTO dto,
            Long userId
    ) {

        // 1. Fetch user
        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new ApiException("User not found", HttpStatus.NOT_FOUND)
                );

        // 2. Fetch existing cart or create a new one
        Cart cart = cartRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepo.save(newCart);
                });

        // 3. Fetch product
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() ->
                        new ApiException("Product not found", HttpStatus.NOT_FOUND)
                );

        // 4. Validate quantity
        if (dto.getQuantity() == null || dto.getQuantity() < 1) {
            throw new ApiException("Quantity must be at least 1", HttpStatus.BAD_REQUEST);
        }

        // 5. Collect attribute and attribute-value IDs
        Map<Long, Long> requestedAttributes = dto.getSelectedAttributes();

        if (requestedAttributes == null) {
            requestedAttributes = Collections.emptyMap();
        }

        List<Long> attributeIds = new ArrayList<>(requestedAttributes.keySet());
        List<Long> attributeValueIds = new ArrayList<>(requestedAttributes.values());

        // 6. Fetch attributes and values in batches
        List<ProductAttribute> productAttributes =
                productAttributeRepo.findAllById(attributeIds);

        List<ProductAttributeValue> productAttributeValues =
                productAttributeValueRepo.findAllById(attributeValueIds);

        if (productAttributes.size() != attributeIds.size()
                || productAttributeValues.size() != attributeValueIds.size()) {

            throw new ApiException(
                    "Invalid attribute or attribute value",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 7. Convert fetched entities into maps
        Map<Long, ProductAttribute> attributeMap = productAttributes.stream()
                .collect(Collectors.toMap(
                        ProductAttribute::getId,
                        Function.identity()
                ));

        Map<Long, ProductAttributeValue> valueMap = productAttributeValues.stream()
                .collect(Collectors.toMap(
                        ProductAttributeValue::getId,
                        Function.identity()
                ));

        // 8. Validate attribute-value relationships and product ownership
        // Assumption: Product has a collection named attributeValues.
        Set<Long> productValueIds = product.getProductAttributeValues()
                .stream()
                .map(ProductAttributeValue::getId)
                .collect(Collectors.toSet());

        for (Map.Entry<Long, Long> entry : requestedAttributes.entrySet()) {

            ProductAttribute attribute = attributeMap.get(entry.getKey());
            ProductAttributeValue value = valueMap.get(entry.getValue());

            if (!value.getProductAttribute()
                    .getId()
                    .equals(attribute.getId())) {
                throw new ApiException(
                        "Attribute value does not belong to the selected attribute",
                        HttpStatus.BAD_REQUEST
                );
            }

            if (!productValueIds.contains(value.getId())) {
                throw new ApiException(
                        "Attribute value does not belong to this product",
                        HttpStatus.BAD_REQUEST
                );
            }
        }

        // 9. Generate configuration key
        String configurationKey = requestedAttributes.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + ":" + entry.getValue())
                .collect(Collectors.joining("_"));

        // 10. Find existing cart item with same product and configuration
        Optional<CartItem> existingItem =
                cartItemRepo.findByCartIdAndProductIdAndConfigurationKey(
                        cart.getId(),
                        product.getId(),
                        configurationKey
                );

        if (existingItem.isPresent()) {

            CartItem item = existingItem.get();

            int updatedQuantity = item.getQuantity() + dto.getQuantity();

            if (updatedQuantity > product.getStockQuantity()) {
                throw new ApiException(
                        "Insufficient stock",
                        HttpStatus.BAD_REQUEST
                );
            }

            item.setQuantity(updatedQuantity);

            return mapToCartItemResponse(item);
        } else {

            // 11. Validate stock for new cart item
            if (dto.getQuantity() > product.getStockQuantity()) {
                throw new ApiException(
                        "Insufficient stock",
                        HttpStatus.BAD_REQUEST
                );
            }

            // 12. Create new cart item
            CartItem cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(dto.getQuantity());
            cartItem.setConfigurationKey(configurationKey);

            // 13. Create selected attribute relationships
            for (Map.Entry<Long, Long> entry : requestedAttributes.entrySet()) {

                CartItemAttribute itemAttribute = new CartItemAttribute();

                itemAttribute.setCartItem(cartItem);
                itemAttribute.setAttribute(attributeMap.get(entry.getKey()));
                itemAttribute.setAttributeValue(valueMap.get(entry.getValue()));

                cartItem.getSelectedAttributes()
                        .add(itemAttribute);
            }

            CartItem savedItem = cartItemRepo.save(cartItem);
            // 14. Return all cart items
            return mapToCartItemResponse(savedItem);
        }

    }

    @Transactional
    public CartItemResponseDTO increaseQuantity(Long cartItemId, Long userId) {

        CartItem cartItem = cartItemRepo
                .findByIdAndCartUserId(cartItemId, userId)
                .orElseThrow(() ->
                        new ApiException(
                                "Cart item not found",
                                HttpStatus.NOT_FOUND

                        )
                );

        Product product = cartItem.getProduct();

        int newQuantity = cartItem.getQuantity() + 1;

        // Check available stock
        if (newQuantity > product.getStockQuantity()) {
            throw new ApiException(

                    "Insufficient stock available",
                    HttpStatus.CONFLICT
            );
        }

        cartItem.setQuantity(newQuantity);

        cartItemRepo.save(cartItem);

        return mapToCartItemResponse(cartItem);
    }


    //Decrease quantity of a cart item
    @Transactional
    public CartItemResponseDTO decreaseQuantity(Long cartItemId, Long userId) {

        CartItem cartItem = cartItemRepo
                .findByIdAndCartUserId(cartItemId, userId)
                .orElseThrow(() ->
                        new ApiException(
                                "Cart item not found",
                                HttpStatus.NOT_FOUND
                        )
                );

        if (cartItem.getQuantity() <= 1) {
            throw new ApiException(
                    "Quantity cannot be less than 1",
                    HttpStatus.BAD_REQUEST
            );
        }

        cartItem.setQuantity(cartItem.getQuantity() - 1);

        return mapToCartItemResponse(cartItem);
    }

    //Get all cart items
    public List<CartItemResponseDTO> getCartItems(Long userId) {

        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new ApiException(
                        "Cart not found",
                        HttpStatus.NOT_FOUND
                ));

        List<CartItem> items = cartItemRepo.findAllByCartId(cart.getId());

        return items.stream()
                .map(this::mapToCartItemResponse)
                .toList();
    }


    //Map CartItem entity to CartItemResponseDTO
    private CartItemResponseDTO mapToCartItemResponse(CartItem item) {

        return CartItemResponseDTO.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct()
                        .getId())
                .productName(item.getProduct()
                        .getName())
                .imageUrls(item.getProduct()
                        .getImageUrls())
                .price(item.getProduct()
                        .getMrpPrice())
                .discount(item.getProduct()
                        .getDiscount())
                .quantity(item.getQuantity())
                .configurationKey(item.getConfigurationKey())
                .selectedAttributes(
                        item.getSelectedAttributes()
                                .stream()
                                .map(attr -> AttributeResponseDTO.builder()
                                        .id(attr.getAttribute()
                                                .getId())
                                        .name(attr.getAttribute()
                                                .getName())
                                        .values(Map.of(
                                                attr.getAttributeValue()
                                                        .getId(),
                                                attr.getAttributeValue()
                                                        .getValue()
                                        ))
                                        .build()
                                )
                                .toList()
                )
                .build();
    }


}
