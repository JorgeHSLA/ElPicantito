package com.picantito.picantito.service;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.repository.PedidoRepository;
import com.picantito.picantito.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas Unitarias con Mocks del Servicio de Pedidos
 * Usa mocks de Mockito para simular dependencias
 * Total: 5 tests unitarios con mocks
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias con Mocks de PedidoService")
class PedidoServiceMockTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    private Pedido pedido;
    private User cliente;
    private User repartidor;

    @BeforeEach
    void setUp() {
        // Crear cliente mock
        cliente = new User();
        cliente.setId(1);
        cliente.setNombreCompleto("Juan Pérez");
        cliente.setNombreUsuario("juan");
        cliente.setCorreo("juan@test.com");
        cliente.setTelefono("1234567890");
        cliente.setRol("CLIENTE");
        cliente.setEstado("ACTIVO");

        // Crear repartidor mock
        repartidor = new User();
        repartidor.setId(2);
        repartidor.setNombreCompleto("Carlos Repartidor");
        repartidor.setNombreUsuario("carlos");
        repartidor.setCorreo("carlos@test.com");
        repartidor.setTelefono("0987654321");
        repartidor.setRol("REPARTIDOR");
        repartidor.setEstado("DISPONIBLE");

        // Crear pedido mock
        pedido = new Pedido();
        pedido.setId(1);
        pedido.setCliente(cliente);
        pedido.setDireccion("Calle 123");
        pedido.setEstado("RECIBIDO");
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido.setPrecioDeVenta(100.0f);
    }

    @Test
    @DisplayName("Debería obtener todos los pedidos usando mock")
    void testGetAllPedidos() {
        // Arrange
        Pedido pedido2 = new Pedido();
        pedido2.setId(2);
        pedido2.setCliente(cliente);
        pedido2.setEstado("ENVIADO");

        when(pedidoRepository.findAll()).thenReturn(Arrays.asList(pedido, pedido2));

        // Act
        List<Pedido> pedidos = pedidoService.getAllPedidos();

        // Assert
        assertThat(pedidos).hasSize(2);
        assertThat(pedidos).contains(pedido, pedido2);
        verify(pedidoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debería encontrar un pedido por ID existente")
    void testGetPedidoByIdExistente() {
        // Arrange
        when(pedidoRepository.findById(1)).thenReturn(Optional.of(pedido));

        // Act
        Pedido found = pedidoService.getPedidoById(1);

        // Assert
        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1);
        assertThat(found.getDireccion()).isEqualTo("Calle 123");
        verify(pedidoRepository, times(1)).findById(1);
    }

    @Test
    @DisplayName("Debería retornar null cuando el pedido no existe")
    void testGetPedidoByIdInexistente() {
        // Arrange
        when(pedidoRepository.findById(999)).thenReturn(Optional.empty());

        // Act
        Pedido found = pedidoService.getPedidoById(999);

        // Assert
        assertThat(found).isNull();
        verify(pedidoRepository, times(1)).findById(999);
    }

    @Test
    @DisplayName("Debería actualizar el estado de un pedido correctamente")
    void testActualizarEstadoExitoso() {
        // Arrange
        when(pedidoRepository.findById(1)).thenReturn(Optional.of(pedido));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        // Act
        Pedido actualizado = pedidoService.actualizarEstado(1, "PREPARANDO");

        // Assert
        assertThat(actualizado).isNotNull();
        assertThat(actualizado.getEstado()).isEqualTo("PREPARANDO");
        verify(pedidoRepository, times(1)).findById(1);
        verify(pedidoRepository, times(1)).save(pedido);
    }

    @Test
    @DisplayName("Debería asignar un repartidor a un pedido exitosamente")
    void testAsignarRepartidorExitoso() {
        // Arrange
        when(pedidoRepository.findById(1)).thenReturn(Optional.of(pedido));
        when(usuarioRepository.findById(2)).thenReturn(Optional.of(repartidor));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedido);

        AsignarRepartidorDTO dto = new AsignarRepartidorDTO();
        dto.setPedidoId(1);
        dto.setRepartidorId(2);

        // Act
        Pedido resultado = pedidoService.asignarRepartidor(dto);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getRepartidor()).isEqualTo(repartidor);
        verify(pedidoRepository, times(1)).findById(1);
        verify(usuarioRepository, times(1)).findById(2);
        verify(pedidoRepository, times(1)).save(pedido);
    }
}