package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.ProductRepository;


@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private ProductRepository productoRepository;
    

    // CRUD Productoss
    @Override
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> getProductoById(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public List<Producto> getProductosActivos() {
        return productoRepository.findByActivoTrue();
    }

    // eliminado logico
    @Override
    public String eliminarProducto(Integer id) {
        try {
            Optional<Producto> optionalProducto = getProductoById(id);
            if (optionalProducto.isPresent()) {
                Producto producto = optionalProducto.get();
                
                // Marcar como eliminado usando precioDeAdquisicion = -1
                producto.setPrecioDeAdquisicion(-1.0f);
                
                // También podemos marcar como no disponible para doble seguridad
                producto.setDisponible(false);
                
                // Guardar el producto con su nuevo estado
                productoRepository.save(producto);
                
                return "SUCCESS";
            } else {
                return "Producto no encontrado con ID: " + id;
            }
        } catch (Exception e) {
            return "No se puede marcar el producto como eliminado. Error: " + e.getMessage();
        }
    }
    
    @Override
    public List<Producto> getProductosDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }
    


}
