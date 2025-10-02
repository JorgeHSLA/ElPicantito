package com.picantito.picantito.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;


@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    private ProductRepository productoRepository;
    
    @Autowired
    private AdicionalRepository adicionalRepository;

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


    // 
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
    
    @Override
    public Producto asignarAdicionalesPorIds(Integer productoId, List<Integer> adicionalesIds) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (!productoOpt.isPresent()) {
            throw new RuntimeException("Producto no encontrado con ID: " + productoId);
        }
        
        Producto producto = productoOpt.get();
        List<Adicional> adicionales = new ArrayList<>();
        
        for (Integer adicionalId : adicionalesIds) {
            Optional<Adicional> adicionalOpt = adicionalRepository.findById(adicionalId);
            if (adicionalOpt.isPresent()) {
                adicionales.add(adicionalOpt.get());
            }
        }
        
        // Usar el método existente para asignar adicionales
        producto.setAdicionales(adicionales);
        
        // Guardar y devolver el producto actualizado
        return productoRepository.save(producto);
    }

}
