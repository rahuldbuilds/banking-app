package net.javaguides.banking_app.exception;

import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record ErrorDetails(LocalDateTime timestamp, String message, String details, String errorCode) {
}
