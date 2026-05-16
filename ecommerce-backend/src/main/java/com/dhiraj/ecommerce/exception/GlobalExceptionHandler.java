package com.dhiraj.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Handles exceptions globally for all controllers
public class GlobalExceptionHandler {

    // This method handles validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {

        // Map to store field name and error message
        Map<String, String> errors = new HashMap<>();

        // Loop through all validation errors
        ex.getBindingResult().getFieldErrors().forEach(error -> {

            // Get field name
            String fieldName = error.getField();

            // Get validation error message
            String errorMessage = error.getDefaultMessage();

            // Store in map
            errors.put(fieldName, errorMessage);
        });

        // Return HTTP 400 Bad Request with errors map
        return ResponseEntity.badRequest().body(errors);
    }
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductNotFoundException(
            ProductNotFoundException ex
    ) {

        // Create response map
        Map<String, String> error = new HashMap<>();

        // Add exception message
        error.put("message", ex.getMessage());

        // Return 404 NOT FOUND
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}