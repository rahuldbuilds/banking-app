package net.javaguides.banking_app.Dto;

import net.javaguides.banking_app.enums.AccountStatus;

import java.math.BigDecimal;

public record AccountDto(
        Long id,
        String accountNumber,
        String accountHolderName,
        BigDecimal balance,

        String accountType,
        String signatureImage,
        AccountStatus status
) {
}