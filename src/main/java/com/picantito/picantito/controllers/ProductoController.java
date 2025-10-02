package com.picantito.picantito.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.service.ProductoService;


@Controller
@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Mostrar información de una producto específica: http://localhost:9998/productos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoDetalle(@PathVariable Integer id) {
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
    
    // Mostrar información de todos los productos: http://localhost:9998/productos
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }
    
    // Crear un nuevo producto: POST http://localhost:9998/productos
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
    
}