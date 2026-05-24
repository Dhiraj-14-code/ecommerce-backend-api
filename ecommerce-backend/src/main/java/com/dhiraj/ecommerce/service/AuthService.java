package com.dhiraj.ecommerce.service;

import com.dhiraj.ecommerce.dto.AuthResponseDTO;
import com.dhiraj.ecommerce.dto.LoginRequestDTO;
import com.dhiraj.ecommerce.dto.RegisterRequestDTO;
import com.dhiraj.ecommerce.entity.User;
import com.dhiraj.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AuthResponseDTO register(
            RegisterRequestDTO dto
    ){
        if(userRepository.findByEmail(dto.getEmail()).isPresent()){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        user.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );
        user.setRole("User");

        userRepository.save(user);

        return new AuthResponseDTO(
                "User Registered Successfully",
                jwtService.generateToken(user.getEmail(),user.getRole())
        );
    }
   public AuthResponseDTO login(LoginRequestDTO dto ){
           User user = userRepository.findByEmail(dto.getEmail())
                   .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
       boolean isPasswordCorrect =
               passwordEncoder.matches(
                       dto.getPassword(),
                       user.getPassword()
               );
       if(!isPasswordCorrect){
           throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
       }
       String token =
               jwtService.generateToken(user.getEmail(),user.getRole());

       return new AuthResponseDTO(
               "Login Successfully",
               token
       );

   }
}
