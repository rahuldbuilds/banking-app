package net.javaguides.banking_app.Dto;

public record LoginResponse(
        String username,
        String role,
        String message
) {
}