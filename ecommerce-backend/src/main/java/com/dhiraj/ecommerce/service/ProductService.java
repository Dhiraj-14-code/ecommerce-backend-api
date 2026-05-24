package com.dhiraj.ecommerce.service;

import com.dhiraj.ecommerce.dto.ProductRequestDTO;
import com.dhiraj.ecommerce.dto.ProductResponseDTO;
import com.dhiraj.ecommerce.entity.Category;
import com.dhiraj.ecommerce.entity.Product;
import com.dhiraj.ecommerce.exception.CategoryNotFoundException;
import com.dhiraj.ecommerce.exception.ProductNotFoundException;
import com.dhiraj.ecommerce.repository.CategoryRepository;
import com.dhiraj.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    // Product repository object
    private final ProductRepository productRepository;

    // Category repository object
    private final CategoryRepository categoryRepository;

    // Constructor Injection
    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // CREATE PRODUCT
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {

        // Product entity object create kiya
        Product product = new Product();

        // DTO data entity me set kiya
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        // Category database se fetch ki
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found"));

        // Product me category set ki
        product.setCategory(category);

        // Product database me save kiya
        Product savedProduct = productRepository.save(product);

        // Saved entity ko DTO me convert karke return kiya
        return mapToDTO(savedProduct);
    }

    // GET ALL PRODUCTS WITH PAGINATION + SORTING
// GET ALL PRODUCTS WITH PAGINATION + DYNAMIC SORTING
    public List<ProductResponseDTO> getAllProducts(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        // Sort object create karenge
        Sort sort;

        // Agar sortDir = desc hai
        // to descending sorting apply hogi
        if (sortDir.equalsIgnoreCase("desc")) {

            sort = Sort.by(sortBy).descending();

        } else {

            // Otherwise ascending sorting
            sort = Sort.by(sortBy).ascending();
        }

        // Pageable object create kiya
        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        // Database se paginated + sorted data fetch kiya
        Page<Product> productPage =
                productRepository.findAll(pageable);

        // Actual product list nikali
        List<Product> products =
                productPage.getContent();

        // Response DTO list create ki
        List<ProductResponseDTO> responseList =
                new ArrayList<>();

        // Har product ko DTO me convert kiya
        for (Product product : products) {

            responseList.add(mapToDTO(product));
        }

        return responseList;
    }
    // GET PRODUCT BY ID
    public ProductResponseDTO getProductById(Long id) {

        // Product database se find kiya
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product Not Found!"
                        )
                );

        // Entity ko DTO me convert karke return kiya
        return mapToDTO(product);
    }

    // DELETE PRODUCT
    public String deleteProduct(Long id) {

        // Product database se find kiya
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product Not Found!"
                        )
                );

        // Product delete kiya
        productRepository.delete(product);

        return "Product deleted successfully";
    }

    // UPDATE PRODUCT
    public ProductResponseDTO updateProduct(
            long id,
            ProductRequestDTO dto
    ) {

        // Existing product database se fetch kiya
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product Not Found!"
                        )
                );

        // Updated values set ki
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        // Updated product save kiya
        Product updatedProduct =
                productRepository.save(product);

        // Updated entity ko DTO me convert karke return kiya
        return mapToDTO(updatedProduct);
    }

    // SEARCH PRODUCTS BY NAME
    public List<ProductResponseDTO> searchProductsByName(
            String name
    ) {

        // Matching products database se fetch kiye
        List<Product> products =
                productRepository.findByNameContainingIgnoreCase(name);

        // Response DTO list create ki
        List<ProductResponseDTO> responseList =
                new ArrayList<>();

        // Har product ko DTO me convert kiya
        for (Product product : products) {

            responseList.add(mapToDTO(product));
        }

        return responseList;
    }
    //Filter
    public List<ProductResponseDTO> filterProductsByPrice(
            BigDecimal min,
            BigDecimal max
    ){
        List<Product> products = productRepository.findByPriceBetween(min,max);

        List<ProductResponseDTO> responseList = new ArrayList<>();
        // Har product ko DTO me convert kiya
        for (Product product : products) {

            responseList.add(mapToDTO(product));
        }

        return responseList;

    }

    // COMMON MAPPER METHOD
    // Product entity ko DTO me convert karega
    private ProductResponseDTO mapToDTO(Product product) {

        ProductResponseDTO dto =
                new ProductResponseDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());

        return dto;
    }
}
