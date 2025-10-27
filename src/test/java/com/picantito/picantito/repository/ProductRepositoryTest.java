package com.picantito.picantito.repository;

import com.picantito.picantito.entities.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas del repositorio de Productos
 * Usa base de datos H2 en memoria configurada en application-test.properties
 * Total: 10 tests (5 CRUD + 5 consultas personalizadas)
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Pruebas de ProductRepository")
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    private Producto tacoAlPastor;
    private Producto tacoSuadero;
    private Producto quesadilla;
    private Producto burrito;

    @BeforeEach
    void init() {
        productRepository.deleteAll();

        tacoAlPastor = new Producto();
        tacoAlPastor.setNombre("Taco al Pastor");
        tacoAlPastor.setDescripcion("Delicioso taco con carne al pastor");
        tacoAlPastor.setPrecioDeVenta(25.0f);
        tacoAlPastor.setPrecioDeAdquisicion(15.0f);
        tacoAlPastor.setImagen("taco-pastor.jpg");
        tacoAlPastor.setDisponible(true);
        tacoAlPastor.setCalificacion(5);
        tacoAlPastor.setActivo(true);

        tacoSuadero = new Producto();
        tacoSuadero.setNombre("Taco de Suadero");
        tacoSuadero.setDescripcion("Taco con carne de suadero");
        tacoSuadero.setPrecioDeVenta(30.0f);
        tacoSuadero.setPrecioDeAdquisicion(18.0f);
        tacoSuadero.setImagen("taco-suadero.jpg");
        tacoSuadero.setDisponible(true);
        tacoSuadero.setCalificacion(4);
        tacoSuadero.setActivo(true);

        quesadilla = new Producto();
        quesadilla.setNombre("Quesadilla");
        quesadilla.setDescripcion("Quesadilla con queso Oaxaca");
        quesadilla.setPrecioDeVenta(35.0f);
        quesadilla.setPrecioDeAdquisicion(20.0f);
        quesadilla.setImagen("quesadilla.jpg");
        quesadilla.setDisponible(false);
        quesadilla.setCalificacion(4);
        quesadilla.setActivo(true);

        burrito = new Producto();
        burrito.setNombre("Burrito");
        burrito.setDescripcion("Burrito grande con frijoles");
        burrito.setPrecioDeVenta(40.0f);
        burrito.setPrecioDeAdquisicion(25.0f);
        burrito.setImagen("burrito.jpg");
        burrito.setDisponible(true);
        burrito.setCalificacion(5);
        burrito.setActivo(false);
    }

    // ==================== PRUEBAS CRUD (5) ====================

    @Test
    @DisplayName("Debería guardar un nuevo producto exitosamente")
    void testCreate() {
        // Arrange - Ya tenemos tacoAlPastor del @BeforeEach

        // Act
        Producto savedProducto = productRepository.save(tacoAlPastor);

        // Assert
        assertThat(savedProducto).isNotNull();
        assertThat(savedProducto.getId()).isNotNull();
        assertThat(savedProducto.getNombre()).isEqualTo("Taco al Pastor");
        assertThat(savedProducto.getActivo()).isTrue();
    }

    @Test
    @DisplayName("Debería encontrar un producto por ID")
    void testRead() {
        // Arrange
        Producto savedProducto = productRepository.save(tacoAlPastor);

        // Act
        Optional<Producto> foundProducto = productRepository.findById(savedProducto.getId());

        // Assert
        assertThat(foundProducto).isPresent();
        assertThat(foundProducto.get().getNombre()).isEqualTo("Taco al Pastor");
    }

    @Test
    @DisplayName("Debería actualizar un producto existente")
    void testUpdate() {
        // Arrange
        Producto savedProducto = productRepository.save(tacoAlPastor);
        Integer productoId = savedProducto.getId();

        // Act
        savedProducto.setPrecioDeVenta(28.0f);
        savedProducto.setDescripcion("Taco al pastor mejorado");
        Producto updatedProducto = productRepository.save(savedProducto);

        // Assert
        assertThat(updatedProducto.getId()).isEqualTo(productoId);
        assertThat(updatedProducto.getPrecioDeVenta()).isEqualTo(28.0f);
        assertThat(updatedProducto.getDescripcion()).isEqualTo("Taco al pastor mejorado");
    }

    @Test
    @DisplayName("Debería eliminar un producto por ID")
    void testDelete() {
        // Arrange
        Producto savedProducto = productRepository.save(tacoAlPastor);
        Integer productoId = savedProducto.getId();

        // Act
        productRepository.deleteById(productoId);

        // Assert
        Optional<Producto> deletedProducto = productRepository.findById(productoId);
        assertThat(deletedProducto).isEmpty();
    }

    @Test
    @DisplayName("Debería listar todos los productos")
    void testReadAll() {
        // Arrange
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);
        productRepository.save(quesadilla);

        // Act
        List<Producto> productos = productRepository.findAll();

        // Assert
        assertThat(productos).isNotNull();
        assertThat(productos).hasSize(3);
    }

    // ==================== CONSULTAS PERSONALIZADAS (5) ====================

    @Test
    @DisplayName("Debería encontrar todos los productos disponibles")
    void testFindByDisponibleTrue() {
        // Arrange
        productRepository.save(tacoAlPastor);   // disponible=true
        productRepository.save(tacoSuadero);    // disponible=true
        productRepository.save(quesadilla);     // disponible=false

        // Act
        List<Producto> productosDisponibles = productRepository.findByDisponibleTrue();

        // Assert
        assertThat(productosDisponibles).hasSize(2);
        assertThat(productosDisponibles)
                .extracting(Producto::getDisponible)
                .containsOnly(true);
    }

    @Test
    @DisplayName("Debería encontrar todos los productos activos")
    void testFindByActivoTrue() {
        // Arrange
        productRepository.save(tacoAlPastor);   // activo=true
        productRepository.save(tacoSuadero);    // activo=true
        productRepository.save(burrito);        // activo=false

        // Act
        List<Producto> productosActivos = productRepository.findByActivoTrue();

        // Assert
        assertThat(productosActivos).hasSize(2);
        assertThat(productosActivos)
                .extracting(Producto::getActivo)
                .containsOnly(true);
    }

    @Test
    @DisplayName("Debería buscar productos por nombre que contenga un texto")
    void testFindByNombreContaining() {
        // Arrange
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);
        productRepository.save(quesadilla);

        // Act
        List<Producto> tacosFound = productRepository.findByNombreContainingIgnoreCase("taco");

        // Assert
        assertThat(tacosFound).hasSize(2);
        assertThat(tacosFound)
                .extracting(Producto::getNombre)
                .containsExactlyInAnyOrder("Taco al Pastor", "Taco de Suadero");
    }

    @Test
    @DisplayName("Debería encontrar un producto por nombre exacto")
    void testFindByNombre() {
        // Arrange
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);

        // Act
        Optional<Producto> found = productRepository.findByNombre("Taco al Pastor");

        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getNombre()).isEqualTo("Taco al Pastor");
        assertThat(found.get().getDescripcion()).isEqualTo("Delicioso taco con carne al pastor");
    }

    @Test
    @DisplayName("Debería retornar vacío cuando no encuentra producto por nombre")
    void testFindByNombreNotFound() {
        // Arrange
        productRepository.save(tacoAlPastor);

        // Act
        Optional<Producto> found = productRepository.findByNombre("Producto Inexistente");

        // Assert
        assertThat(found).isEmpty();
    }
}
