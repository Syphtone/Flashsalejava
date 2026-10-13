package com.example.flashsale.dto;

public record FlashSaleResponse(
    Long productId,
    String productName,
    Integer totalStock,
    Integer remainingStock,
    String status
) {}