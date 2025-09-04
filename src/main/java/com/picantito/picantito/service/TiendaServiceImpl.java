package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;

@Service
public class TiendaServiceImpl implements TiendaService {

    @Autowired
    private ProductRepository productoRepository;
    
    @Autowired
    private AdicionalRepository adicionalRepository;

    // CRUD Productos
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
    public void deleteProducto(Integer id) {
        productoRepository.deleteById(id);
    }
    
    @Override
    public List<Producto> getProductosDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }

    // CRUD Adicionales
    @Override
    public List<Adicional> getAllAdicionales() {
        return adicionalRepository.findAll();
    }

    @Override
    public Optional<Adicional> getAdicionalById(Integer id) {
        return adicionalRepository.findById(id);
    }

    @Override
    public Adicional saveAdicional(Adicional adicional) {
        return adicionalRepository.save(adicional);
    }

    @Override
    public void deleteAdicional(Integer id) {
        adicionalRepository.deleteById(id);
    }

    @Override
    public List<Adicional> getAdicionalesByProductoId(Integer productoId) {
        return adicionalRepository.findByProductoIdAndDisponibleTrue(productoId);
    }

    @Override
    public List<Adicional> getAdicionalesDisponibles() {
        return adicionalRepository.findByDisponibleTrue();
    }
    
    @Override
    public List<Adicional> getAdicionalesSinAsignar() {
        return adicionalRepository.findByDisponibleTrueAndProductoIsNull();
    }

    @Override
    public List<String> asignarAdicionales(Integer productoId, List<Integer> adicionalesIds) {
        
        try {
            
    
            Optional<Producto> producto = this.getProductoById(productoId);
            
            if (producto.isPresent()) {
                for (Integer adicionalId : adicionalesIds) {
                    Optional<Adicional> adicional = this.getAdicionalById(adicionalId);
                    if (adicional.isPresent() && adicional.get().getProducto() == null) {
                        adicional.get().setProducto(producto.get());
                        this.saveAdicional(adicional.get());
                    }
                }
                
                return List.of("1", "Adicionales asignados correctamente");
            } else {
                return List.of("0", "Producto no encontrado");
            }
            
        } catch (Exception e) {
            return List.of("1", "Error interno del servidor");
        }
        
    }

    public void updateAdicional( Integer productoId ,  Adicional adicional){

        // Establecer el producto si se selecciono uno
            if (productoId != null && productoId > 0) {
                Optional<Producto> producto = this.getProductoById(productoId);
                if (producto.isPresent()) {
                    adicional.setProducto(producto.get());
                }
            } else {
                adicional.setProducto(null);
            }
            
            this.saveAdicional(adicional);
    }

}
