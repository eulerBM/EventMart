package com.eventmart.back_end.response.login;

public record LoginResponse(
        String token,
        User user
) {

    public record User(
            String name,
            String email
    ) {}
}
