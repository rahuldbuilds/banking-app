package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.LoanDto;
import net.javaguides.banking_app.entity.Loan;
import net.javaguides.banking_app.mapper.LoanMapper;
import net.javaguides.banking_app.repository.LoanRepository;
import net.javaguides.banking_app.service.LoanService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;

    public LoanServiceImpl(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @Override
    public LoanDto applyForLoan(LoanDto loanDto) {
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
