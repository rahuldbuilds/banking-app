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
@Table(name = "customers")
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "aadhar_card_no")
    private String aadharCardNo;

    @Lob
    @Column(name = "aadhar_card_photo", columnDefinition="LONGTEXT")
    private String aadharCardPhoto;

    @Lob
    @Column(name = "personal_photo", columnDefinition="LONGTEXT")
    private String personalPhoto;
}
