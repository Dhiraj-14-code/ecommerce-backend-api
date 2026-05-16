package com.dhiraj.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDTO {
    //Request DTO
    //→ validates client input
    @NotBlank
    private String name;

    private String description;

    @PositiveOrZero
    private BigDecimal price;

    @PositiveOrZero
    private int stock;

    private Long categoryId;


}
