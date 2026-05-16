package com.dhiraj.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CategoryRequestDTO {

    // Blank name allow nahi karega
    @NotBlank(message = "Category name is required")
    private String name;
}