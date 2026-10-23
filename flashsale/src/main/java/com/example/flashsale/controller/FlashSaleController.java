package com.example.flashsale.controller;

import com.example.flashsale.dto.PurchaseRequest;
import com.example.flashsale.dto.PurchaseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows the frontend team to hit this API from their local React/HTML servers
public class FlashSaleController {

    // This is the temporary shell to unblock the frontend team.
    // Member 2's FlashSaleEngine will be injected here later.
    @PostMapping("/buy")
    public ResponseEntity<PurchaseResponse> buy(@RequestBody PurchaseRequest request) {
        
        // Basic validation
        if (request.userId() == null || request.itemId() == null) {
            return ResponseEntity.badRequest().body(PurchaseResponse.fail("Invalid request"));
        }
        
        // Generate a fake successful order ID to satisfy the frontend UI
        String generatedOrderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return ResponseEntity.ok(PurchaseResponse.success(generatedOrderId));
    }
}