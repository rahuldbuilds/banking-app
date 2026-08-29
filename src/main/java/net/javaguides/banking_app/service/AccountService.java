package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.Dto.TransactionDto;
import net.javaguides.banking_app.Dto.TransferFundDto;
import net.javaguides.banking_app.entity.Account;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    AccountDto createAccount(AccountDto accountDto );
    AccountDto getAccountByNumber(String accountNumber);
    AccountDto deposit(String accountNumber, BigDecimal amount);
    AccountDto withdraw(String accountNumber, BigDecimal amount);
    List<AccountDto> getAllAccounts();
    void deleteAccount(String accountNumber);
    void transferFunds(TransferFundDto transferFundDto);
    List<TransactionDto> getAccountTransactions(String accountNumber);


}
