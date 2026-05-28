package com.dhiraj.ecommerce.config;

import com.dhiraj.ecommerce.entity.Category;
import com.dhiraj.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(1)
public class CategorySeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        List<String> names = List.of(
                "Electronics",
                "Computers & Accessories",
                "Home & Kitchen",
                "Men's Fashion",
                "Women's Fashion",
                "Shoes",
                "Sports & Fitness",
                "Beauty",
                "Health & Personal Care",
                "Grocery & Gourmet Foods",
                "Books",
                "Toys & Games",
                "Mobile Accessories",
                "Office Products",
                "Pet Supplies"
        );

        for (String name : names) {
            Category category = new Category();
            category.setName(name);
            categoryRepository.save(category);
        }
    }
}
