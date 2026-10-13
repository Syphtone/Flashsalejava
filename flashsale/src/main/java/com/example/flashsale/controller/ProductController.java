package com.example.flashsale.controller;

import com.example.flashsale.dto.FlashSaleResponse;
import com.example.flashsale.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/flash-sale")
    public FlashSaleResponse getFlashSale() {
        return productService.getActiveFlashSale();
    }
}