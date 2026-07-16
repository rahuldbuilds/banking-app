package net.javaguides.banking_app.mapper;

import net.javaguides.banking_app.Dto.CustomerDto;
import net.javaguides.banking_app.entity.Customer;

public class CustomerMapper {

    public static Customer mapToCustomer(CustomerDto customerDto) {
        Customer customer = new Customer();
        customer.setId(customerDto.id());
        customer.setFirstName(customerDto.firstName());
        customer.setLastName(customerDto.lastName());
        customer.setEmail(customerDto.email());
        customer.setPhoneNumber(customerDto.phoneNumber());
        customer.setAadharCardNo(customerDto.aadharCardNo());
        customer.setAadharCardPhoto(customerDto.aadharCardPhoto());
        customer.setPersonalPhoto(customerDto.personalPhoto());
        return customer;
    }

    public static CustomerDto mapToCustomerDto(Customer customer) {
        return new CustomerDto(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getAadharCardNo(),
                customer.getAadharCardPhoto(),
                customer.getPersonalPhoto()
        );
    }
}
