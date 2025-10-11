package com.picantito.picantito.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.dto.response.PedidoResponseDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.mapper.PedidoMapper;
import com.picantito.picantito.service.PedidoService;
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(originPatterns = "*", allowCredentials = "false") // Para desarrollo - permite todos los orígenes
//@CrossOrigin(origins = "http://localhost:4200") // Solo para Angular
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    
    @Autowired
    private PedidoMapper pedidoMapper;

    // Obtener todos los pedidos de un cliente: http://localhost:9998/api/pedidos/cliente/{clienteId}
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoResponseDTO>> getPedidosByCliente(@PathVariable Integer clienteId) {
        List<Pedido> pedidos = pedidoService.getPedidosByCliente(clienteId);
        List<PedidoResponseDTO> pedidosDTO = pedidoMapper.toListDTO(pedidos);
        return ResponseEntity.ok(pedidosDTO);
    }

    // Obtener todos los pedidos de un repartidor: http://localhost:9998/api/pedidos/repartidor/{repartidorId}
    @GetMapping("/repartidor/{repartidorId}")
    public ResponseEntity<List<PedidoResponseDTO>> getPedidosByRepartidor(@PathVariable Integer repartidorId) {
        List<Pedido> pedidos = pedidoService.getPedidosByRepartidor(repartidorId);
        List<PedidoResponseDTO> pedidosDTO = pedidoMapper.toListDTO(pedidos);
        return ResponseEntity.ok(pedidosDTO);
    }
    
    // Obtener todos los pedidos: http://localhost:9998/api/pedidos
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> getAllPedidos() {
        List<Pedido> pedidos = pedidoService.getAllPedidos();
        List<PedidoResponseDTO> pedidosDTO = pedidoMapper.toListDTO(pedidos);
        return ResponseEntity.ok(pedidosDTO);
    }


    // Crear un nuevo pedido: http://localhost:9998/api/pedidos
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody CrearPedidoDTO pedidoDTO) {
        try {
            if (pedidoDTO.getRepartidorId() != null) {
                return new ResponseEntity<>("error, el repartidor debe ser nulo para crear un pedido:", HttpStatus.BAD_REQUEST);
            }
            System.out.println("Recibido DTO: " + pedidoDTO);
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoDTO);
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(nuevoPedido);
            
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creando pedido: " + e.getMessage());
            // Log del error (reemplazar por logger adecuado)
            System.err.println("Stacktrace: " + e);
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

        @PostMapping
    public ResponseEntity<?> asignarRepartidor(@RequestBody AsignarRepartidorDTO asignancionDTO) {
        try {
            if (asignancionDTO.getRepartidorId() == null) {
                return new ResponseEntity<>("error, el id de repartidor no puede ser nulo para asignar un repartidor:", HttpStatus.BAD_REQUEST);
            }else if(asignancionDTO.getPedidoId() == null){
                return new ResponseEntity<>("error, el id de pedido no puede ser nulo para asignar un repartidor:", HttpStatus.BAD_REQUEST);
            }
            System.out.println("Recibido DTO: " + asignancionDTO);
            Pedido pedidoModificado = pedidoService.asignarRepartidor(asignancionDTO);
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(pedidoModificado);

            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error asignando repartidor al pedido: " + e.getMessage());
            // Log del error (reemplazar por logger adecuado)
            System.err.println("Stacktrace: " + e);
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Obtener un pedido por su ID: http://localhost:9998/api/pedidos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoById(@PathVariable Integer id) {
        Pedido pedido = pedidoService.getPedidoById(id);
        if (pedido == null) {
            return new ResponseEntity<>("Pedido no encontrado con ID: " + id, HttpStatus.NOT_FOUND);
        }
        PedidoResponseDTO pedidoDTO = pedidoMapper.toDTO(pedido);
        return ResponseEntity.ok(pedidoDTO);
    }

}
