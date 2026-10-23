package com.example.flashsale.dto;

public record PurchaseRequest(
    String userId,
    Long itemId
) {}
