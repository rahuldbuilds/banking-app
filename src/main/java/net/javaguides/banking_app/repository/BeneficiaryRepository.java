package net.javaguides.banking_app.repository;

import net.javaguides.banking_app.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByAccountId(Long accountId);
}
