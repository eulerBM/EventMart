package com.eventmart.back_end.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record AuthRegisterDTO(

    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    String nameFull,

    @Email(message = "Email invalido")
    String email,

    @Size(min = 8, max = 100, message = "A senha deve ter pelo menos 8 caracteres")
    String password,

    @Size(min = 8, max = 100, message = "A senha deve ter pelo menos 8 caracteres")
    String passwordAgain

) {
}
