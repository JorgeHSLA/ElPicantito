package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.dto.AsignarRepartidorDTO;
import com.picantito.picantito.dto.CrearPedidoDTO;
import com.picantito.picantito.dto.response.PedidoResponseDTO;
import com.picantito.picantito.entities.Pedido;
import com.picantito.picantito.mapper.PedidoMapper;
import com.picantito.picantito.service.PedidoService;
import com.picantito.picantito.service.EmailService;
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(originPatterns = "*", allowCredentials = "false") // Para desarrollo - permite todos los orígenes
//@CrossOrigin(origins = "http://localhost:4200") // Solo para Angular
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    
    @Autowired
    private PedidoMapper pedidoMapper;
    
    @Autowired
    private EmailService emailService;

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
            System.out.println("📥 Recibido DTO: " + pedidoDTO);
            System.out.println("📍 Dirección recibida: " + pedidoDTO.getDireccion());
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoDTO);
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(nuevoPedido);
            
            // Enviar email de confirmación al cliente
            try {
                String emailCliente = nuevoPedido.getCliente().getCorreo();
                String nombreCliente = nuevoPedido.getCliente().getNombreCompleto();
                Integer clienteId = nuevoPedido.getCliente().getId();
                emailService.enviarConfirmacionPedidoCreado(
                    emailCliente,
                    nombreCliente,
                    nuevoPedido.getId(),
                    nuevoPedido.getPrecioDeVenta().doubleValue(),
                    nuevoPedido.getDireccion(),
                    clienteId
                );
                System.out.println("Email de confirmación enviado a: " + emailCliente);
            } catch (Exception emailError) {
                System.err.println("Error enviando email de confirmación: " + emailError.getMessage());
                // No fallar la creación del pedido si el email falla
            }
            
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creando pedido: " + e.getMessage());
            // Log del error (reemplazar por logger adecuado)
            System.err.println("Stacktrace: " + e);
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/asignar-repartidor")
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

    // Actualizar estado de un pedido: http://localhost:9998/api/pedidos/{id}/estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(@PathVariable Integer id, @RequestBody String estado) {
        try {
            Pedido pedido = pedidoService.actualizarEstado(id, estado);
            if (pedido == null) {
                return new ResponseEntity<>("Pedido no encontrado con ID: " + id, HttpStatus.NOT_FOUND);
            }
            
            // Enviar notificación por email
            if (pedido.getCliente() != null && pedido.getCliente().getCorreo() != null) {
                String nombreCliente = pedido.getCliente().getNombreCompleto();
                Integer clienteId = pedido.getCliente().getId();
                emailService.enviarNotificacionCambioEstado(
                    pedido.getCliente().getCorreo(),
                    nombreCliente,
                    pedido.getId().longValue(),
                    pedido.getEstado(),
                    clienteId
                );
            }
            
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(pedido);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar estado del pedido: " + e.getMessage());
        }
    }

    // Actualizar estado de un pedido (PATCH con JSON): http://localhost:9998/api/pedidos/{id}/estado
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedidoPatch(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String estado = body.get("estado");
            if (estado == null || estado.trim().isEmpty()) {
                return new ResponseEntity<>("El estado no puede estar vacío", HttpStatus.BAD_REQUEST);
            }
            
            Pedido pedido = pedidoService.actualizarEstado(id, estado);
            if (pedido == null) {
                return new ResponseEntity<>("Pedido no encontrado con ID: " + id, HttpStatus.NOT_FOUND);
            }
            
            // Enviar notificación por email
            if (pedido.getCliente() != null && pedido.getCliente().getCorreo() != null) {
                String nombreCliente = pedido.getCliente().getNombreCompleto();
                Integer clienteId = pedido.getCliente().getId();
                emailService.enviarNotificacionCambioEstado(
                    pedido.getCliente().getCorreo(),
                    nombreCliente,
                    pedido.getId().longValue(),
                    pedido.getEstado(),
                    clienteId
                );
            }
            
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(pedido);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar estado del pedido: " + e.getMessage());
        }
    }

    // Asignar repartidor a un pedido con verificaciones: http://localhost:9998/api/pedidos/asignar-repartidor-verificado
    @PutMapping("/asignar-repartidor-verificado")
    public ResponseEntity<?> asignarRepartidorVerificado(@RequestBody AsignarRepartidorDTO asignacionDTO) {
        try {
            if (asignacionDTO.getRepartidorId() == null) {
                return new ResponseEntity<>("Error: el id de repartidor no puede ser nulo", HttpStatus.BAD_REQUEST);
            }
            if (asignacionDTO.getPedidoId() == null) {
                return new ResponseEntity<>("Error: el id de pedido no puede ser nulo", HttpStatus.BAD_REQUEST);
            }
            System.out.println("Recibido DTO: " + asignacionDTO);
            Pedido pedidoModificado = pedidoService.asignarRepartidorVerificado(asignacionDTO);
            PedidoResponseDTO responseDTO = pedidoMapper.toDTO(pedidoModificado);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            System.err.println("Error asignando repartidor al pedido: " + e.getMessage());
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Eliminar un pedido: http://localhost:9998/api/pedidos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Integer id) {
        try {
            pedidoService.eliminarPedido(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error eliminando pedido: " + e.getMessage());
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
