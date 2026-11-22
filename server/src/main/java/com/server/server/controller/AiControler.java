package com.server.server.controller;

import com.server.server.dto.AiChatResponseDTO;
import com.server.server.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiControler {
    private final AiChatService aiChatService;


    @PostMapping("/chat")
    public ResponseEntity<AiChatResponseDTO> chat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(aiChatService.chat(request.message()));
    }

    @GetMapping("/summary/{productId}")
    public ResponseEntity<AiChatResponseDTO> getSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(aiChatService.getSummary(productId));
    }

    public record ChatRequest(String message) {
    }
}
