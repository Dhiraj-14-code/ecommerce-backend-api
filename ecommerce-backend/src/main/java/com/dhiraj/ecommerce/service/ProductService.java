package com.dhiraj.ecommerce.service;

import com.dhiraj.ecommerce.dto.ProductRequestDTO;
import com.dhiraj.ecommerce.dto.ProductResponseDTO;
import com.dhiraj.ecommerce.entity.Category;
import com.dhiraj.ecommerce.entity.Product;
import com.dhiraj.ecommerce.exception.CategoryNotFoundException;
import com.dhiraj.ecommerce.exception.ProductNotFoundException;
import com.dhiraj.ecommerce.repository.CategoryRepository;
import com.dhiraj.ecommerce.repository.CartItemRepository;
import com.dhiraj.ecommerce.repository.ProductRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class ProductService {

    // Product repository object
    private final ProductRepository productRepository;

    // Category repository object
    private final CategoryRepository categoryRepository;

    // Cart item repository object
    private final CartItemRepository cartItemRepository;

    // Constructor Injection
    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            CartItemRepository cartItemRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // CREATE PRODUCT
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {

        // Product entity object create kiya
        Product product = new Product();

        // DTO data entity me set kiya
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
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

    public List<ProductResponseDTO> createProductsBulk(List<ProductRequestDTO> dtos) {
        List<ProductResponseDTO> responseList = new ArrayList<>();
        for (ProductRequestDTO dto : dtos) {
            responseList.add(createProduct(dto));
        }
        return responseList;
    }

    public List<ProductResponseDTO> importProductsFromCsv(MultipartFile file) {
        return importProductsFromDataset(file);
    }

    public List<ProductResponseDTO> importProductsFromDataset(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Dataset file is required");
        }

        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (filename.endsWith(".ipynb")) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Jupyter notebooks are not direct product datasets. Export the data to CSV or JSON first.");
        }
        if (filename.endsWith(".json")) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "JSON files are supported by the bulk JSON API, not the dataset upload. Export to CSV or paste JSON into the bulk import box.");
        }

        List<ProductRequestDTO> requestList = parseProductsFromCsv(file);

        if (requestList.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Dataset has no data rows");
        }

        return createProductsBulk(requestList);
    }

    private List<ProductRequestDTO> parseProductsFromCsv(MultipartFile file) {
        List<ProductRequestDTO> requestList = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser csvParser = CSVFormat.DEFAULT
                     .builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setIgnoreSurroundingSpaces(true)
                     .setTrim(true)
                     .build()
                     .parse(reader)) {

            for (CSVRecord record : csvParser) {
                requestList.add(mapRecordToProduct(record::isMapped, record::get));
            }
        } catch (IllegalArgumentException | IOException e) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid CSV format");
        }
        return requestList;
    }

    private ProductRequestDTO mapRecordToProduct(MappedKeyChecker keyChecker, ValueLookup valueLookup) {
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName(limit(firstAvailable(keyChecker, valueLookup, "name", "product_name", "title", "product_title"), 500));
        dto.setDescription(limit(firstAvailable(keyChecker, valueLookup, "description", "about_product", "product_description"), 10000));
        dto.setImageUrl(limit(firstAvailable(keyChecker, valueLookup, "imageUrl", "image_url", "thumbnail", "image", "image_link"), 1000));
        dto.setPrice(parsePrice(firstAvailable(keyChecker, valueLookup, "price", "discounted_price", "actual_price", "sale_price", "selling_price", "mrp")));

        String stockValue = firstAvailable(keyChecker, valueLookup, "stock", "quantity", "qty", "inventory");
        dto.setStock(stockValue == null || stockValue.isBlank() ? 50 : Integer.parseInt(cleanNumber(stockValue)));

        String categoryIdValue = firstAvailable(keyChecker, valueLookup, "categoryId", "category_id");
        dto.setCategoryId(categoryIdValue == null || categoryIdValue.isBlank()
                ? mapCategoryToId(firstAvailable(keyChecker, valueLookup, "category", "category_name", "main_category"))
                : Long.parseLong(cleanNumber(categoryIdValue)));
        return dto;
    }

    private String firstAvailable(MappedKeyChecker keyChecker, ValueLookup valueLookup, String... keys) {
        for (String key : keys) {
            if (keyChecker.hasKey(key)) {
                String value = valueLookup.get(key);
                if (value != null && !value.isBlank()) {
                    return value.trim();
                }
            }
        }
        return null;
    }

    private BigDecimal parsePrice(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Price is required in dataset");
        }
        String cleaned = cleanNumber(raw);
        if (cleaned.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid price value in dataset");
        }
        return new BigDecimal(cleaned);
    }

    private String cleanNumber(String raw) {
        return raw.replaceAll("[^0-9.]", "");
    }

    private Long mapCategoryToId(String rawCategory) {
        if (rawCategory == null || rawCategory.isBlank()) {
            return categoryRepository.findAll()
                    .stream()
                    .findFirst()
                    .map(Category::getId)
                    .orElse(1L);
        }

        return categoryRepository.findByNameIgnoreCase(rawCategory.trim())
                .map(Category::getId)
                .orElseGet(() -> {
                    String c = rawCategory.toLowerCase();
                    if (c.contains("computer")) {
                        return categoryRepository.findByNameIgnoreCase("Computers & Accessories")
                                .map(Category::getId)
                                .orElse(1L);
                    }
                    if (c.contains("home")) {
                        return categoryRepository.findByNameIgnoreCase("Home & Kitchen")
                                .map(Category::getId)
                                .orElse(1L);
                    }
                    if (c.contains("electronic")) {
                        return categoryRepository.findByNameIgnoreCase("Electronics")
                                .map(Category::getId)
                                .orElse(1L);
                    }
                    return categoryRepository.findAll()
                            .stream()
                            .findFirst()
                            .map(Category::getId)
                            .orElse(1L);
                });
    }

    private String limit(String value, int max) {
        if (value == null) return null;
        return value.length() <= max ? value : value.substring(0, max);
    }

    @FunctionalInterface
    private interface MappedKeyChecker {
        boolean hasKey(String key);
    }

    @FunctionalInterface
    private interface ValueLookup {
        String get(String key);
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
    @Transactional
    public String deleteProduct(Long id) {

        // Product database se find kiya
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product Not Found!"
                        )
                );

        // Product cart items se unlink kiya
        cartItemRepository.deleteByProductId(id);

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
        product.setImageUrl(dto.getImageUrl());
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
        dto.setImageUrl(product.getImageUrl());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        return dto;
    }
}
