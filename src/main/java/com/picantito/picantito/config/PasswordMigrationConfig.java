package com.picantito.picantito.config;

import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class PasswordMigrationConfig {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner migratePasswords() {
        return args -> {
            List<User> users = usuarioRepository.findAll();
            
            for (User user : users) {
                String password = user.getContrasenia();
                
                // Solo encriptar si la contraseña no está ya encriptada (BCrypt tiene 60 caracteres)
                if (password != null && !password.startsWith("$2a$") && password.length() < 60) {
                    String encodedPassword = passwordEncoder.encode(password);
                    user.setContrasenia(encodedPassword);
                    usuarioRepository.save(user);
                    System.out.println("Contraseña migrada para usuario: " + user.getNombreUsuario());
                }
            }
            
            System.out.println("Migración de contraseñas completada.");
        };
    }
}
