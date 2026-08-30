package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.Dto.TransactionDto;
import net.javaguides.banking_app.Dto.TransferFundDto;
import net.javaguides.banking_app.entity.Account;
import net.javaguides.banking_app.entity.Transaction;
import net.javaguides.banking_app.enums.AccountStatus;
import net.javaguides.banking_app.exception.AccountException;
import net.javaguides.banking_app.mapper.AccountMapper;
import net.javaguides.banking_app.repository.AccountRepository;
import net.javaguides.banking_app.repository.TransactionRepository;
import net.javaguides.banking_app.service.AccountService;
import net.javaguides.banking_app.util.AccountNumberGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    private static final String TRANSACTION_TYPE_DEPOSIT = "DEPOSIT";
    private static final String TRANSACTION_TYPE_WITHDRAW = "WITHDRAW";
    private static final String TRANSACTION_TYPE_TRANSFER = "TRANSFER";

    public AccountServiceImpl(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }


    // ================= CREATE ACCOUNT =================

    @Override
    public AccountDto createAccount(AccountDto accountDto) {

        Account account = AccountMapper.mapToAccount(accountDto);

        // Generate a unique account number
        String accountNumber;

        do {
            accountNumber = AccountNumberGenerator.generate();
        } while (accountRepository.existsByAccountNumber(accountNumber));

        account.setAccountNumber(accountNumber);

        // New accounts are ACTIVE
        account.setStatus(AccountStatus.ACTIVE);

        // If balance is not provided, start with zero
        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }

        Account savedAccount = accountRepository.save(account);

        return AccountMapper.mapToAccountDto(savedAccount);
    }


    // ================= GET ACCOUNT =================

    @Override
    public AccountDto getAccountByNumber(String accountNumber) {

        Account account = findAccountByNumber(accountNumber);

        return AccountMapper.mapToAccountDto(account);
    }


    // ================= DEPOSIT =================

    @Override
    public AccountDto deposit(
            String accountNumber,
            BigDecimal amount) {

        Account account = findAccountByNumber(accountNumber);

        checkActiveAccount(account);

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new AccountException(
                    "Deposit amount must be greater than zero"
            );
        }

        // Add money
        BigDecimal newBalance =
                account.getBalance().add(amount);

        account.setBalance(newBalance);

        Account savedAccount =
                accountRepository.save(account);


        // Create transaction record
        Transaction transaction = new Transaction();

        transaction.setAccountId(account.getId());
        transaction.setAmount(amount);
        transaction.setTransactionType(
                TRANSACTION_TYPE_DEPOSIT
        );
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);

        return AccountMapper.mapToAccountDto(savedAccount);
    }


    // ================= WITHDRAW =================

    @Override
    public AccountDto withdraw(
            String accountNumber,
            BigDecimal amount) {

        Account account = findAccountByNumber(accountNumber);

        checkActiveAccount(account);

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new AccountException(
                    "Withdrawal amount must be greater than zero"
            );
        }

        // Check balance
        if (account.getBalance().compareTo(amount) < 0) {

            throw new AccountException(
                    "Insufficient balance"
            );
        }

        // Subtract money
        BigDecimal newBalance =
                account.getBalance().subtract(amount);

        account.setBalance(newBalance);

        Account savedAccount =
                accountRepository.save(account);


        // Create transaction
        Transaction transaction = new Transaction();

        transaction.setAccountId(account.getId());
        transaction.setAmount(amount);
        transaction.setTransactionType(
                TRANSACTION_TYPE_WITHDRAW
        );
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);

        return AccountMapper.mapToAccountDto(savedAccount);
    }


    // ================= GET ALL ACCOUNTS =================

    @Override
    public List<AccountDto> getAllAccounts() {

        List<Account> accounts =
                accountRepository.findAll();

        return accounts.stream()
                .map(AccountMapper::mapToAccountDto)
                .collect(Collectors.toList());
    }


    // ================= DELETE / CLOSE ACCOUNT =================

    @Override
    public void deleteAccount(String accountNumber) {

        Account account =
                findAccountByNumber(accountNumber);

        if (account.getStatus() == AccountStatus.CLOSED) {

            throw new AccountException(
                    "Account is already closed"
            );
        }

        // We don't physically delete a bank account.
        // We mark it as CLOSED.
        account.setStatus(AccountStatus.CLOSED);

        accountRepository.save(account);
    }


    // ================= TRANSFER =================

    @Transactional
    @Override
    public void transferFunds(TransferFundDto transferFundDto) {

        BigDecimal amount = transferFundDto.amount();

        // Validate amount
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new AccountException(
                    "Transfer amount must be greater than zero"
            );
        }

        // Sender and receiver cannot be the same
        if (transferFundDto.fromAccountNumber()
                .equals(transferFundDto.toAccountNumber())) {

            throw new AccountException(
                    "Sender and receiver accounts cannot be the same"
            );
        }


        // Find sender using account number
        Account fromAccount =
                accountRepository
                        .findByAccountNumber(
                                transferFundDto.fromAccountNumber()
                        )
                        .orElseThrow(() ->
                                new AccountException(
                                        "Sender account does not exist"
                                ));

        // Ownership check for CUSTOMER role
        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))) {
            String currentUsername = auth.getName();
            if (fromAccount.getAccountHolderName() == null ||
                    !fromAccount.getAccountHolderName().equalsIgnoreCase(currentUsername)) {
                throw new AccountException(
                        "Customers may only transfer funds from their own account!"
                );
            }
        }


        // Find receiver using account number
        Account toAccount =
                accountRepository
                        .findByAccountNumber(
                                transferFundDto.toAccountNumber()
                        )
                        .orElseThrow(() ->
                                new AccountException(
                                        "Receiver account does not exist"
                                ));


        // Check sender account status
        checkActiveAccount(fromAccount);


        // Check receiver account status
        checkActiveAccount(toAccount);


        // Check sender balance
        if (fromAccount.getBalance()
                .compareTo(amount) < 0) {

            throw new AccountException(
                    "Insufficient balance"
            );
        }


        // Debit sender
        fromAccount.setBalance(
                fromAccount.getBalance()
                        .subtract(amount)
        );


        // Credit receiver
        toAccount.setBalance(
                toAccount.getBalance()
                        .add(amount)
        );


        // Save both accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);


        LocalDateTime timestamp = LocalDateTime.now();


        // Sender transaction
        Transaction transactionOut = new Transaction();

        transactionOut.setAccountId(fromAccount.getId());
        transactionOut.setAmount(amount);
        transactionOut.setTransactionType(
                TRANSACTION_TYPE_TRANSFER
        );
        transactionOut.setTimestamp(timestamp);

        transactionRepository.save(transactionOut);


        // Receiver transaction
        Transaction transactionIn = new Transaction();

        transactionIn.setAccountId(toAccount.getId());
        transactionIn.setAmount(amount);
        transactionIn.setTransactionType(
                "TRANSFER_IN"
        );
        transactionIn.setTimestamp(timestamp);

        transactionRepository.save(transactionIn);
    }
    // ================= TRANSACTIONS =================

    @Override
    public List<TransactionDto> getAccountTransactions(
            String accountNumber) {

        Account account =
                findAccountByNumber(accountNumber);

        List<Transaction> transactions =
                transactionRepository
                        .findByAccountIdOrderByTimestampDesc(
                                account.getId()
                        );

        return transactions.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }


    // ================= HELPER METHODS =================

    private Account findAccountByNumber(
            String accountNumber) {

        if (accountNumber == null ||
                accountNumber.isBlank()) {

            throw new AccountException(
                    "Account number cannot be empty"
            );
        }

        return accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountException(
                                "Account does not exist"
                        ));
    }


    private void checkActiveAccount(Account account) {

        if (account.getStatus() != AccountStatus.ACTIVE) {

            throw new AccountException(
                    "Account is " + account.getStatus()
            );
        }
    }


    private TransactionDto convertEntityToDto(
            Transaction transaction) {

        return new TransactionDto(
                transaction.getId(),
                transaction.getAccountId(),
                transaction.getAmount(),
                transaction.getTransactionType(),
                transaction.getTimestamp()
        );
    }
}