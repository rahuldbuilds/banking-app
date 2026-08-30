package net.javaguides.banking_app.Dto;

import net.javaguides.banking_app.enums.Role;

import java.time.LocalDateTime;

public record UserResponseDto(
        Long id,
        String username,
        Role role,
        boolean enabled,
        LocalDateTime createdAt
) {}
