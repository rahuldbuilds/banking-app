package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.LoanDto;
import java.util.List;

public interface LoanService {
    LoanDto applyForLoan(LoanDto loanDto);
    LoanDto getLoanById(Long id);
    List<LoanDto> getLoansByAccountId(Long accountId);
    LoanDto approveLoan(Long id);
}
