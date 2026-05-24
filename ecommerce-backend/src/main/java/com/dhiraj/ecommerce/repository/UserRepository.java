package com.dhiraj.ecommerce.repository;

import com.dhiraj.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    // Email se user find karne ke liye
    Optional<User> findByEmail(String email);
}
