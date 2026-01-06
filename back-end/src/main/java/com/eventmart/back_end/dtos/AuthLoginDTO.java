package com.eventmart.back_end.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AuthLoginDTO(

        @Email(message = "Email invalido")
        String email,

        @Size(min = 6, max = 100, message = "A senha deve ter pelo menos 6 caracteres")
        String password

) {
}
