package com.example.flashsale.service;

import com.example.flashsale.dto.FlashSaleResponse;
import com.example.flashsale.entity.Product;
import com.example.flashsale.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public FlashSaleResponse getActiveFlashSale() {
        Product product = productRepository.findById(101L).orElseThrow(() -> 
            new RuntimeException("Flash sale product not found in database")
        );

        return new FlashSaleResponse(
            product.getId(),
            product.getName(),
            50, 
            product.getStock(),
            "ACTIVE"
        );
    }
}