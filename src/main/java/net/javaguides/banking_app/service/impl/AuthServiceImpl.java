package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.LoginRequest;
import net.javaguides.banking_app.Dto.LoginResponse;
import net.javaguides.banking_app.entity.User;
import net.javaguides.banking_app.repository.UserRepository;
import net.javaguides.banking_app.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return new LoginResponse(
                user.getUsername(),
                user.getRole().name(),
                "Login successful"
        );
    }
}