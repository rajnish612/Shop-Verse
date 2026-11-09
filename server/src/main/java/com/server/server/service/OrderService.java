package com.server.server.service;

import com.server.server.domain.OrderStatus;
import com.server.server.domain.PaymentMethod;
import com.server.server.domain.PaymentStatus;
import com.server.server.dto.AddressResponseDTO;
import com.server.server.dto.OrderItemResponseDTO;
import com.server.server.dto.OrderResponseDTO;
import com.server.server.dto.SelectedAttributeResponseDTO;
import com.server.server.entity.*;
import com.server.server.exception.ApiException;
import com.server.server.repository.*;
import com.server.server.specification.OrderSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final AddressRepo addressRepo;
    private final UserRepo userRepo;
    private final CartRepo cartRepo;
    private final CartItemAttributeRepo cartItemAttributeRepo;
    private final OrderRepo orderRepo;

    //Endpoint to create a new order
    @Transactional
    public OrderResponseDTO createOrder(Long userId, Long addressId, PaymentMethod paymentMethod, String couponCode) {
        // 1. Fetch cart
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new ApiException(
                        "Cart not found for user id: " + userId,
                        HttpStatus.NOT_FOUND
                ));

        if (cart.getCartItems() == null || cart.getCartItems()
                .isEmpty()) {
            throw new ApiException(
                    "Cannot place an order with an empty cart",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 2. Fetch user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ApiException(
                        "User not found",
                        HttpStatus.NOT_FOUND
                ));

        // 3. Validate address ownership
        Address address = addressRepo.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ApiException(
                        "Address not found",
                        HttpStatus.NOT_FOUND
                ));

        // 4. Create shipping address snapshot
        ShippingAddress shippingAddress = ShippingAddress.builder()
                .locality(address.getLocality())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .build();

        // 5. Collect cart item IDs
        List<Long> cartItemIds = cart.getCartItems()
                .stream()
                .map(CartItem::getId)
                .toList();

        // 6. Fetch all cart item attributes in one query
        List<CartItemAttribute> cartItemAttributes =
                cartItemAttributeRepo.findByCartItemIdIn(cartItemIds);

        // 7. Group attributes by cart item ID
        Map<Long, List<CartItemAttribute>> attributesByCartItem =
                cartItemAttributes.stream()
                        .collect(Collectors.groupingBy(
                                attribute -> attribute.getCartItem()
                                        .getId()
                        ));

        // 8. Initialize order
        LocalDateTime now = LocalDateTime.now();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .orderDate(now)
                .deliveryDate(now.plusDays(7))
                .orderStatus(OrderStatus.CONFIRMED)
                .build();

        Set<OrderItem> orderItems = new HashSet<>();

        BigDecimal totalPrice = BigDecimal.ZERO;

        // 9. Process each cart item
        for (CartItem cartItem : cart.getCartItems()) {

            Product product = cartItem.getProduct();

            int quantity = cartItem.getQuantity();

            // Validate quantity
            if (quantity <= 0) {
                throw new ApiException(
                        "Invalid product quantity",
                        HttpStatus.BAD_REQUEST
                );
            }

            // Validate stock
            if (quantity > product.getStockQuantity()) {
                throw new ApiException(
                        "Insufficient stock for product: " + product.getName(),
                        HttpStatus.BAD_REQUEST
                );
            }

            /*
             * Calculate unit price.
             *
             * ASSUMPTION:
             * Product has mrpPrice and discount fields.
             * Change these getters if your Product entity differs.
             */
            BigDecimal mrpPrice = product.getMrpPrice();

            BigDecimal discount = product.getDiscount();

            BigDecimal discountAmount = mrpPrice
                    .multiply(discount)
                    .divide(
                            BigDecimal.valueOf(100),
                            2,
                            java.math.RoundingMode.HALF_UP
                    );

            BigDecimal unitPrice = mrpPrice.subtract(discountAmount);

            BigDecimal itemTotal = unitPrice.multiply(
                    BigDecimal.valueOf(quantity)
            );

            totalPrice = totalPrice.add(itemTotal);

            // 10. Get attributes for this cart item
            List<CartItemAttribute> attributes =
                    attributesByCartItem.getOrDefault(
                            cartItem.getId(),
                            Collections.emptyList()
                    );

            // Extract selected ProductAttributeValue entities
            List<ProductAttributeValue> selectedAttributes =
                    attributes.stream()
                            .map(CartItemAttribute::getAttributeValue)
                            .toList();

            // 11. Create OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .selectedAttributes(
                            new ArrayList<>(selectedAttributes)
                    )
                    .build();

            orderItems.add(orderItem);

            // 12. Reduce stock
            product.setStockQuantity(
                    product.getStockQuantity() - quantity
            );
        }

        // 13. Attach order items
        order.setOrderItems(orderItems);

        // 14. Set total
        order.setTotalPrice(totalPrice);

        /*
         * 15. Initialize payment details.
         *
         * Adapt this to your actual PaymentDetails class.
         */
        PaymentDetails paymentDetails = PaymentDetails.builder()
                .paymentMethod(paymentMethod)
                .build();

        order.setPaymentDetails(paymentDetails);

        // 16. Save order
        Order savedOrder = orderRepo.save(order);

        // 17. Clear cart
        cart.getCartItems()
                .clear();

        cartRepo.save(cart);

        // 18. Return response
        return mapToOrderResponseDTO(savedOrder);
    }

    //Method to fetch all orders for user
    public List<OrderResponseDTO> getOrderForUser(Long userId, OrderStatus status) {

        Specification<Order> spec = OrderSpecification.hasUserId(userId)
                .and(OrderSpecification.hasStatus(status));

        return orderRepo.findAll(spec, Sort.by(Sort.Direction.DESC, "orderDate"))
                .stream()
                .map(this::mapToOrderResponseDTO)
                .toList();
    }

    //Method to get all orders for admin with optional keyword and status filters
    public List<OrderResponseDTO> getOrdersForAdmin(String keyword, OrderStatus status) {
        Specification<Order> specification =
                OrderSpecification.search(keyword)
                        .and(OrderSpecification.hasStatus(status));

        return orderRepo.findAll(specification)
                .stream()
                .map(this::mapToOrderResponseDTO)
                .toList();
    }

    //Method to update order status
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));
        order.setOrderStatus(status);
        orderRepo.save(order);
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        Set<OrderItemResponseDTO> orderItems = order.getOrderItems()
                .stream()
                .map(item -> {

                    List<SelectedAttributeResponseDTO> selectedAttributes =
                            item.getSelectedAttributes()
                                    .stream()
                                    .map(attributeValue -> SelectedAttributeResponseDTO.builder()
                                            .id(attributeValue.getId())
                                            .name(attributeValue.getProductAttribute()
                                                    .getName())
                                            .value(attributeValue.getValue())
                                            .build()
                                    )
                                    .toList();

                    return OrderItemResponseDTO.builder()
                            .id(item.getId())
                            .productId(item.getProduct()
                                    .getId())
                            .productName(item.getProduct()
                                    .getName())
                            .imageUrl(
                                    item.getProduct()
                                            .getImageUrls()
                                            .isEmpty()
                                            ? null
                                            : item.getProduct()
                                            .getImageUrls()
                                            .getFirst()
                            )
                            .quantity(item.getQuantity())
                            .unitPrice(item.getUnitPrice())
                            .selectedAttributes(selectedAttributes)
                            .build();
                })
                .collect(Collectors.toSet());

        ShippingAddress shippingAddress = order.getShippingAddress();

        AddressResponseDTO addressDTO = AddressResponseDTO.builder()
                .locality(shippingAddress.getLocality())
                .city(shippingAddress.getCity())
                .state(shippingAddress.getState())
                .zipCode(shippingAddress.getZipCode())
                .country(shippingAddress.getCountry())
                .build();

        PaymentDetails paymentDetails = order.getPaymentDetails();

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUser()
                        .getId())
                .userName(order.getUser()
                        .getName())
                .userEmail(order.getUser()
                        .getEmail())
                .orderStatus(order.getOrderStatus())
                .orderDate(order.getOrderDate())
                .deliveryDate(order.getDeliveryDate())
                .shippingAddress(addressDTO)
                .paymentMethod(paymentDetails.getPaymentMethod())
                .paymentStatus(paymentDetails.getPaymentStatus())
                .paymentTransactionId(paymentDetails.getTransactionId())
                .orderItems(orderItems)
                .totalPrice(order.getTotalPrice())
                .build();
    }


}