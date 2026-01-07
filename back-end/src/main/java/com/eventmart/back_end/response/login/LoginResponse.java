package com.eventmart.back_end.response.login;

import java.util.UUID;

public record LoginResponse(
        int status,
        String nameError,
        String token,
        User user
) {

    public record User(
            UUID idPublic,
            String name,
            String email
    ) {}
}
