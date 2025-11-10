package com.picantito.picantito.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.dto.response.PedidoResponseDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.entities.User;
import com.picantito.picantito.mapper.PedidoMapper;
import com.picantito.picantito.service.PedidoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas del Controlador de Pedidos con Mocks
 * Incluye tests para diferentes tipos de peticiones HTTP
 * Total: 5 tests de controlador
 */
@WebMvcTest(PedidoController.class)
@DisplayName("Pruebas del Controlador de Pedidos con Mocks")
class PedidoControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PedidoService pedidoService;

    @MockBean
    private PedidoMapper pedidoMapper;

    private Pedido pedido;
    private PedidoResponseDTO pedidoResponseDTO;
    private User cliente;
    private User repartidor;

    @BeforeEach
    void setUp() {
        // Crear cliente
        cliente = new User();
        cliente.setId(1);
        cliente.setNombreCompleto("Juan Pérez");
        cliente.setNombreUsuario("juan");
        cliente.addRoleByName("CLIENTE");

        // Crear repartidor
        repartidor = new User();
        repartidor.setId(2);
        repartidor.setNombreCompleto("Carlos Repartidor");
        repartidor.setNombreUsuario("carlos");
        repartidor.addRoleByName("REPARTIDOR");
        repartidor.setEstado("DISPONIBLE");

        // Crear pedido
        pedido = new Pedido();
        pedido.setId(1);
        pedido.setCliente(cliente);
        pedido.setDireccion("Calle 123");
        pedido.setEstado("RECIBIDO");
        pedido.setFechaSolicitud(new Timestamp(System.currentTimeMillis()));
        pedido.setPrecioDeVenta(100.0f);

        // Crear DTO de respuesta
        pedidoResponseDTO = new PedidoResponseDTO();
        pedidoResponseDTO.setId(1);
        pedidoResponseDTO.setDireccion("Calle 123");
        pedidoResponseDTO.setEstado("RECIBIDO");
        pedidoResponseDTO.setPrecioDeVenta(100.0f);
    }

    @Test
    @DisplayName("Debería obtener todos los pedidos mediante GET")
    void testGetAllPedidos() throws Exception {
        // Arrange
        Pedido pedido2 = new Pedido();
        pedido2.setId(2);
        pedido2.setEstado("ENVIADO");

        PedidoResponseDTO pedidoDTO2 = new PedidoResponseDTO();
        pedidoDTO2.setId(2);
        pedidoDTO2.setEstado("ENVIADO");

        List<Pedido> pedidos = Arrays.asList(pedido, pedido2);
        List<PedidoResponseDTO> pedidosDTO = Arrays.asList(pedidoResponseDTO, pedidoDTO2);

        when(pedidoService.getAllPedidos()).thenReturn(pedidos);
        when(pedidoMapper.toListDTO(pedidos)).thenReturn(pedidosDTO);

        // Act & Assert
        mockMvc.perform(get("/api/pedidos")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].estado").value("RECIBIDO"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].estado").value("ENVIADO"));

        verify(pedidoService, times(1)).getAllPedidos();
        verify(pedidoMapper, times(1)).toListDTO(pedidos);
    }

    @Test
    @DisplayName("Debería obtener un pedido por ID mediante GET")
    void testGetPedidoById() throws Exception {
        // Arrange
        when(pedidoService.getPedidoById(1)).thenReturn(pedido);
        when(pedidoMapper.toDTO(pedido)).thenReturn(pedidoResponseDTO);

        // Act & Assert
        mockMvc.perform(get("/api/pedidos/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.direccion").value("Calle 123"))
                .andExpect(jsonPath("$.estado").value("RECIBIDO"))
                .andExpect(jsonPath("$.precioDeVenta").value(100.0));

        verify(pedidoService, times(1)).getPedidoById(1);
        verify(pedidoMapper, times(1)).toDTO(pedido);
    }

    @Test
    @DisplayName("Debería asignar un repartidor mediante POST")
    void testAsignarRepartidor() throws Exception {
        // Arrange
        AsignarRepartidorDTO dto = new AsignarRepartidorDTO();
        dto.setPedidoId(1);
        dto.setRepartidorId(2);

        pedido.setRepartidor(repartidor);
        pedidoResponseDTO.setRepartidorId(2);

        when(pedidoService.asignarRepartidor(any(AsignarRepartidorDTO.class))).thenReturn(pedido);
        when(pedidoMapper.toDTO(pedido)).thenReturn(pedidoResponseDTO);

        // Act & Assert
        mockMvc.perform(post("/api/pedidos/asignar-repartidor")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.repartidorId").value(2));

        verify(pedidoService, times(1)).asignarRepartidor(any(AsignarRepartidorDTO.class));
        verify(pedidoMapper, times(1)).toDTO(pedido);
    }

    @Test
    @DisplayName("Debería actualizar el estado de un pedido mediante PATCH")
    void testActualizarEstadoPatch() throws Exception {
        // Arrange
        Map<String, String> estadoBody = new HashMap<>();
        estadoBody.put("estado", "PREPARANDO");

        pedido.setEstado("PREPARANDO");
        pedidoResponseDTO.setEstado("PREPARANDO");

        when(pedidoService.actualizarEstado(1, "PREPARANDO")).thenReturn(pedido);
        when(pedidoMapper.toDTO(pedido)).thenReturn(pedidoResponseDTO);

        // Act & Assert
        mockMvc.perform(patch("/api/pedidos/1/estado")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(estadoBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.estado").value("PREPARANDO"));

        verify(pedidoService, times(1)).actualizarEstado(1, "PREPARANDO");
        verify(pedidoMapper, times(1)).toDTO(pedido);
    }

    @Test
    @DisplayName("Debería eliminar un pedido mediante DELETE")
    void testEliminarPedido() throws Exception {
        // Arrange
        doNothing().when(pedidoService).eliminarPedido(1);

        // Act & Assert
        mockMvc.perform(delete("/api/pedidos/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(pedidoService, times(1)).eliminarPedido(1);
    }
}