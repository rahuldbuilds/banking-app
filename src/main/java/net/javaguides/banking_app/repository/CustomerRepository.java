package net.javaguides.banking_app.repository;

import net.javaguides.banking_app.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
