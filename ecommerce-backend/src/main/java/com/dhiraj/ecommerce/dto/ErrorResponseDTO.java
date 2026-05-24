package com.dhiraj.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
public class ErrorResponseDTO {
    private Instant timestamp;
    private int status;
    private String message;
    private String path;
    private Map<String, String> errors;
}
