package net.javaguides.banking_app.controller;

import net.javaguides.banking_app.Dto.BeneficiaryDto;
import net.javaguides.banking_app.service.BeneficiaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    @PostMapping
    public ResponseEntity<BeneficiaryDto> addBeneficiary(@RequestBody BeneficiaryDto beneficiaryDto) {
        return new ResponseEntity<>(beneficiaryService.addBeneficiary(beneficiaryDto), HttpStatus.CREATED);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<BeneficiaryDto>> getBeneficiariesByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(beneficiaryService.getBeneficiariesByAccountId(accountId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBeneficiary(@PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(id);
        return ResponseEntity.ok("Beneficiary deleted successfully");
    }
}
