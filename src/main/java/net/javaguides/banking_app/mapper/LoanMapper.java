package net.javaguides.banking_app.mapper;

import net.javaguides.banking_app.Dto.LoanDto;
import net.javaguides.banking_app.entity.Loan;

public class LoanMapper {

    public static Loan mapToLoan(LoanDto loanDto) {
        Loan loan = new Loan();
        loan.setId(loanDto.id());
        loan.setAccountId(loanDto.accountId());
        loan.setAmount(loanDto.amount());
        loan.setInterestRate(loanDto.interestRate());
        loan.setLoanType(loanDto.loanType());
        loan.setStatus(loanDto.status());
        return loan;
    }

    public static LoanDto mapToLoanDto(Loan loan) {
        return new LoanDto(
                loan.getId(),
                loan.getAccountId(),
                loan.getAmount(),
                loan.getInterestRate(),
                loan.getLoanType(),
                loan.getStatus()
        );
    }
}
