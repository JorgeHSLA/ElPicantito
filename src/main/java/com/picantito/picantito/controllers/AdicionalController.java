package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.dto.ProductoAdicionalIdDTO;
import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.service.AdicionalService;

@RestController
@RequestMapping("/api/adicional")
@CrossOrigin(origins = "http://localhost:4200") // Permitir solicitudes desde el frontend en localhost:4200
public class AdicionalController {
    
    @Autowired
    private AdicionalService adicionalService;
    
    // Obtener todos los adicionales: http://localhost:9998/api/adicional
    @GetMapping
    public ResponseEntity<List<Adicional>> getAllAdicionales() {
        List<Adicional> adicionales = adicionalService.getAllAdicionales();
        return ResponseEntity.ok(adicionales);
    }
    
    // Obtener información de un adicional específico: http://localhost:9998/api/adicional/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdicionalById(@PathVariable Integer id) {
        Optional<Adicional> adicional = adicionalService.getAdicionalById(id);
        if (adicional.isPresent()) {
            return ResponseEntity.ok(adicional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Adicional no encontrado con ID: " + id);
        }
    }
    
    // Crear un nuevo adicional: http://localhost:9998/api/adicional
    @PostMapping
    public ResponseEntity<?> crearAdicional(@RequestBody Adicional adicional) {
        try {
            // Validación de atributos requeridos
            if (adicional.getNombre() == null || adicional.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }
            
            if (adicional.getDescripcion() == null || adicional.getDescripcion().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La descripción es obligatoria");
            }
            
            if (adicional.getPrecioDeVenta() == null || adicional.getPrecioDeVenta() <= 0) {
                return ResponseEntity.badRequest().body("El precio de venta debe ser mayor que cero");
            }
            
            if (adicional.getPrecioDeAdquisicion() == null || adicional.getPrecioDeAdquisicion() <= 0) {
                return ResponseEntity.badRequest().body("El precio de adquisición debe ser mayor que cero");
            }
            
            if (adicional.getCantidad() == null || adicional.getCantidad() <= 0) {
                return ResponseEntity.badRequest().body("La cantidad debe ser mayor que cero");
            }
            
            // Por defecto, el adicional se crea como disponible y activo
            if (adicional.getDisponible() == null) {
                adicional.setDisponible(true);
            }
            
            if (adicional.getActivo() == null) {
                adicional.setActivo(true);
            }
            
            Adicional nuevoAdicional = adicionalService.saveAdicional(adicional);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAdicional);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear adicional: " + e.getMessage());
        }
    }
    
    // Actualizar información de un adicional: http://localhost:9998/api/adicional/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAdicional(@PathVariable Integer id, @RequestBody Adicional adicional) {
        try {
            Optional<Adicional> optionalAdicional = adicionalService.getAdicionalById(id);
            if (!optionalAdicional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Adicional no encontrado con ID: " + id);
            }
            
            Adicional adicionalExistente = optionalAdicional.get();
            
            // Verificar si está marcado como eliminado lógicamente
            if (adicionalExistente.getPrecioDeAdquisicion() != null && adicionalExistente.getPrecioDeAdquisicion() == -1.0f) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No se puede actualizar un adicional que ha sido eliminado");
            }
            
            // Validación de atributos requeridos
            if (adicional.getNombre() == null || adicional.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }
            
            if (adicional.getDescripcion() == null || adicional.getDescripcion().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La descripción es obligatoria");
            }
            
            if (adicional.getPrecioDeVenta() == null || adicional.getPrecioDeVenta() <= 0) {
                return ResponseEntity.badRequest().body("El precio de venta debe ser mayor que cero");
            }
            
            if (adicional.getPrecioDeAdquisicion() == null || adicional.getPrecioDeAdquisicion() <= 0) {
                return ResponseEntity.badRequest().body("El precio de adquisición debe ser mayor que cero");
            }
            
            if (adicional.getCantidad() == null || adicional.getCantidad() <= 0) {
                return ResponseEntity.badRequest().body("La cantidad debe ser mayor que cero");
            }
            
            // Aseguramos que el ID sea el correcto
            adicional.setId(id);
            
            // Conservar las relaciones existentes
            adicional.setProductoAdicionales(adicionalExistente.getProductoAdicionales());
            adicional.setPedidoProductoAdicionales(adicionalExistente.getPedidoProductoAdicionales());
            
            Adicional adicionalActualizado = adicionalService.saveAdicional(adicional);
            return ResponseEntity.ok(adicionalActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar adicional: " + e.getMessage());
        }
    }
    
    // Eliminar adicional (marcado lógico): http://localhost:9998/api/adicional/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAdicional(@PathVariable Integer id) {
        try {
            String resultado = adicionalService.eliminarAdicional(id);
            if ("SUCCESS".equals(resultado)) {
                return ResponseEntity.ok()
                        .body(Map.of(
                            "mensaje", "Adicional eliminado correctamente",
                            "id", id
                        ));
            } else if (resultado != null && resultado.startsWith("Adicional no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(resultado);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(resultado);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar adicional: " + e.getMessage());
        }
    }
    
    // Obtener adicionales disponibles: http://localhost:9998/api/adicional/disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<List<Adicional>> getAdicionalesDisponibles() {
        List<Adicional> adicionales = adicionalService.getAdicionalesDisponibles();
        return ResponseEntity.ok(adicionales);
    }
    
    // Obtener adicionales sin asignar a productos: http://localhost:9998/api/adicional/sin-asignar
    @GetMapping("/sin-asignar")
    public ResponseEntity<List<Adicional>> getAdicionalesSinAsignar() {
        List<Adicional> adicionales = adicionalService.getAdicionalesSinAsignar();
        return ResponseEntity.ok(adicionales);
    }
    
    // Obtener adicionales por producto: http://localhost:9998/api/adicional/producto/{productoId}
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Adicional>> getAdicionalesPorProducto(@PathVariable Integer productoId) {
        List<Adicional> adicionales = adicionalService.getAdicionalesByProductoId(productoId);
        return ResponseEntity.ok(adicionales);
    }
    
    // Obtener adicionales disponibles para un producto: http://localhost:9998/api/adicional/disponibles-para-producto/{productoId}
    @GetMapping("/disponibles-para-producto/{productoId}")
    public ResponseEntity<List<Adicional>> getAdicionalesDisponiblesParaProducto(@PathVariable Integer productoId) {
        List<Adicional> adicionales = adicionalService.getAdicionalesDisponiblesParaProducto(productoId);
        return ResponseEntity.ok(adicionales);
    }


    // Endpoint que devuelve solo los IDs usando DTOs
    @GetMapping("/productoAdicionales")
    public ResponseEntity<List<ProductoAdicionalIdDTO>> getProductoAdicionalesIds() {
        List<ProductoAdicionalIdDTO> productoAdicionales = adicionalService.getProductoAdicionalesIds();
        return ResponseEntity.ok(productoAdicionales);
    }
    
    // Endpoint que devuelve solo los IDs por producto usando DTOs
    @GetMapping("/productoAdicionales/{productoId}")
    public ResponseEntity<List<ProductoAdicionalIdDTO>> getProductoAdicionalesIdsByProductId(@PathVariable Integer productoId) {
        List<ProductoAdicionalIdDTO> productoAdicionales = adicionalService.getProductoAdicionalesIdsByProductoId(productoId);
        return ResponseEntity.ok(productoAdicionales);
    }
    
    // Endpoint que devuelve solo los IDs por adicional usando DTOs
    @GetMapping("/productoAdicionales/by-adicional/{adicionalId}")
    public ResponseEntity<List<ProductoAdicionalIdDTO>> getProductoAdicionalesIdsByAdicionalId(@PathVariable Integer adicionalId) {
        List<ProductoAdicionalIdDTO> productoAdicionales = adicionalService.getProductoAdicionalesIdsByAdicionalId(adicionalId);
        return ResponseEntity.ok(productoAdicionales);
    }

    @PostMapping("/productoAdicionales")
    public ResponseEntity<?> crearProductoAdicional(@RequestBody Map<String, Integer> request) {
        try {
            Integer productoId = request.get("productoId");
            Integer adicionalId = request.get("adicionalId");
            
            if (productoId == null || adicionalId == null) {
                return ResponseEntity.badRequest().body("productoId y adicionalId son requeridos");
            }
            
            ProductoAdicional resultado = adicionalService.crearProductoAdicional(productoId, adicionalId);
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear relación producto-adicional: " + e.getMessage());
        }
    }

    @DeleteMapping("/productoAdicionales/{productoId}/{adicionalId}")
    public ResponseEntity<?> eliminarProductoAdicional(@PathVariable Integer productoId, @PathVariable Integer adicionalId) {
        try {
            String resultado = adicionalService.eliminarProductoAdicional(productoId, adicionalId);
            if ("SUCCESS".equals(resultado)) {
                return ResponseEntity.ok()
                        .body(Map.of(
                            "mensaje", "Relación eliminada correctamente",
                            "productoId", productoId,
                            "adicionalId", adicionalId
                        ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resultado);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar relación: " + e.getMessage());
        }
    }

}