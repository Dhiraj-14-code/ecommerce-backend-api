package com.dhiraj.ecommerce.controller;


import com.dhiraj.ecommerce.dto.ProductRequestDTO;
import com.dhiraj.ecommerce.dto.ProductResponseDTO;
import com.dhiraj.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
           @Valid @RequestBody  ProductRequestDTO dto
            ){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                productService.createProduct(dto)
        );
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ProductResponseDTO>> createProductsBulk(
            @RequestBody List<@Valid ProductRequestDTO> dtos
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                productService.createProductsBulk(dtos)
        );
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<List<ProductResponseDTO>> uploadProductsCsv(
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                productService.importProductsFromCsv(file)
        );
    }

    @PostMapping("/upload-dataset")
    public ResponseEntity<List<ProductResponseDTO>> uploadProductsDataset(
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                productService.importProductsFromDataset(file)
        );
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts(

            // Page number
            @RequestParam int page,

            // Kitne records ek page me chahiye
            @RequestParam int size,

            // Kis field pe sorting karni hai
            @RequestParam String sortBy,

            // Ascending ya descending
            @RequestParam String sortDir
    ) {

        return ResponseEntity.ok(

                productService.getAllProducts(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }
    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDTO>> filterProductsByPrice(
          @RequestParam   BigDecimal min,
           @RequestParam BigDecimal max
    ){
        return ResponseEntity.ok(
                productService.filterProductsByPrice(min, max)
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable long id){
        return ResponseEntity.ok(
                productService.deleteProduct(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable  Long id ,
            @Valid @RequestBody ProductRequestDTO dto
    ){
        return ResponseEntity.ok(
                productService.updateProduct(id,dto)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProductsByName(
            @RequestParam String name
    ){
        return ResponseEntity.ok(
                productService.searchProductsByName(name)
        );
    }
}
