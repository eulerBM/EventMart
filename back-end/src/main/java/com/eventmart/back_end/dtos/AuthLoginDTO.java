package com.eventmart.back_end.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AuthLoginDTO(

        @Email(message = "Email invalido")
        String email,

        @Size(min = 8, max = 100, message = "A senha deve ter pelo menos 8 caracteres")
        String passowrd
) {

}
