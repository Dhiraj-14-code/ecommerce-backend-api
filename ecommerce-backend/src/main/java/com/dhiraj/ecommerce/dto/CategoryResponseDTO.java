package com.dhiraj.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CategoryResponseDTO {

    // Database generated ID
    private Long id;

    // Category name response me bhejenge
    private String name;
}