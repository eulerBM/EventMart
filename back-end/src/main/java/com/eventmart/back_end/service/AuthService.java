package com.eventmart.back_end.service;

import com.eventmart.back_end.dtos.AuthLoginDTO;
import com.eventmart.back_end.dtos.AuthRegisterDTO;
import com.eventmart.back_end.model.UserModel;
import com.eventmart.back_end.repository.UserRepository;
import com.eventmart.back_end.response.error.ErrorResponse;
import com.eventmart.back_end.response.login.LoginResponse;
import com.eventmart.back_end.response.login.RegisterResponse;
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

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(HttpStatus.UNAUTHORIZED.value(),
                            "Credenciais inválidas",
                            null,
                            null));


        }

        UserModel userBy = user.get();

        var equalPassword = passwordEncoder.matches(data.password(), userBy.getPassword());

        if(!equalPassword){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(HttpStatus.UNAUTHORIZED.value(),
                            "Credenciais inválidas",
                            null,
                            null));


        }

        String jwtAccessToken = jwtService.generateJwt(userBy.getEmail(), userBy.getIdPublic());

        LoginResponse.User userResponse = new LoginResponse.User(
                userBy.getIdPublic(),
                userBy.getFullName(),
                userBy.getEmail()
        );

        return ResponseEntity.ok().body(new LoginResponse(HttpStatus.OK.value(), null, jwtAccessToken, userResponse));

    }

    public ResponseEntity<?> register(AuthRegisterDTO data){

        Optional<UserModel> user = userRepository.findByEmail(data.email());

        if(user.isPresent()){

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(HttpStatus.CONFLICT.value(), "Email já cadastrado"));

        }

        String encryptedPassword = passwordEncoder.encode(data.password());

        UserModel userModel = new UserModel(data.name(),
                                            data.email(),
                                            encryptedPassword);

        userRepository.save(userModel);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegisterResponse(HttpStatus.CREATED.value(), "Conta criada com sucesso"));
    }
}
