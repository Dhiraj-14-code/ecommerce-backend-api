package com.dhiraj.ecommerce.controller;

import com.dhiraj.ecommerce.dto.AddToCartRequestDTO;
import com.dhiraj.ecommerce.dto.CartResponseDTO;
import com.dhiraj.ecommerce.dto.UpdateCartItemRequestDTO;
import com.dhiraj.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<Map<String, String>> addToCart(
            @Valid @RequestBody AddToCartRequestDTO dto,
            Authentication authentication
    ) {
        String message = cartService.addToCart(
                authentication.getName(),
                dto.getProductId(),
                dto.getQuantity()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getMyCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getMyCart(authentication.getName()));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> updateCartItemQuantity(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequestDTO dto,
            Authentication authentication
    ) {
        String message = cartService.updateCartItemQuantity(
                authentication.getName(),
                itemId,
                dto.getQuantity()
        );
        return ResponseEntity.ok(Map.of("message", message));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Map<String, String>> removeCartItem(
            @PathVariable Long itemId,
            Authentication authentication
    ) {
        String message = cartService.removeCartItem(authentication.getName(), itemId);
        return ResponseEntity.ok(Map.of("message", message));
    }
}
