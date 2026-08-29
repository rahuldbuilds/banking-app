package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.LoginRequest;
import net.javaguides.banking_app.Dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}