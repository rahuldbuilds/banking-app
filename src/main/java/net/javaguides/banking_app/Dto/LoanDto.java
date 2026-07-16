package net.javaguides.banking_app.Dto;

public record LoanDto(Long id, Long accountId, double amount, double interestRate, String loanType, String status) {
}
