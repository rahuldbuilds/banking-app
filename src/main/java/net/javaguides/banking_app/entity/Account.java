package net.javaguides.banking_app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguides.banking_app.enums.AccountStatus;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "accounts")
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number" ,unique = true,nullable = false)
    private String accountNumber;

    @Column(name = "account_holder_name")
    private String accountHolderName;

    @Column(precision = 19, scale = 2, nullable = false)
    private BigDecimal balance;



    @Column(name = "account_type")
    private String accountType;

    @Lob
    @Column(name = "signature_image", columnDefinition = "LONGTEXT")
    private String signatureImage;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;
}