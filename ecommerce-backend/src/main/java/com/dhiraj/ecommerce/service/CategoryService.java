package com.dhiraj.ecommerce.service;

import com.dhiraj.ecommerce.dto.CategoryRequestDTO;
import com.dhiraj.ecommerce.dto.CategoryResponseDTO;
import com.dhiraj.ecommerce.entity.Category;
import com.dhiraj.ecommerce.exception.CategoryNotFoundException;
import com.dhiraj.ecommerce.repository.CategoryRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@Service
public class CategoryService {

    // Repository injection
    private final CategoryRepository categoryRepository;

    // Constructor Injection
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // CREATE CATEGORY
    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {

        // Entity object create kiya
        Category category = new Category();

        // DTO se data entity me set kiya
        category.setName(dto.getName());

        // Database me save kiya
        Category savedCategory = categoryRepository.save(category);

        // Response DTO create kiya
        CategoryResponseDTO response = new CategoryResponseDTO();

        // Saved entity ka data response me bheja
        response.setId(savedCategory.getId());
        response.setName(savedCategory.getName());

        return response;
    }

    // GET ALL CATEGORIES
    public List<CategoryResponseDTO> getAllCategories() {

        // Database se sab categories fetch ki
        List<Category> categories = categoryRepository.findAll();

        // Response list create ki
        List<CategoryResponseDTO> responseList = new ArrayList<>();

        // Har category ko DTO me convert karenge
        for (Category category : categories) {

            CategoryResponseDTO dto = new CategoryResponseDTO();

            dto.setId(category.getId());
            dto.setName(category.getName());

            // DTO list me add kiya
            responseList.add(dto);
        }

        return responseList;
    }

    // GET CATEGORY BY ID
    public CategoryResponseDTO getCategoryById(Long id) {

        // ID se category find ki
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found")
                );

        // Response DTO create kiya
        CategoryResponseDTO dto = new CategoryResponseDTO();

        dto.setId(category.getId());
        dto.setName(category.getName());

        return dto;
    }

    // UPDATE CATEGORY
    public CategoryResponseDTO updateCategory(
            Long id,
            CategoryRequestDTO dto
    ) {

        // Existing category fetch ki
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found")
                );

        // Updated value set ki
        category.setName(dto.getName());

        // Updated category save ki
        Category updatedCategory = categoryRepository.save(category);

        // Response DTO create kiya
        CategoryResponseDTO response = new CategoryResponseDTO();

        response.setId(updatedCategory.getId());
        response.setName(updatedCategory.getName());

        return response;
    }

    // DELETE CATEGORY
    public String deleteCategory(Long id) {

        // Category find ki
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found")
                );

        // Delete ki
        categoryRepository.delete(category);

        return "Category deleted successfully";
    }
}
