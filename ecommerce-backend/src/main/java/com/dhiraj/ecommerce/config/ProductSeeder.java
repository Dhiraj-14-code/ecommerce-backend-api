package com.dhiraj.ecommerce.config;

import com.dhiraj.ecommerce.entity.Category;
import com.dhiraj.ecommerce.entity.Product;
import com.dhiraj.ecommerce.repository.CategoryRepository;
import com.dhiraj.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(2)
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            return;
        }

        Category electronicsCategory = findCategory(categories, "Electronics");
        Category computersCategory = findCategory(categories, "Computers & Accessories");
        Category homeCategory = findCategory(categories, "Home & Kitchen");
        Category fashionCategory = findCategory(categories, "Men's Fashion");
        Category sportsCategory = findCategory(categories, "Sports & Fitness");

        List<Product> products = new ArrayList<>();
        products.add(build("Wireless Earbuds", "Noise isolating bluetooth earbuds", image("electronics"), new BigDecimal("2499"), 40, electronicsCategory));
        products.add(build("USB-C Cable Pack", "Fast charging braided cable set", image("computers"), new BigDecimal("699"), 70, computersCategory));
        products.add(build("Laptop Backpack", "Water-resistant office backpack", image("computers"), new BigDecimal("1299"), 35, computersCategory));
        products.add(build("Mechanical Keyboard", "RGB gaming keyboard", image("computers"), new BigDecimal("3999"), 20, computersCategory));
        products.add(build("Air Fryer", "Healthy cooking kitchen appliance", image("home"), new BigDecimal("4999"), 18, homeCategory));
        products.add(build("Cotton T-Shirt", "Breathable daily wear tee", image("fashion"), new BigDecimal("799"), 80, fashionCategory));
        products.add(build("Denim Jeans", "Regular fit denim jeans", image("fashion"), new BigDecimal("1499"), 45, fashionCategory));
        products.add(build("Running Shoes", "Lightweight performance running shoes", image("shoes"), new BigDecimal("2999"), 28, findCategory(categories, "Shoes")));
        products.add(build("Yoga Mat", "Non-slip fitness mat", image("sports"), new BigDecimal("999"), 50, sportsCategory));
        products.add(build("Smart Watch", "Fitness tracking smart watch", image("electronics"), new BigDecimal("4999"), 25, electronicsCategory));

        productRepository.saveAll(products);
    }

    private Category findCategory(List<Category> categories, String name) {
        return categories.stream()
                .filter(category -> category.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(categories.get(0));
    }

    private Product build(String name, String description, String imageUrl, BigDecimal price, int stock, Category category) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setImageUrl(imageUrl);
        p.setPrice(price);
        p.setStock(stock);
        p.setCategory(category);
        return p;
    }

    private String image(String key) {
        return switch (key) {
            case "electronics" -> "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80";
            case "computers" -> "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80";
            case "home" -> "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80";
            case "fashion" -> "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80";
            case "shoes" -> "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80";
            case "sports" -> "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80";
            default -> "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";
        };
    }
}
