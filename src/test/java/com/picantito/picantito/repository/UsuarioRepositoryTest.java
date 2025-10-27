package com.picantito.picantito.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.picantito.picantito.entities.User;

/**
 * Test class for UsuarioRepository
 * Uses H2 in-memory database configured in application-test.properties
 * Tests CRUD operations and custom queries considering User relationships with Pedido
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Usuario Repository Tests")
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private User usuario1;
    private User usuario2;
    private User usuario3;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        usuarioRepository.deleteAll();

        // Create test users with different roles and states
        usuario1 = new User();
        usuario1.setNombreCompleto("Juan Pérez");
        usuario1.setNombreUsuario("juanp");
        usuario1.setTelefono("3001234567");
        usuario1.setCorreo("juan@test.com");
        usuario1.setContrasenia("password123");
        usuario1.setEstado("ACTIVO");
        usuario1.setRol("CLIENTE");
        usuario1.setActivo(true);

        usuario2 = new User();
        usuario2.setNombreCompleto("María García");
        usuario2.setNombreUsuario("mariag");
        usuario2.setTelefono("3109876543");
        usuario2.setCorreo("maria@test.com");
        usuario2.setContrasenia("password456");
        usuario2.setEstado("INACTIVO");
        usuario2.setRol("REPARTIDOR");
        usuario2.setActivo(false);

        usuario3 = new User();
        usuario3.setNombreCompleto("Admin User");
        usuario3.setNombreUsuario("admin");
        usuario3.setTelefono("3201111111");
        usuario3.setCorreo("admin@test.com");
        usuario3.setContrasenia("adminpass");
        usuario3.setEstado("ACTIVO");
        usuario3.setRol("ADMINISTRADOR");
        usuario3.setActivo(true);
    }

    // ==================== CRUD TESTS (5) ====================

    @Test
    @DisplayName("Should save a new User successfully")
    void testSaveUsuario() {
        // When
        User savedUser = usuarioRepository.save(usuario1);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getNombreCompleto()).isEqualTo("Juan Pérez");
        assertThat(savedUser.getNombreUsuario()).isEqualTo("juanp");
        assertThat(savedUser.getCorreo()).isEqualTo("juan@test.com");
        assertThat(savedUser.getRol()).isEqualTo("CLIENTE");
        assertThat(savedUser.getActivo()).isTrue();
    }

    @Test
    @DisplayName("Should find a User by ID")
    void testFindById() {
        // Given
        User savedUser = usuarioRepository.save(usuario1);

        // When
        Optional<User> foundUser = usuarioRepository.findById(savedUser.getId());

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreUsuario()).isEqualTo("juanp");
        assertThat(foundUser.get().getCorreo()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("Should find all Users")
    void testFindAll() {
        // Given
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);
        usuarioRepository.save(usuario3);

        // When
        List<User> usuarios = usuarioRepository.findAll();

        // Then
        assertThat(usuarios).hasSize(3);
        assertThat(usuarios).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "mariag", "admin");
    }

    @Test
    @DisplayName("Should update an existing User")
    void testUpdateUsuario() {
        // Given
        User savedUser = usuarioRepository.save(usuario1);
        Integer userId = savedUser.getId();

        // When
        savedUser.setNombreCompleto("Juan Carlos Pérez");
        savedUser.setTelefono("3009999999");
        savedUser.setEstado("SUSPENDIDO");
        User updatedUser = usuarioRepository.save(savedUser);

        // Then
        assertThat(updatedUser.getId()).isEqualTo(userId);
        assertThat(updatedUser.getNombreCompleto()).isEqualTo("Juan Carlos Pérez");
        assertThat(updatedUser.getTelefono()).isEqualTo("3009999999");
        assertThat(updatedUser.getEstado()).isEqualTo("SUSPENDIDO");
        assertThat(updatedUser.getNombreUsuario()).isEqualTo("juanp"); // Unchanged
    }

    @Test
    @DisplayName("Should delete a User by ID (considering cascade relationships)")
    void testDeleteUsuario() {
        // Given
        User savedUser = usuarioRepository.save(usuario1);
        Integer userId = savedUser.getId();

        // When
        usuarioRepository.deleteById(userId);

        // Then
        Optional<User> deletedUser = usuarioRepository.findById(userId);
        assertThat(deletedUser).isNotPresent();
        
        // Verify the user is completely removed
        List<User> allUsers = usuarioRepository.findAll();
        assertThat(allUsers).doesNotContain(savedUser);
    }

    // ==================== CUSTOM QUERY TESTS (5) ====================

    @Test
    @DisplayName("Should find User by nombreUsuario")
    void testFindByNombreUsuario() {
        // Given
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);

        // When
        Optional<User> foundUser = usuarioRepository.findByNombreUsuario("juanp");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreCompleto()).isEqualTo("Juan Pérez");
        assertThat(foundUser.get().getCorreo()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("Should find User by correo")
    void testFindByCorreo() {
        // Given
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);

        // When
        Optional<User> foundUser = usuarioRepository.findByCorreo("maria@test.com");

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreUsuario()).isEqualTo("mariag");
        assertThat(foundUser.get().getRol()).isEqualTo("REPARTIDOR");
    }

    @Test
    @DisplayName("Should check if nombreUsuario exists")
    void testExistsByNombreUsuario() {
        // Given
        usuarioRepository.save(usuario1);

        // When
        boolean exists = usuarioRepository.existsByNombreUsuario("juanp");
        boolean notExists = usuarioRepository.existsByNombreUsuario("nonexistent");

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should find all active Users (activo = true)")
    void testFindByActivoTrue() {
        // Given
        usuarioRepository.save(usuario1); // activo = true
        usuarioRepository.save(usuario2); // activo = false
        usuarioRepository.save(usuario3); // activo = true

        // When
        List<User> activeUsers = usuarioRepository.findByActivoTrue();

        // Then
        assertThat(activeUsers).hasSize(2);
        assertThat(activeUsers).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "admin");
        assertThat(activeUsers).allMatch(user -> user.getActivo());
    }

    @Test
    @DisplayName("Should find Users by rol and estado")
    void testFindByRolAndEstado() {
        // Given
        usuarioRepository.save(usuario1); // CLIENTE, ACTIVO
        usuarioRepository.save(usuario2); // REPARTIDOR, INACTIVO
        usuarioRepository.save(usuario3); // ADMINISTRADOR, ACTIVO

        // Create another active cliente
        User usuario4 = new User();
        usuario4.setNombreCompleto("Pedro López");
        usuario4.setNombreUsuario("pedrol");
        usuario4.setTelefono("3151234567");
        usuario4.setCorreo("pedro@test.com");
        usuario4.setContrasenia("pass789");
        usuario4.setEstado("ACTIVO");
        usuario4.setRol("CLIENTE");
        usuario4.setActivo(true);
        usuarioRepository.save(usuario4);

        // When
        List<User> activeClientes = usuarioRepository.findByRolAndEstado("CLIENTE", "ACTIVO");
        List<User> inactiveRepartidores = usuarioRepository.findByRolAndEstado("REPARTIDOR", "INACTIVO");

        // Then
        assertThat(activeClientes).hasSize(2);
        assertThat(activeClientes).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "pedrol");
        
        assertThat(inactiveRepartidores).hasSize(1);
        assertThat(inactiveRepartidores.get(0).getNombreUsuario()).isEqualTo("mariag");
    }
}
