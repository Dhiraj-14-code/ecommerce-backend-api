package com.dhiraj.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CartResponseDTO {
    private Long cartId;
    private String userEmail;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalAmount;
}
