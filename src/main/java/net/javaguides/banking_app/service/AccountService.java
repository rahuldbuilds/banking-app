package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.Dto.TransactionDto;
import net.javaguides.banking_app.Dto.TransferFundDto;
import net.javaguides.banking_app.entity.Account;

import java.util.List;

public interface AccountService {

    AccountDto createAccount(AccountDto accountDto );
    AccountDto getAccountById(Long id);
    AccountDto deposit(Long id, double amount);
    AccountDto withdraw(Long id, double amount);
    List<AccountDto> getAllAccounts();
    void deleteAccount(Long id);
    void transferFunds(TransferFundDto transferFundDto);
    List<TransactionDto> getAccountTransactions(Long accountId);


}
