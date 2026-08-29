package net.javaguides.banking_app.util;

import java.util.Random;

public class AccountNumberGenerator {

    private static final Random random = new Random();

    private AccountNumberGenerator() {
    }

    public static String generate() {

        StringBuilder accountNumber = new StringBuilder();

        // Generate a 12-digit account number
        for (int i = 0; i < 12; i++) {
            accountNumber.append(random.nextInt(10));
        }

        return accountNumber.toString();
    }
}