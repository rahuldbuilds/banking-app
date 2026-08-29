package net.javaguides.banking_app.mapper;

import net.javaguides.banking_app.Dto.AccountDto;
import net.javaguides.banking_app.entity.Account;

public class AccountMapper {

    public static Account mapToAccount(AccountDto accountDto) {

        Account account = new Account(
                accountDto.id(),
                accountDto.accountNumber(),
                accountDto.accountHolderName(),
                accountDto.balance(),

                accountDto.accountType(),
                accountDto.signatureImage(),
                accountDto.status()
        );

        return account;
    }


    public static AccountDto mapToAccountDto(Account account) {

        AccountDto accountDto = new AccountDto(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountHolderName(),
                account.getBalance(),

                account.getAccountType(),
                account.getSignatureImage(),
                account.getStatus()
        );

        return accountDto;
    }
}