package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.CreateUserDto;
import net.javaguides.banking_app.Dto.UserResponseDto;
import net.javaguides.banking_app.entity.User;
import net.javaguides.banking_app.exception.UserException;
import net.javaguides.banking_app.repository.UserRepository;
import net.javaguides.banking_app.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDto createUser(CreateUserDto createUserDto) {
        if (createUserDto == null) {
            throw new UserException("User payload cannot be null");
        }

        if (createUserDto.username() == null || createUserDto.username().isBlank()) {
            throw new UserException("Username cannot be empty");
        }

        if (userRepository.existsByUsername(createUserDto.username().trim())) {
            throw new UserException("Username already exists: " + createUserDto.username());
        }

        if (createUserDto.password() == null || createUserDto.password().isBlank()) {
            throw new UserException("Password cannot be empty");
        }

        if (createUserDto.role() == null) {
            throw new UserException("Role must be specified");
        }

        if (createUserDto.role() == net.javaguides.banking_app.enums.Role.ADMIN) {
            throw new UserException("Creation of ADMIN role is not allowed via staff creation API");
        }

        User user = new User();
        user.setUsername(createUserDto.username().trim());
        user.setPassword(passwordEncoder.encode(createUserDto.password()));
        user.setRole(createUserDto.role());
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        return mapToUserResponseDto(savedUser);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found with id: " + id));
        if (user.getRole() == net.javaguides.banking_app.enums.Role.ADMIN) {
            throw new UserException("Cannot delete primary ADMIN account");
        }
        userRepository.delete(user);
    }

    private UserResponseDto mapToUserResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
