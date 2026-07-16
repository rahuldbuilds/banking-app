package net.javaguides.banking_app.Dto;

public record CustomerDto(Long id, String firstName, String lastName, String email, String phoneNumber, String aadharCardNo, String aadharCardPhoto, String personalPhoto) {
}
