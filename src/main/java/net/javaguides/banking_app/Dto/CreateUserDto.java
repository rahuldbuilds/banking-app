package net.javaguides.banking_app.Dto;

import net.javaguides.banking_app.enums.Role;

public record CreateUserDto(
        String username,
        String password,
        Role role
) {}
