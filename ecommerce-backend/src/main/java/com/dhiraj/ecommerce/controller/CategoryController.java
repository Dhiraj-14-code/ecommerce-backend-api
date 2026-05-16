package com.dhiraj.ecommerce.controller;

import com.dhiraj.ecommerce.dto.CategoryRequestDTO;
import com.dhiraj.ecommerce.dto.CategoryResponseDTO;
import com.dhiraj.ecommerce.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    // Service injection
    private final CategoryService categoryService;

    // CREATE CATEGORY API
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(

            // Client ka JSON request DTO me convert hoga
            @Valid @RequestBody CategoryRequestDTO dto
    ) {

        return ResponseEntity.ok(
                categoryService.createCategory(dto)
        );
    }

    // GET ALL CATEGORIES API
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    // GET CATEGORY BY ID API
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(

            // URL se ID receive hogi
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }

    // UPDATE CATEGORY API
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(

            // URL se ID
            @PathVariable Long id,

            // Body se updated data
            @Valid @RequestBody CategoryRequestDTO dto
    ) {

        return ResponseEntity.ok(
                categoryService.updateCategory(id, dto)
        );
    }

    // DELETE CATEGORY API
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(

            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                categoryService.deleteCategory(id)
        );
    }
}