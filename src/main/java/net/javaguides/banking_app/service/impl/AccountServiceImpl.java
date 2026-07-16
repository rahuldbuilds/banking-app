package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.Dto.TransactionDto;
import net.javaguides.banking_app.Dto.TransferFundDto;
import net.javaguides.banking_app.entity.Account;
import net.javaguides.banking_app.entity.Transaction;
import net.javaguides.banking_app.exception.AccountException;
import net.javaguides.banking_app.mapper.AccountMapper;
import net.javaguides.banking_app.repository.AccountRepository;
import net.javaguides.banking_app.repository.TransactionRepository;
import net.javaguides.banking_app.service.AccountService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private AccountRepository accountRepository;

    private TransactionRepository transactionRepository;

    private static  final String TRANSACTION_TYPE_DEPOSIT = "DEPOSIT";
    private static final  String TRANSACTION_TYPE_WITHDRAW = "WITHDRAW";
    private static final String TRANSACTION_TYPE_TRANSFER = "TRANSFER";


    public AccountServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }



    @Override
    public AccountDto createAccount(AccountDto accountDto) {

        Account account = AccountMapper.mapToAccount(accountDto);
         Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountException("Account does not exists"));
        return AccountMapper.mapToAccountDto(account) ;
    }

    @Override
    public AccountDto deposit(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountException("Account does not exists"));

        double total = account.getBalance() + amount;
        account.setBalance(total);
        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccountId(account.getId());
        transaction.setAmount(amount);
        transaction.setTransactionType(TRANSACTION_TYPE_DEPOSIT);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto withdraw(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountException("Account does not exists"));
        if(account.getBalance() < amount){
            throw new AccountException("Insufficient amount");

        }
        double total = account.getBalance() - amount;
        account.setBalance(total);
        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccountId(id);
        transaction.setAmount(amount);
        transaction.setTransactionType(TRANSACTION_TYPE_WITHDRAW);
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);

        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map((account) -> AccountMapper.mapToAccountDto(account))
                .collect(Collectors.toList());

    }

    @Override
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new AccountException("Account does not exists"));
        accountRepository.deleteById(id);

    }

    @Override
    public void transferFunds(TransferFundDto transferFundDto) {
        // Retrieve the account from which we send the amount
        Account fromAccount = accountRepository.findById(transferFundDto.fromAccountId())
                .orElseThrow(() -> new RuntimeException("Account does not exists"));

        // Retrieve the account to which we send the amount
        Account toAccount = accountRepository.findById(transferFundDto.toAccountId())
                .orElseThrow(() -> new RuntimeException("Account does not exists"));

        if(fromAccount.getBalance() < transferFundDto.amount()){
            throw new AccountException("Insufficient Balance");
        }

        // Debit the amount from the fromAccount object
        fromAccount.setBalance(fromAccount.getBalance() - transferFundDto.amount());

        // credit the amount to toAccount object
        toAccount.setBalance(toAccount.getBalance() + transferFundDto.amount());

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction transactionOut = new Transaction();
        transactionOut.setAccountId(transferFundDto.fromAccountId());
        transactionOut.setAmount(transferFundDto.amount());
        transactionOut.setTransactionType(TRANSACTION_TYPE_TRANSFER);
        transactionOut.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transactionOut);

        Transaction transactionIn = new Transaction();
        transactionIn.setAccountId(transferFundDto.toAccountId());
        transactionIn.setAmount(transferFundDto.amount());
        transactionIn.setTransactionType("TRANSFER_IN");
        transactionIn.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transactionIn);
    }

    @Override
    public List<TransactionDto> getAccountTransactions(Long accountId) {

        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);

        return transactions.stream().map((transaction) -> convertEntityToDto(transaction))
                .collect(Collectors.toList());


    }

    private TransactionDto convertEntityToDto(Transaction transaction){
        return new TransactionDto(
                transaction.getId(),
                transaction.getAccountId(),
                transaction.getAmount(),
                transaction.getTransactionType(),
                transaction.getTimestamp()
        );

    }
}
