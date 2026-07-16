package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.BeneficiaryDto;
import java.util.List;

public interface BeneficiaryService {
    BeneficiaryDto addBeneficiary(BeneficiaryDto beneficiaryDto);
    List<BeneficiaryDto> getBeneficiariesByAccountId(Long accountId);
    void deleteBeneficiary(Long id);
}
