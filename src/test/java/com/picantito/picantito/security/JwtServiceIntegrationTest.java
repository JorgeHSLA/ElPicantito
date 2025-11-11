package com.picantito.picantito.security;

import com.picantito.picantito.entities.Role;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.RoleRepository;
import com.picantito.picantito.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class JwtServiceIntegrationTest {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Limpiar y crear roles de prueba
        usuarioRepository.deleteAll();
        roleRepository.deleteAll();

        Role adminRole = new Role();
        adminRole.setNombre("ADMIN");
        adminRole = roleRepository.save(adminRole);

        // Crear usuario de prueba
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        testUser = User.builder()
                .nombreUsuario("testuser")
                .nombreCompleto("Test User")
                .correo("test@test.com")
                .telefono("1234567890")
                .contrasenia(passwordEncoder.encode("password123"))
                .activo(true)
                .roles(roles)
                .build();

        testUser = usuarioRepository.save(testUser);
    }

    @Test
    void testGenerateToken() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractUsername() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);

        String username = jwtService.extractUsername(token);
        assertEquals("testuser", username);
    }

    @Test
    void testValidateToken() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);

        Boolean isValid = jwtService.validateToken(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    void testTokenContainsRoles() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        String token = jwtService.generateToken(userDetails);

        // El token debería contener roles
        assertNotNull(token);
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }
}
