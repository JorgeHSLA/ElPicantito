package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductosAdicionales;

public interface TiendaService {
    // CRUD Productos
    List<Producto> getAllProductos();
    Optional<Producto> getProductoById(Integer id);
    Producto saveProducto(Producto producto);
    String eliminarProducto(Integer id);
    List<Producto> getProductosDisponibles();
    
    // CRUD Adicionales
    List<Adicional> getAllAdicionales();
    Optional<Adicional> getAdicionalById(Integer id);
    Adicional saveAdicional(Adicional adicional);
    String eliminarAdicional(Integer id);
    List<Adicional> getAdicionalesDisponibles();
    List<Producto> getProductosByAdicional(Integer adicionalId);
    
    // Gestión de relaciones Productos-Adicionales
    List<ProductosAdicionales> getProductosAdicionalesByProducto(Integer productoId);
    List<ProductosAdicionales> getProductosAdicionalesByAdicional(Integer adicionalId);
    ProductosAdicionales saveProductoAdicional(ProductosAdicionales productoAdicional);
    String eliminarProductoAdicional(Integer id);
    String asociarAdicionalAProducto(Integer productoId, Integer adicionalId, Integer cantidad);
    String desasociarAdicionalDeProducto(Integer productoId, Integer adicionalId);
    String asociarAdicionalAProductos(Integer adicionalId, List<Integer> productosIds);
}
