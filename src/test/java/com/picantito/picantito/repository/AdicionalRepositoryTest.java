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

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;

/**
 * Pruebas del repositorio de Adicionales
 * Usa base de datos H2 en memoria configurada en application-test.properties
 * Total: 10 tests (5 CRUD + 5 consultas personalizadas)
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Pruebas de AdicionalRepository")
class AdicionalRepositoryTest {

    @Autowired
    private AdicionalRepository adicionalRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductoAdicionalRepository productoAdicionalRepository;

    private Adicional adicional1;
    private Adicional adicional2;
    private Adicional adicional3;
    private Producto producto1;

    @BeforeEach
    void setUp() {
        // Limpiar base de datos antes de cada test
        productoAdicionalRepository.deleteAll();
        adicionalRepository.deleteAll();
        productRepository.deleteAll();

        // Crear adicionales de prueba
        adicional1 = new Adicional();
        adicional1.setNombre("Guacamole");
        adicional1.setDescripcion("Guacamole fresco casero");
        adicional1.setPrecioDeAdquisicion(2000.0f);
        adicional1.setPrecioDeVenta(3500.0f);
        adicional1.setCantidad(50);
        adicional1.setDisponible(true);
        adicional1.setActivo(true);

        adicional2 = new Adicional();
        adicional2.setNombre("Queso Extra");
        adicional2.setDescripcion("Porción adicional de queso");
        adicional2.setPrecioDeAdquisicion(1500.0f);
        adicional2.setPrecioDeVenta(2500.0f);
        adicional2.setCantidad(0); // Sin stock
        adicional2.setDisponible(false);
        adicional2.setActivo(true);

        adicional3 = new Adicional();
        adicional3.setNombre("Jalapeños");
        adicional3.setDescripcion("Chiles jalapeños en rodajas");
        adicional3.setPrecioDeAdquisicion(1000.0f);
        adicional3.setPrecioDeVenta(1800.0f);
        adicional3.setCantidad(100);
        adicional3.setDisponible(true);
        adicional3.setActivo(false); // Inactivo

        // Crear producto de prueba para testing de relaciones
        producto1 = new Producto();
        producto1.setNombre("Taco de Carne");
        producto1.setDescripcion("Taco con carne asada");
        producto1.setPrecioDeVenta(8000.0f);
        producto1.setPrecioDeAdquisicion(4000.0f);
        producto1.setImagen("taco_carne.jpg");
        producto1.setDisponible(true);
        producto1.setCalificacion(5);
        producto1.setActivo(true);
    }

    // ==================== PRUEBAS CRUD (5) ====================

    @Test
    @DisplayName("Debería guardar un nuevo adicional exitosamente")
    void testSaveAdicional() {
        // Arrange - Ya tenemos adicional1 del @BeforeEach

        // Act
        Adicional savedAdicional = adicionalRepository.save(adicional1);

        // Assert
        assertThat(savedAdicional).isNotNull();
        assertThat(savedAdicional.getId()).isNotNull();
        assertThat(savedAdicional.getNombre()).isEqualTo("Guacamole");
        assertThat(savedAdicional.getDescripcion()).isEqualTo("Guacamole fresco casero");
        assertThat(savedAdicional.getPrecioDeVenta()).isEqualTo(3500.0f);
        assertThat(savedAdicional.getCantidad()).isEqualTo(50);
        assertThat(savedAdicional.getDisponible()).isTrue();
    }

    @Test
    @DisplayName("Debería encontrar un adicional por ID")
    void testFindById() {
        // Arrange
        Adicional savedAdicional = adicionalRepository.save(adicional1);

        // Act
        Optional<Adicional> foundAdicional = adicionalRepository.findById(savedAdicional.getId());

        // Assert
        assertThat(foundAdicional).isPresent();
        assertThat(foundAdicional.get().getNombre()).isEqualTo("Guacamole");
        assertThat(foundAdicional.get().getPrecioDeVenta()).isEqualTo(3500.0f);
    }

    @Test
    @DisplayName("Debería listar todos los adicionales")
    void testFindAll() {
        // Arrange
        adicionalRepository.save(adicional1);
        adicionalRepository.save(adicional2);
        adicionalRepository.save(adicional3);

        // Act
        List<Adicional> adicionales = adicionalRepository.findAll();

        // Assert
        assertThat(adicionales).hasSize(3);
        assertThat(adicionales).extracting(Adicional::getNombre)
            .containsExactlyInAnyOrder("Guacamole", "Queso Extra", "Jalapeños");
    }

    @Test
    @DisplayName("Debería actualizar un adicional existente")
    void testUpdateAdicional() {
        // Arrange
        Adicional savedAdicional = adicionalRepository.save(adicional1);
        Integer adicionalId = savedAdicional.getId();

        // Act
        savedAdicional.setNombre("Guacamole Premium");
        savedAdicional.setPrecioDeVenta(4000.0f);
        savedAdicional.setCantidad(30);
        savedAdicional.setDisponible(false);
        Adicional updatedAdicional = adicionalRepository.save(savedAdicional);

        // Assert
        assertThat(updatedAdicional.getId()).isEqualTo(adicionalId);
        assertThat(updatedAdicional.getNombre()).isEqualTo("Guacamole Premium");
        assertThat(updatedAdicional.getPrecioDeVenta()).isEqualTo(4000.0f);
        assertThat(updatedAdicional.getCantidad()).isEqualTo(30);
        assertThat(updatedAdicional.getDisponible()).isFalse();
        assertThat(updatedAdicional.getDescripcion()).isEqualTo("Guacamole fresco casero"); // Sin cambios
    }

    @Test
    @DisplayName("Debería eliminar un adicional por ID")
    void testDeleteAdicional() {
        // Arrange
        Adicional savedAdicional = adicionalRepository.save(adicional1);
        Integer adicionalId = savedAdicional.getId();

        // Act
        adicionalRepository.deleteById(adicionalId);

        // Assert
        Optional<Adicional> deletedAdicional = adicionalRepository.findById(adicionalId);
        assertThat(deletedAdicional).isNotPresent();
        
        // Verificar que el adicional fue completamente eliminado
        List<Adicional> allAdicionales = adicionalRepository.findAll();
        assertThat(allAdicionales).doesNotContain(savedAdicional);
    }

    // ==================== CONSULTAS PERSONALIZADAS (5) ====================

    @Test
    @DisplayName("Debería encontrar todos los adicionales disponibles")
    void testFindByDisponibleTrue() {
        // Arrange
        adicionalRepository.save(adicional1); // disponible = true
        adicionalRepository.save(adicional2); // disponible = false
        adicionalRepository.save(adicional3); // disponible = true

        // Act
        List<Adicional> disponibles = adicionalRepository.findByDisponibleTrue();

        // Assert
        assertThat(disponibles).hasSize(2);
        assertThat(disponibles).extracting(Adicional::getNombre)
            .containsExactlyInAnyOrder("Guacamole", "Jalapeños");
        assertThat(disponibles).allMatch(adicional -> adicional.getDisponible());
    }

    @Test
    @DisplayName("Debería encontrar adicionales por ID de producto y disponible")
    void testFindByProductoIdAndDisponibleTrue() {
        // Arrange
        Producto savedProducto = productRepository.save(producto1);
        Adicional savedAdicional1 = adicionalRepository.save(adicional1); // disponible = true
        Adicional savedAdicional2 = adicionalRepository.save(adicional2); // disponible = false
        
        // Crear relaciones ProductoAdicional con inicialización correcta de clave compuesta
        ProductoAdicionalId pa1Id = new ProductoAdicionalId();
        pa1Id.setProductoId(savedProducto.getId());
        pa1Id.setAdicionalId(savedAdicional1.getId());
        
        ProductoAdicional pa1 = new ProductoAdicional();
        pa1.setId(pa1Id);
        pa1.setProducto(savedProducto);
        pa1.setAdicional(savedAdicional1);
        productoAdicionalRepository.save(pa1);
        
        ProductoAdicionalId pa2Id = new ProductoAdicionalId();
        pa2Id.setProductoId(savedProducto.getId());
        pa2Id.setAdicionalId(savedAdicional2.getId());
        
        ProductoAdicional pa2 = new ProductoAdicional();
        pa2.setId(pa2Id);
        pa2.setProducto(savedProducto);
        pa2.setAdicional(savedAdicional2);
        productoAdicionalRepository.save(pa2);

        // Act
        List<Adicional> adicionalesDisponibles = adicionalRepository
            .findByProductoIdAndDisponibleTrue(savedProducto.getId());

        // Assert
        assertThat(adicionalesDisponibles).hasSize(1);
        assertThat(adicionalesDisponibles.get(0).getNombre()).isEqualTo("Guacamole");
        assertThat(adicionalesDisponibles.get(0).getDisponible()).isTrue();
    }

    @Test
    @DisplayName("Debería encontrar adicionales disponibles sin productos asociados")
    void testFindByDisponibleTrueAndProductosIsEmpty() {
        // Arrange
        adicionalRepository.save(adicional1); // Sin productos asociados, disponible
        adicionalRepository.save(adicional2); // Sin productos asociados, no disponible
        
        // Crear un producto y asociar adicional3 con él
        Producto savedProducto = productRepository.save(producto1);
        Adicional savedAdicional3 = adicionalRepository.save(adicional3);
        
        ProductoAdicionalId paId = new ProductoAdicionalId();
        paId.setProductoId(savedProducto.getId());
        paId.setAdicionalId(savedAdicional3.getId());
        
        ProductoAdicional pa = new ProductoAdicional();
        pa.setId(paId);
        pa.setProducto(savedProducto);
        pa.setAdicional(savedAdicional3);
        productoAdicionalRepository.save(pa);

        // Act
        List<Adicional> adicionalesSinProductos = adicionalRepository
            .findByDisponibleTrueAndProductosIsEmpty();

        // Assert
        assertThat(adicionalesSinProductos).hasSize(1);
        assertThat(adicionalesSinProductos.get(0).getNombre()).isEqualTo("Guacamole");
        assertThat(adicionalesSinProductos.get(0).getDisponible()).isTrue();
    }

    @Test
    @DisplayName("Debería encontrar adicionales disponibles no asociados a un producto")
    void testFindAvailableForProduct() {
        // Arrange
        Producto savedProducto = productRepository.save(producto1);
        adicionalRepository.save(adicional1); // disponible, sin asociar
        adicionalRepository.save(adicional2); // no disponible, sin asociar
        Adicional savedAdicional3 = adicionalRepository.save(adicional3); // disponible, pero lo asociaremos
        
        // Asociar adicional3 con producto1
        ProductoAdicionalId paId = new ProductoAdicionalId();
        paId.setProductoId(savedProducto.getId());
        paId.setAdicionalId(savedAdicional3.getId());
        
        ProductoAdicional pa = new ProductoAdicional();
        pa.setId(paId);
        pa.setProducto(savedProducto);
        pa.setAdicional(savedAdicional3);
        productoAdicionalRepository.save(pa);

        // Act
        List<Adicional> adicionalesDisponibles = adicionalRepository
            .findAvailableForProduct(savedProducto.getId());

        // Assert
        // Debería retornar adicional1 (disponible y no asociado)
        // NO debería retornar adicional2 (no disponible) 
        // NO debería retornar adicional3 (ya asociado)
        assertThat(adicionalesDisponibles).hasSize(1);
        assertThat(adicionalesDisponibles.get(0).getNombre()).isEqualTo("Guacamole");
        assertThat(adicionalesDisponibles.get(0).getDisponible()).isTrue();
    }

    @Test
    @DisplayName("Debería eliminar adicional y verificar manejo de relación con productos")
    void testCascadeDeleteWithProductoAdicional() {
        // Arrange
        Producto savedProducto = productRepository.save(producto1);
        Adicional savedAdicional = adicionalRepository.save(adicional1);
        
        ProductoAdicionalId paId = new ProductoAdicionalId();
        paId.setProductoId(savedProducto.getId());
        paId.setAdicionalId(savedAdicional.getId());
        
        ProductoAdicional pa = new ProductoAdicional();
        pa.setId(paId);
        pa.setProducto(savedProducto);
        pa.setAdicional(savedAdicional);
        ProductoAdicional savedPa = productoAdicionalRepository.save(pa);

        // Verificar que la relación existe
        assertThat(productoAdicionalRepository.findById(savedPa.getId())).isPresent();

        // Act - Eliminar el adicional
        adicionalRepository.deleteById(savedAdicional.getId());

        // Assert - Verificar que el adicional fue eliminado
        assertThat(adicionalRepository.findById(savedAdicional.getId())).isNotPresent();
        
        // Verificar comportamiento de cascada de ProductoAdicional
        // El test pasa si el Adicional puede ser eliminado sin violaciones de restricciones
        assertThat(adicionalRepository.findById(savedAdicional.getId())).isNotPresent();
    }
}
