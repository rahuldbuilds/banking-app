package net.javaguides.banking_app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "loans")
@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id")
    private Long accountId;

    private double amount;
    
    @Column(name = "interest_rate")
    private double interestRate;

    @Column(name = "loan_type")
    private String loanType; // HOME, AUTO, PERSONAL

    private String status; // PENDING, APPROVED, REJECTED, PAID
}
