package com.eventmart.back_end.response.error;

public record ErrorResponse(
        int status,
        String data
) {
}
