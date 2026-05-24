package com.dhiraj.ecommerce.controller;


import com.dhiraj.ecommerce.dto.AuthResponseDTO;
import com.dhiraj.ecommerce.dto.LoginRequestDTO;
import com.dhiraj.ecommerce.dto.RegisterRequestDTO;
import com.dhiraj.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService=authService;
    }

    //Register api
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO>  register(
            @Valid
            @RequestBody RegisterRequestDTO dto
            ){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                authService.register(dto)
        );
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO>  Login(
            @Valid
            @RequestBody
            LoginRequestDTO dto
    ){
        return ResponseEntity.ok(
                authService.login(dto)
        );
    }
}
