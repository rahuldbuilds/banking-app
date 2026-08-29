package net.javaguides.banking_app.Dto;

import java.math.BigDecimal;

public record TransferFundDto(
        String fromAccountNumber,
        String toAccountNumber,
        BigDecimal amount
) {
}