package net.javaguides.banking_app.Dto;

public record BeneficiaryDto(Long id, Long accountId, Long targetAccountId, String aliasName) {
}
