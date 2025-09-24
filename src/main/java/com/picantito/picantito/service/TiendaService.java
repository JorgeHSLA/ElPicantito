package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;

public interface TiendaService {
    // CRUD Productos
    List<Producto> getAllProductos();
    Optional<Producto> getProductoById(Integer id);
    Producto saveProducto(Producto producto);
    String eliminarProducto(Integer id); // Cambiar void por String
    List<Producto> getProductosDisponibles();
    // CRUD Adicionales
    List<Adicional> getAllAdicionales();
    Optional<Adicional> getAdicionalById(Integer id);
    Adicional saveAdicional(Adicional adicional);
    String eliminarAdicional(Integer id); // Cambiar void por String
    List<Adicional> getAdicionalesByProductoId(Integer productoId);
    List<Adicional> getAdicionalesDisponibles();
    List<Adicional> getAdicionalesSinAsignar();
    List<String> asignarAdicionales(Integer productoId, List<Integer> adicionalesIds);
    void updateAdicional(Integer productoId, Adicional adicional);    
    void asociarAdicionalAProductos(Integer adicionalId, List<Integer> productosIds);
    void desasociarAdicionalDeProducto(Integer adicionalId, Integer productoId);
    List<Adicional> getAdicionalesDisponiblesParaProducto(Integer productoId);
}
