package net.javaguides.banking_app.service.impl;

import net.javaguides.banking_app.Dto.BeneficiaryDto;
import net.javaguides.banking_app.entity.Beneficiary;
import net.javaguides.banking_app.mapper.BeneficiaryMapper;
import net.javaguides.banking_app.repository.BeneficiaryRepository;
import net.javaguides.banking_app.service.BeneficiaryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryServiceImpl(BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Override
    public BeneficiaryDto addBeneficiary(BeneficiaryDto beneficiaryDto) {
        Beneficiary beneficiary = BeneficiaryMapper.mapToBeneficiary(beneficiaryDto);
        Beneficiary savedBeneficiary = beneficiaryRepository.save(beneficiary);
        return BeneficiaryMapper.mapToBeneficiaryDto(savedBeneficiary);
    }

    @Override
    public List<BeneficiaryDto> getBeneficiariesByAccountId(Long accountId) {
        return beneficiaryRepository.findByAccountId(accountId).stream()
                .map(BeneficiaryMapper::mapToBeneficiaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBeneficiary(Long id) {
        beneficiaryRepository.deleteById(id);
    }
}
