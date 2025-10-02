package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.Producto;

public interface ProductoService {
    // CRUD Productos
    List<Producto> getAllProductos();
    Optional<Producto> getProductoById(Integer id);
    Producto saveProducto(Producto producto);
    String eliminarProducto(Integer id); // Cambiar void por String
    List<Producto> getProductosDisponibles();
    
    // Método para asignar adicionales por sus IDs
    Producto asignarAdicionalesPorIds(Integer productoId, List<Integer> adicionalesIds);
}
