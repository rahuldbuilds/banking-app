package net.javaguides.banking_app.config;

import net.javaguides.banking_app.entity.User;
import net.javaguides.banking_app.enums.Role;
import net.javaguides.banking_app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!userRepository.existsByUsername("admin")) {

                User admin = new User();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("Admin@12345")
                );

                admin.setRole(Role.ADMIN);

                admin.setEnabled(true);

                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("Default ADMIN account created");
                System.out.println("Username: admin");
                System.out.println("Password: Admin@12345");
                System.out.println("=================================");
            }
        };
    }
}