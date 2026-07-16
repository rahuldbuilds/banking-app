package net.javaguides.banking_app.controller;

import net.javaguides.banking_app.Dto.LoanDto;
import net.javaguides.banking_app.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    public ResponseEntity<LoanDto> applyForLoan(@RequestBody LoanDto loanDto) {
        return new ResponseEntity<>(loanService.applyForLoan(loanDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDto> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<LoanDto>> getLoansByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(loanService.getLoansByAccountId(accountId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LoanDto> approveLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.approveLoan(id));
    }
}
