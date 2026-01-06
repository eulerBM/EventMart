package com.eventmart.back_end.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AuthRegisterDTO(

    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    String name,

    @Email(message = "Email invalido")
    String email,

    @Size(min = 8, max = 100, message = "A senha deve ter pelo menos 6 caracteres")
    String password

) {
}
