package com.picantito.picantito.service;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.PedidoRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de INTEGRACIÓN del servicio de Pedidos
 * Estas pruebas usan la base de datos H2 real y todos los componentes reales
 * Total: 5 tests
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("PedidoService - Integration Tests")
class PedidoServiceIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductRepository productRepository;

    private User cliente;
    private User repartidor;
    private Producto producto;

    @BeforeEach
    void setUp() {
        // Limpiar datos
        pedidoRepository.deleteAll();
        productRepository.deleteAll();
        usuarioRepository.deleteAll();

        // Crear cliente
        cliente = new User();
        cliente.setNombreCompleto("Juan Pérez");
        cliente.setNombreUsuario("juan");
        cliente.setCorreo("juan@test.com");
        cliente.setTelefono("1234567890");
        cliente.setContrasenia("password123");
        cliente.setRol("CLIENTE");
        cliente.setEstado("ACTIVO");
        cliente = usuarioRepository.save(cliente);

        // Crear repartidor
        repartidor = new User();
        repartidor.setNombreCompleto("Carlos Repartidor");
        repartidor.setNombreUsuario("carlos");
        repartidor.setCorreo("carlos@test.com");
        repartidor.setTelefono("0987654321");
        repartidor.setContrasenia("password123");
        repartidor.setRol("REPARTIDOR");
        repartidor.setEstado("DISPONIBLE");
        repartidor = usuarioRepository.save(repartidor);

        // Crear producto
        producto = new Producto();
        producto.setNombre("Taco al Pastor");
        producto.setDescripcion("Delicioso taco");
        producto.setPrecioDeVenta(25.0f);
        producto.setPrecioDeAdquisicion(15.0f);
        producto.setDisponible(true);
        producto.setActivo(true);
        producto = productRepository.save(producto);
    }

    @Test
    @DisplayName("Integration 1: Obtener todos los pedidos")
    void testGetAllPedidos() {
        // Arrange - crear pedidos manualmente
        Pedido pedido1 = new Pedido();
        pedido1.setCliente(cliente);
        pedido1.setDireccion("Calle 123");
        pedido1.setEstado("RECIBIDO");
        pedido1.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido1.setPrecioDeVenta(100.0f);
        pedidoRepository.save(pedido1);

        Pedido pedido2 = new Pedido();
        pedido2.setCliente(cliente);
        pedido2.setDireccion("Calle 456");
        pedido2.setEstado("ENVIADO");
        pedido2.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido2.setPrecioDeVenta(150.0f);
        pedidoRepository.save(pedido2);

        // Act
        List<Pedido> pedidos = pedidoService.getAllPedidos();

        // Assert
        assertThat(pedidos).hasSize(2);
        assertThat(pedidos).extracting(Pedido::getDireccion)
                .containsExactlyInAnyOrder("Calle 123", "Calle 456");
    }

    @Test
    @DisplayName("Integration 2: Obtener pedidos por cliente")
    void testGetPedidosByCliente() {
        // Arrange
        Pedido pedido1 = new Pedido();
        pedido1.setCliente(cliente);
        pedido1.setDireccion("Calle 123");
        pedido1.setEstado("RECIBIDO");
        pedido1.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedidoRepository.save(pedido1);

        // Act
        List<Pedido> pedidos = pedidoService.getPedidosByCliente(cliente.getId());

        // Assert
        assertThat(pedidos).hasSize(1);
        assertThat(pedidos.get(0).getCliente().getId()).isEqualTo(cliente.getId());
        assertThat(pedidos.get(0).getDireccion()).isEqualTo("Calle 123");
    }

    @Test
    @DisplayName("Integration 3: Obtener pedido por ID")
    void testGetPedidoById() {
        // Arrange
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccion("Calle 789");
        pedido.setEstado("RECIBIDO");
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido = pedidoRepository.save(pedido);

        // Act
        Pedido found = pedidoService.getPedidoById(pedido.getId());

        // Assert
        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(pedido.getId());
        assertThat(found.getDireccion()).isEqualTo("Calle 789");
    }

    @Test
    @DisplayName("Integration 4: Actualizar estado de pedido")
    void testActualizarEstado() {
        // Arrange
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccion("Calle ABC");
        pedido.setEstado("RECIBIDO");
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido = pedidoRepository.save(pedido);

        // Act
        Pedido actualizado = pedidoService.actualizarEstado(pedido.getId(), "PREPARANDO");

        // Assert
        assertThat(actualizado).isNotNull();
        assertThat(actualizado.getEstado()).isEqualTo("PREPARANDO");
    }

    @Test
    @DisplayName("Integration 5: Asignar repartidor a pedido")
    void testAsignarRepartidor() {
        // Arrange
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccion("Calle XYZ");
        pedido.setEstado("PREPARANDO");
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido = pedidoRepository.save(pedido);

        AsignarRepartidorDTO dto = new AsignarRepartidorDTO();
        dto.setPedidoId(pedido.getId());
        dto.setRepartidorId(repartidor.getId());

        // Act
        Pedido pedidoConRepartidor = pedidoService.asignarRepartidor(dto);

        // Assert
        assertThat(pedidoConRepartidor).isNotNull();
        assertThat(pedidoConRepartidor.getRepartidor()).isNotNull();
        assertThat(pedidoConRepartidor.getRepartidor().getId()).isEqualTo(repartidor.getId());
        assertThat(pedidoConRepartidor.getRepartidor().getRol()).isEqualTo("REPARTIDOR");
    }
}
