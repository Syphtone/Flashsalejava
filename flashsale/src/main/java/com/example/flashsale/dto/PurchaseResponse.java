package com.example.flashsale.dto;

public record PurchaseResponse(
    String status,
    String message,
    String orderId
) {
    public static PurchaseResponse success(String orderId) {
        return new PurchaseResponse("SUCCESS", "Order placed successfully.", orderId);
    }

    public static PurchaseResponse fail(String message) {
        return new PurchaseResponse("FAILED", message, null);
    }
}