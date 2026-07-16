package net.javaguides.banking_app.mapper;

import net.javaguides.banking_app.Dto.BeneficiaryDto;
import net.javaguides.banking_app.entity.Beneficiary;

public class BeneficiaryMapper {

    public static Beneficiary mapToBeneficiary(BeneficiaryDto beneficiaryDto) {
        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setId(beneficiaryDto.id());
        beneficiary.setAccountId(beneficiaryDto.accountId());
        beneficiary.setTargetAccountId(beneficiaryDto.targetAccountId());
        beneficiary.setAliasName(beneficiaryDto.aliasName());
        return beneficiary;
    }

    public static BeneficiaryDto mapToBeneficiaryDto(Beneficiary beneficiary) {
        return new BeneficiaryDto(
                beneficiary.getId(),
                beneficiary.getAccountId(),
                beneficiary.getTargetAccountId(),
                beneficiary.getAliasName()
        );
    }
}
