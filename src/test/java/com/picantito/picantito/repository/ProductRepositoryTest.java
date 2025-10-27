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
 * Total: 10 tests (5 CRUD + 5 consultas personalizadas)
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("ProductRepository - CRUD y Consultas Tests")
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

    // ========== PRUEBAS CRUD (5 tests) ==========

    @Test
    @DisplayName("CRUD 1: Crear/Guardar un producto")
    void testCreate() {
        Producto savedProducto = productRepository.save(tacoAlPastor);

        assertThat(savedProducto).isNotNull();
        assertThat(savedProducto.getId()).isNotNull();
        assertThat(savedProducto.getNombre()).isEqualTo("Taco al Pastor");
        assertThat(savedProducto.getActivo()).isTrue();
    }

    @Test
    @DisplayName("CRUD 2: Leer/Encontrar producto por ID")
    void testRead() {
        Producto savedProducto = productRepository.save(tacoAlPastor);

        Optional<Producto> foundProducto = productRepository.findById(savedProducto.getId());

        assertThat(foundProducto).isPresent();
        assertThat(foundProducto.get().getNombre()).isEqualTo("Taco al Pastor");
    }

    @Test
    @DisplayName("CRUD 3: Actualizar un producto")
    void testUpdate() {
        Producto savedProducto = productRepository.save(tacoAlPastor);
        Integer productoId = savedProducto.getId();

        savedProducto.setPrecioDeVenta(28.0f);
        savedProducto.setDescripcion("Taco al pastor mejorado");
        Producto updatedProducto = productRepository.save(savedProducto);

        assertThat(updatedProducto.getId()).isEqualTo(productoId);
        assertThat(updatedProducto.getPrecioDeVenta()).isEqualTo(28.0f);
        assertThat(updatedProducto.getDescripcion()).isEqualTo("Taco al pastor mejorado");
    }

    @Test
    @DisplayName("CRUD 4: Eliminar un producto")
    void testDelete() {
        Producto savedProducto = productRepository.save(tacoAlPastor);
        Integer productoId = savedProducto.getId();

        productRepository.deleteById(productoId);

        Optional<Producto> deletedProducto = productRepository.findById(productoId);
        assertThat(deletedProducto).isEmpty();
    }

    @Test
    @DisplayName("CRUD 5: Listar todos los productos")
    void testReadAll() {
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);
        productRepository.save(quesadilla);

        List<Producto> productos = productRepository.findAll();

        assertThat(productos).isNotNull();
        assertThat(productos).hasSize(3);
    }

    // ========== CONSULTAS PERSONALIZADAS (5 tests) ==========

    @Test
    @DisplayName("Consulta 1: Encontrar productos disponibles")
    void testFindByDisponibleTrue() {
        productRepository.save(tacoAlPastor);   // disponible=true
        productRepository.save(tacoSuadero);    // disponible=true
        productRepository.save(quesadilla);     // disponible=false

        List<Producto> productosDisponibles = productRepository.findByDisponibleTrue();

        assertThat(productosDisponibles).hasSize(2);
        assertThat(productosDisponibles)
                .extracting(Producto::getDisponible)
                .containsOnly(true);
    }

    @Test
    @DisplayName("Consulta 2: Encontrar productos activos")
    void testFindByActivoTrue() {
        productRepository.save(tacoAlPastor);   // activo=true
        productRepository.save(tacoSuadero);    // activo=true
        productRepository.save(burrito);        // activo=false

        List<Producto> productosActivos = productRepository.findByActivoTrue();

        assertThat(productosActivos).hasSize(2);
        assertThat(productosActivos)
                .extracting(Producto::getActivo)
                .containsOnly(true);
    }

    @Test
    @DisplayName("Consulta 3: Buscar productos por nombre (contiene texto)")
    void testFindByNombreContaining() {
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);
        productRepository.save(quesadilla);

        List<Producto> tacosFound = productRepository.findByNombreContainingIgnoreCase("taco");

        assertThat(tacosFound).hasSize(2);
        assertThat(tacosFound)
                .extracting(Producto::getNombre)
                .containsExactlyInAnyOrder("Taco al Pastor", "Taco de Suadero");
    }

    @Test
    @DisplayName("Consulta 4: Encontrar producto por nombre exacto")
    void testFindByNombre() {
        productRepository.save(tacoAlPastor);
        productRepository.save(tacoSuadero);

        Optional<Producto> found = productRepository.findByNombre("Taco al Pastor");

        assertThat(found).isPresent();
        assertThat(found.get().getNombre()).isEqualTo("Taco al Pastor");
        assertThat(found.get().getDescripcion()).isEqualTo("Delicioso taco con carne al pastor");
    }

    @Test
    @DisplayName("Consulta 5: Verificar que no se encuentre producto con nombre inexistente")
    void testFindByNombreNotFound() {
        productRepository.save(tacoAlPastor);

        Optional<Producto> found = productRepository.findByNombre("Producto Inexistente");

        assertThat(found).isEmpty();
    }
}
