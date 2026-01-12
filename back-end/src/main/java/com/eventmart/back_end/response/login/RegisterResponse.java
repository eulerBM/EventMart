package com.eventmart.back_end.response.login;

import java.util.UUID;

public record RegisterResponse(
        int status,
        String nameError,
        String data
) {
}
