package com.eventmart.back_end.service;

import com.eventmart.back_end.dtos.AuthLoginDTO;
import com.eventmart.back_end.dtos.AuthRegisterDTO;
import com.eventmart.back_end.model.UserModel;
import com.eventmart.back_end.repository.UserRepository;
import com.eventmart.back_end.response.login.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ResponseEntity<?> login(AuthLoginDTO data){

        Optional<UserModel> user = userRepository.findByEmail(data.email());

        if (user.isEmpty()){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");

        }

        UserModel userBy = user.get();

        var equalPassword = passwordEncoder.matches(data.passowrd(), userBy.getPassword());

        if(!equalPassword){

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Credenciais inválidas");

        }

        String jwtAccessToken = jwtService.generateJwt(userBy.getEmail(), userBy.getIdPublic());

        LoginResponse.User userResponse = new LoginResponse.User(
                userBy.getFullName(),
                userBy.getEmail()
        );

        return ResponseEntity.ok().body(new LoginResponse(jwtAccessToken, userResponse));

    }

    public ResponseEntity<?> register(AuthRegisterDTO data){

        if(!data.password().equals(data.passwordAgain())){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senhas diferentes");

        }

        Optional<UserModel> user = userRepository.findByEmail(data.email());

        if(user.isPresent()){

            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado");

        }

        String encryptedPassword = passwordEncoder.encode(data.password());

        UserModel userModel = new UserModel(data.nameFull(),
                                            data.email(),
                                            encryptedPassword);

        userRepository.save(userModel);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
