package net.javaguides.banking_app.Dto;



public record TransferFundDto(Long fromAccountId, Long toAccountId, double amount) {
}
