package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.ProductoAdicional;

public interface AdicionalService {
    List<Adicional> getAllAdicionales();
    Optional<Adicional> getAdicionalById(Integer id);
    Adicional saveAdicional(Adicional adicional);
    String eliminarAdicional(Integer id); // Cambiar void por String
    List<Adicional> getAdicionalesByProductoId(Integer productoId);
    List<Adicional> getAdicionalesDisponibles();
    List<Adicional> getAdicionalesSinAsignar();
    void updateAdicional(Integer productoId, Adicional adicional);    
    List<Adicional> getAdicionalesDisponiblesParaProducto(Integer productoId);
    List<ProductoAdicional> getProductoAdicionales();
    List<ProductoAdicional> getProductoAdicionalesByProductoId(Integer productoId);
    
}
