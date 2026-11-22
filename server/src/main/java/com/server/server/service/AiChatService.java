package com.server.server.service;

import com.server.server.dto.AiChatResponseDTO;
import com.server.server.dto.ProductResponseDTO;
import com.server.server.tools.AiCategoryTools;
import com.server.server.tools.AiProductTools;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class AiChatService {
    private final AiProductTools aiProductTools;
    private final ProductService productService;
    private final ChatClient chatClient;


    public AiChatResponseDTO chat(String message) {

        AtomicReference<List<ProductResponseDTO>> productResults =
                new AtomicReference<>(List.of());
        String aiMessage = chatClient.prompt()
                .system("""
                        You are an AI shopping assistant for an ecommerce store.
                        
                        Rules:
                        1. When a user asks to find, search, recommend, or browse products,
                           you MUST call the searchProducts tool.
                        2. Never ask the user what category they want if they have
                           already provided a product keyword.
                        3. Only recommend products returned by the tool.
                        4. Never invent product names, prices, or stock quantities.
                        5. If no products are found, clearly say that no matching
                           products are currently available.
                        6. Be conversational and concise.
                        """)
                .user(message)
                .tools(
                        aiProductTools

                )
                .toolContext(Map.of("productResults", productResults))
                .call()
                .content();
        return AiChatResponseDTO.builder()
                .message(aiMessage)
                .products(productResults.get())
                .build();
    }

    //To generate summary of product
    public AiChatResponseDTO getSummary(Long productId) {

        ProductResponseDTO product =
                productService.getProductByProductId(productId);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        String summary = chatClient.prompt()
                .system("""
                        You are an AI ecommerce product analyst.
                        
                        Generate a helpful and easy-to-understand summary
                        of the product using only the information provided.
                        
                        Rules:
                        1. Explain the product's key features.
                        2. Include its specifications and attributes when available.
                        3. Mention its price and discount.
                        4. Mention stock availability.
                        5. Never invent or assume missing information.
                        6. If a detail is unavailable, simply omit it.
                        7. Keep the summary clear, conversational, and concise.
                        """)
                .user("""
                        Summarize this product using the following database information:
                        
                        %s
                        """.formatted(product))
                .call()
                .content();

        return AiChatResponseDTO.builder()
                .message(summary)
                .products(List.of(product))
                .build();
    }
}
