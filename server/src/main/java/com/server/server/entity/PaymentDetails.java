package com.server.server.entity;


import com.server.server.domain.PaymentMethod;
import com.server.server.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;


//
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(nullable = false, unique = true)
    private String transactionId;

    @PrePersist
    public void generateTransactionId() {
        if (transactionId == null || transactionId.isBlank()) {
            transactionId = UUID.randomUUID()
                    .toString();
        }
    }
}
