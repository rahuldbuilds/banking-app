package net.javaguides.banking_app.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionDto(Long id, Long accountId, BigDecimal amount, String transactionType,
                             LocalDateTime timestamp) {
}
