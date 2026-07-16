package net.javaguides.banking_app.service;

import net.javaguides.banking_app.Dto.CustomerDto;
import java.util.List;

public interface CustomerService {
    CustomerDto createCustomer(CustomerDto customerDto);
    CustomerDto getCustomerById(Long id);
    List<CustomerDto> getAllCustomers();
}
