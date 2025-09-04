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
    void deleteProducto(Integer id);
    List<Producto> getProductosDisponibles();
    
    // CRUD Adicionales
    List<Adicional> getAllAdicionales();
    Optional<Adicional> getAdicionalById(Integer id);
    Adicional saveAdicional(Adicional adicional);
    void deleteAdicional(Integer id);
    List<Adicional> getAdicionalesByProductoId(Integer productoId);
    List<Adicional> getAdicionalesDisponibles();
    List<Adicional> getAdicionalesSinAsignar();
    List<String> asignarAdicionales(Integer productoId, List<Integer> adicionalesIds);
    public void updateAdicional( Integer productoId ,  Adicional adicional);
}
