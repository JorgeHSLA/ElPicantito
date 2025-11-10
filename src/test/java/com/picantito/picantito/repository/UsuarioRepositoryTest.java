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
 * Pruebas del repositorio de Usuarios
 * Usa base de datos H2 en memoria configurada en application-test.properties
 * Total: 10 tests (5 CRUD + 5 consultas personalizadas)
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Pruebas de UsuarioRepository")
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private User usuario1;
    private User usuario2;
    private User usuario3;

    @BeforeEach
    void init() {
        // Limpiar datos antes de cada test
        usuarioRepository.deleteAll();

        // Crear usuarios de prueba con diferentes roles y estados
        usuario1 = new User();
        usuario1.setNombreCompleto("Juan Pérez");
        usuario1.setNombreUsuario("juanp");
        usuario1.setTelefono("3001234567");
        usuario1.setCorreo("juan@test.com");
        usuario1.setContrasenia("password123");
        usuario1.setEstado("ACTIVO");
        usuario1.addRoleByName("CLIENTE");
        usuario1.setActivo(true);

        usuario2 = new User();
        usuario2.setNombreCompleto("María García");
        usuario2.setNombreUsuario("mariag");
        usuario2.setTelefono("3109876543");
        usuario2.setCorreo("maria@test.com");
        usuario2.setContrasenia("password456");
        usuario2.setEstado("INACTIVO");
        usuario2.addRoleByName("REPARTIDOR");
        usuario2.setActivo(false);

        usuario3 = new User();
        usuario3.setNombreCompleto("Admin User");
        usuario3.setNombreUsuario("admin");
        usuario3.setTelefono("3201111111");
        usuario3.setCorreo("admin@test.com");
        usuario3.setContrasenia("adminpass");
        usuario3.setEstado("ACTIVO");
        usuario3.addRoleByName("ADMINISTRADOR");
        usuario3.setActivo(true);
    }

    // ==================== CRUD TESTS (5) ====================

    @Test
    @DisplayName("CRUD 1: Guardar un nuevo Usuario exitosamente")
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
    @DisplayName("Debería encontrar un usuario por ID")
    void testFindById() {
        // Arrange
        User savedUser = usuarioRepository.save(usuario1);

        // Act
        Optional<User> foundUser = usuarioRepository.findById(savedUser.getId());

        // Assert
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreUsuario()).isEqualTo("juanp");
        assertThat(foundUser.get().getCorreo()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("Debería listar todos los usuarios")
    void testFindAll() {
        // Arrange
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);
        usuarioRepository.save(usuario3);

        // Act
        List<User> usuarios = usuarioRepository.findAll();

        // Assert
        assertThat(usuarios).hasSize(3);
        assertThat(usuarios).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "mariag", "admin");
    }

    @Test
    @DisplayName("Debería actualizar un usuario existente")
    void testUpdateUsuario() {
        // Arrange
        User savedUser = usuarioRepository.save(usuario1);
        Integer userId = savedUser.getId();

        // Act
        savedUser.setNombreCompleto("Juan Carlos Pérez");
        savedUser.setTelefono("3009999999");
        savedUser.setEstado("SUSPENDIDO");
        User updatedUser = usuarioRepository.save(savedUser);

        // Assert
        assertThat(updatedUser.getId()).isEqualTo(userId);
        assertThat(updatedUser.getNombreCompleto()).isEqualTo("Juan Carlos Pérez");
        assertThat(updatedUser.getTelefono()).isEqualTo("3009999999");
        assertThat(updatedUser.getEstado()).isEqualTo("SUSPENDIDO");
        assertThat(updatedUser.getNombreUsuario()).isEqualTo("juanp"); // Sin cambios
    }

    @Test
    @DisplayName("Debería eliminar un usuario por ID")
    void testDeleteUsuario() {
        // Arrange
        User savedUser = usuarioRepository.save(usuario1);
        Integer userId = savedUser.getId();

        // Act
        usuarioRepository.deleteById(userId);

        // Assert
        Optional<User> deletedUser = usuarioRepository.findById(userId);
        assertThat(deletedUser).isNotPresent();
        
        // Verificar que el usuario fue completamente eliminado
        List<User> allUsers = usuarioRepository.findAll();
        assertThat(allUsers).doesNotContain(savedUser);
    }

    // ==================== CONSULTAS PERSONALIZADAS (5) ====================

    @Test
    @DisplayName("Debería encontrar un usuario por nombre de usuario")
    void testFindByNombreUsuario() {
        // Arrange
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);

        // Act
        Optional<User> foundUser = usuarioRepository.findByNombreUsuario("juanp");

        // Assert
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreCompleto()).isEqualTo("Juan Pérez");
        assertThat(foundUser.get().getCorreo()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("Debería encontrar un usuario por correo")
    void testFindByCorreo() {
        // Arrange
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);

        // Act
        Optional<User> foundUser = usuarioRepository.findByCorreo("maria@test.com");

        // Assert
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getNombreUsuario()).isEqualTo("mariag");
        assertThat(foundUser.get().getRol()).isEqualTo("REPARTIDOR");
    }

    @Test
    @DisplayName("Debería verificar si existe un nombre de usuario")
    void testExistsByNombreUsuario() {
        // Arrange
        usuarioRepository.save(usuario1);

        // Act
        boolean exists = usuarioRepository.existsByNombreUsuario("juanp");
        boolean notExists = usuarioRepository.existsByNombreUsuario("nonexistent");

        // Assert
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Debería encontrar todos los usuarios activos")
    void testFindByActivoTrue() {
        // Arrange
        usuarioRepository.save(usuario1); // activo = true
        usuarioRepository.save(usuario2); // activo = false
        usuarioRepository.save(usuario3); // activo = true

        // Act
        List<User> activeUsers = usuarioRepository.findByActivoTrue();

        // Assert
        assertThat(activeUsers).hasSize(2);
        assertThat(activeUsers).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "admin");
        assertThat(activeUsers).allMatch(user -> user.getActivo());
    }

    @Test
    @DisplayName("Debería encontrar usuarios por rol y estado")
    void testFindByRolAndEstado() {
        // Arrange
        usuarioRepository.save(usuario1); // CLIENTE, ACTIVO
        usuarioRepository.save(usuario2); // REPARTIDOR, INACTIVO
        usuarioRepository.save(usuario3); // ADMINISTRADOR, ACTIVO

        // Crear otro cliente activo
        User usuario4 = new User();
        usuario4.setNombreCompleto("Pedro López");
        usuario4.setNombreUsuario("pedrol");
        usuario4.setTelefono("3151234567");
        usuario4.setCorreo("pedro@test.com");
        usuario4.setContrasenia("pass789");
        usuario4.setEstado("ACTIVO");
        usuario4.addRoleByName("CLIENTE");
        usuario4.setActivo(true);
        usuarioRepository.save(usuario4);

        // Act
        List<User> activeClientes = usuarioRepository.findByRolAndEstado("CLIENTE", "ACTIVO");
        List<User> inactiveRepartidores = usuarioRepository.findByRolAndEstado("REPARTIDOR", "INACTIVO");

        // Assert
        assertThat(activeClientes).hasSize(2);
        assertThat(activeClientes).extracting(User::getNombreUsuario)
            .containsExactlyInAnyOrder("juanp", "pedrol");
        
        assertThat(inactiveRepartidores).hasSize(1);
        assertThat(inactiveRepartidores.get(0).getNombreUsuario()).isEqualTo("mariag");
    }
}
