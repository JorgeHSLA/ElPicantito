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

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.service.ProductoService;




@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200") // Permitir solicitudes desde el frontend en localhost:4200
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Mostrar información de una producto específica: http://localhost:9998/api/productos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProducto(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.getProductoById(id);

        if (producto.isPresent()) {
            // Simplemente devolvemos el producto directamente, sin adicionales
            return ResponseEntity.ok(producto.get());
        } else {
            // en vez de "redirect", devolvemos 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body("Producto no encontrado");
        }
    }
    
    // Mostrar información de todos los productos: http://localhost:9998/api/productos
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        System.out.println("ProductoController: Recibida petición GET a /api/productos");
        List<Producto> productos = productoService.getAllProductos();
        System.out.println("ProductoController: Devolviendo " + productos.size() + " productos al cliente");
        if (productos.isEmpty()) {
            System.out.println("ProductoController: ALERTA - Lista de productos vacía");
        }
        return ResponseEntity.ok(productos);
    }
    
    // Crear un nuevo producto: POST http://localhost:9998/api/productos
    @PostMapping
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            // Validación básica
            if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre del producto es obligatorio");
            }
            
            // Guardar el producto
            Producto productoGuardado = productoService.saveProducto(producto);
            
            // Devolver el producto creado con código 201 (Created)
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(productoGuardado);
        } catch (Exception e) {
            // Manejar cualquier error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el producto: " + e.getMessage());
        }
    }
    
    // Eliminar lógicamente un producto: DELETE http://localhost:9998/api/productos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Integer id) {
        try {
            String resultado = productoService.eliminarProducto(id);
            if ("SUCCESS".equals(resultado)) {
                return ResponseEntity.ok()
                        .body(Map.of(
                            "mensaje", "Producto eliminado correctamente",
                            "id", id
                        ));
            } else if (resultado != null && resultado.startsWith("Producto no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(resultado);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(resultado);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el producto: " + e.getMessage());
        }
    }

    
    // Editar producto existente: PUT http://localhost:9998/api/productos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Integer id, @RequestBody Producto producto) {
        try {
            Optional<Producto> optionalProducto = productoService.getProductoById(id);
            if (!optionalProducto.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Producto no encontrado con ID: " + id);
            }
            // Asegura que el ID sea el correcto
            producto.setId(id);
            Producto actualizado = productoService.saveProducto(producto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar producto: " + e.getMessage());
        }
    }

    // Obtener productos activos: GET http://localhost:9998/api/productos/activos
    @GetMapping("/activos")
    public ResponseEntity<List<Producto>> getProductosActivos() {
        System.out.println("ProductoController: Recibida petición GET a /api/productos/activos");
        List<Producto> productosActivos = productoService.getProductosActivos();
        System.out.println("ProductoController: Devolviendo " + productosActivos.size() + " productos activos al cliente");
        if (productosActivos.isEmpty()) {
            System.out.println("ProductoController: ALERTA - Lista de productos activos vacía");
        } else {
            System.out.println("ProductoController: Primer producto activo: " + productosActivos.get(0).getNombre());
        }
        return ResponseEntity.ok(productosActivos);
    }
    
}