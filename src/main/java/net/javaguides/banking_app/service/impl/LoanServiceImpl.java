package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.LoanDto;
import net.javaguides.banking_app.entity.Account;
import net.javaguides.banking_app.entity.Loan;
import net.javaguides.banking_app.exception.AccountException;
import net.javaguides.banking_app.mapper.LoanMapper;
import net.javaguides.banking_app.repository.AccountRepository;
import net.javaguides.banking_app.repository.LoanRepository;
import net.javaguides.banking_app.service.LoanService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;

    public LoanServiceImpl(LoanRepository loanRepository, AccountRepository accountRepository) {
        this.loanRepository = loanRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public LoanDto applyForLoan(LoanDto loanDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))) {
            String currentUsername = auth.getName();
            Account account = accountRepository.findById(loanDto.accountId())
                    .orElseThrow(() -> new AccountException("Account not found for loan application"));

            if (account.getAccountHolderName() == null ||
                    !account.getAccountHolderName().equalsIgnoreCase(currentUsername)) {
                throw new AccountException("Customers may only apply for loans on their own account!");
            }
        }

        Loan loan = LoanMapper.mapToLoan(loanDto);
        loan.setStatus("PENDING"); // Default status
        Loan savedLoan = loanRepository.save(loan);
        return LoanMapper.mapToLoanDto(savedLoan);
    }

    @Override
    public LoanDto getLoanById(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return LoanMapper.mapToLoanDto(loan);
    }

    @Override
    public List<LoanDto> getLoansByAccountId(Long accountId) {
        return loanRepository.findByAccountId(accountId).stream()
                .map(LoanMapper::mapToLoanDto)
                .collect(Collectors.toList());
    }

    @Override
    public LoanDto approveLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus("APPROVED");
        Loan updatedLoan = loanRepository.save(loan);
        return LoanMapper.mapToLoanDto(updatedLoan);
    }
}
