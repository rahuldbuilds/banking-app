package net.javaguides.banking_app.controller;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.Dto.TransactionDto;
import net.javaguides.banking_app.Dto.TransferFundDto;
import net.javaguides.banking_app.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }


    // ================= CREATE ACCOUNT =================

    @PostMapping
    public ResponseEntity<AccountDto> addAccount(
            @RequestBody AccountDto accountDto) {

        AccountDto savedAccount =
                accountService.createAccount(accountDto);

        return new ResponseEntity<>(
                savedAccount,
                HttpStatus.CREATED
        );
    }


    // ================= GET ACCOUNT =================

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountDto> getAccountByNumber(
            @PathVariable String accountNumber) {

        AccountDto accountDto =
                accountService.getAccountByNumber(accountNumber);

        return ResponseEntity.ok(accountDto);
    }


    // ================= DEPOSIT =================

    @PutMapping("/{accountNumber}/deposit")
    public ResponseEntity<AccountDto> deposit(
            @PathVariable String accountNumber,
            @RequestBody Map<String, BigDecimal> request) {

        BigDecimal amount = request.get("amount");

        AccountDto accountDto =
                accountService.deposit(accountNumber, amount);

        return ResponseEntity.ok(accountDto);
    }


    // ================= WITHDRAW =================

    @PutMapping("/{accountNumber}/withdraw")
    public ResponseEntity<AccountDto> withdraw(
            @PathVariable String accountNumber,
            @RequestBody Map<String, BigDecimal> request) {

        BigDecimal amount = request.get("amount");

        AccountDto accountDto =
                accountService.withdraw(accountNumber, amount);

        return ResponseEntity.ok(accountDto);
    }


    // ================= GET ALL ACCOUNTS =================

    @GetMapping
    public ResponseEntity<List<AccountDto>> getAllAccounts() {

        List<AccountDto> accounts =
                accountService.getAllAccounts();

        return ResponseEntity.ok(accounts);
    }


    // ================= CLOSE ACCOUNT =================

    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<String> deleteAccount(
            @PathVariable String accountNumber) {

        accountService.deleteAccount(accountNumber);

        return ResponseEntity.ok(
                "Account is closed successfully"
        );
    }


    // ================= TRANSFER =================

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFund(
            @RequestBody TransferFundDto transferFundDto) {

        accountService.transferFunds(transferFundDto);

        return ResponseEntity.ok(
                "Transfer successful"
        );
    }


    // ================= TRANSACTIONS =================

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionDto>> fetchTransactions(
            @PathVariable String accountNumber) {

        List<TransactionDto> transactions =
                accountService.getAccountTransactions(accountNumber);

        return ResponseEntity.ok(transactions);
    }
}