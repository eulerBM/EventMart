package com.eventmart.back_end.controller;

import com.eventmart.back_end.dtos.AuthLoginDTO;
import com.eventmart.back_end.dtos.AuthRegisterDTO;
import com.eventmart.back_end.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRegisterDTO data){
        return authService.register(data);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthLoginDTO data){
        return authService.login(data);
    }

}
