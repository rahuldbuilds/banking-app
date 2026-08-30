package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.CreateUserDto;
import net.javaguides.banking_app.Dto.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(CreateUserDto createUserDto);

    List<UserResponseDto> getAllUsers();

    void deleteUser(Long id);
}
