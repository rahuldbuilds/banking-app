package net.javaguides.banking_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Account Creation
                        .requestMatchers(HttpMethod.POST, "/api/accounts").hasAnyRole("ADMIN", "ACCOUNT_CREATOR")

                        // Cash Deposits & Withdrawals
                        .requestMatchers(HttpMethod.PUT, "/api/accounts/*/deposit").hasAnyRole("ADMIN", "CASH_DEPOSITOR")
                        .requestMatchers(HttpMethod.PUT, "/api/accounts/*/withdraw").hasAnyRole("ADMIN", "CASH_DEPOSITOR")

                        // Fund Transfers
                        .requestMatchers(HttpMethod.POST, "/api/accounts/transfer").hasAnyRole("ADMIN", "TRANSACTION_HANDLER", "CUSTOMER")

                        // Account Closure / Deletion
                        .requestMatchers(HttpMethod.DELETE, "/api/accounts/*").hasRole("ADMIN")

                        // Accounts Read / Transactions
                        .requestMatchers("/api/accounts/**").hasAnyRole("ADMIN", "ACCOUNT_CREATOR", "CASH_DEPOSITOR", "TRANSACTION_HANDLER", "LOAN_OFFICER", "CUSTOMER")

                        // Loans
                        .requestMatchers(HttpMethod.PUT, "/api/loans/*/approve").hasAnyRole("ADMIN", "LOAN_OFFICER")
                        .requestMatchers("/api/loans/**").hasAnyRole("ADMIN", "LOAN_OFFICER", "CUSTOMER")

                        // Customers & KYC
                        .requestMatchers(HttpMethod.POST, "/api/customers").hasAnyRole("ADMIN", "ACCOUNT_CREATOR")
                        .requestMatchers("/api/customers/**").hasAnyRole("ADMIN", "ACCOUNT_CREATOR", "LOAN_OFFICER")

                        // Beneficiaries
                        .requestMatchers("/api/beneficiaries/**").hasAnyRole("ADMIN", "TRANSACTION_HANDLER", "CUSTOMER")

                        .anyRequest().authenticated()
                );

        return http.build();
    }
}