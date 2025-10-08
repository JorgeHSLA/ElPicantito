package com.picantito.picantito.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.picantito.picantito.entities.Adicional;
import com.picantito.picantito.entities.Producto;
import com.picantito.picantito.entities.ProductoAdicional;
import com.picantito.picantito.entities.ProductoAdicionalId;
import com.picantito.picantito.repository.AdicionalRepository;
import com.picantito.picantito.repository.ProductRepository;
import com.picantito.picantito.repository.ProductoAdicionalRepository;



@Service
public class AdicionalServiceImpl implements AdicionalService {

    @Autowired
    private AdicionalRepository adicionalRepository;

    @Autowired
    private ProductoAdicionalRepository productoAdicionalRepository;

    @Autowired
    private ProductRepository productRepository;

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
    public String eliminarAdicional(Integer id) {
        try {
            Optional<Adicional> optionalAdicional = getAdicionalById(id);
            if (optionalAdicional.isPresent()) {
                adicionalRepository.deleteById(id);
                return "SUCCESS";
            } else {
                return "Adicional no encontrado con ID: " + id;
            }
        } catch (Exception e) {
            return "No se puede eliminar el adicional. Error: " + e.getMessage();
        }
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
        return adicionalRepository.findByDisponibleTrueAndProductosIsEmpty();
    }


    @Override
    public void updateAdicional(Integer productoId, Adicional adicional) {
        this.saveAdicional(adicional);
    }


    @Override
    public List<Adicional> getAdicionalesDisponiblesParaProducto(Integer productoId) {
        return adicionalRepository.findAvailableForProduct(productoId);
    }

    @Override
    public List<ProductoAdicional> getProductoAdicionales() {
        return productoAdicionalRepository.findAll();
    }

    @Override
    public List<ProductoAdicional> getProductoAdicionalesByProductoId(Integer productoId) {
        return productoAdicionalRepository.findByProductoId(productoId);
    }

    @Override
    public List<ProductoAdicional> getProductoAdicionalesByAdicionalId(Integer adicionalId) {
        return productoAdicionalRepository.findByAdicionalId(adicionalId);
    }

    @Override
    public ProductoAdicional crearProductoAdicional(Integer productoId, Integer adicionalId) {
        Optional<Producto> producto = productRepository.findById(productoId);
        if (!producto.isPresent()) {
            throw new RuntimeException("Producto no encontrado con ID: " + productoId);
        }

        Optional<Adicional> adicional = adicionalRepository.findById(adicionalId);
        if (!adicional.isPresent()) {
            throw new RuntimeException("Adicional no encontrado con ID: " + adicionalId);
        }

        Optional<ProductoAdicional> existingRelation = productoAdicionalRepository
                .findByProductoIdAndAdicionalId(productoId, adicionalId);
        if (existingRelation.isPresent()) {
            throw new RuntimeException("La relación producto-adicional ya existe");
        }

        ProductoAdicional productoAdicional = new ProductoAdicional();
        ProductoAdicionalId id = new ProductoAdicionalId();
        id.setProductoId(productoId);
        id.setAdicionalId(adicionalId);
        
        productoAdicional.setId(id);
        productoAdicional.setProducto(producto.get());
        productoAdicional.setAdicional(adicional.get());
        productoAdicional.setCantidadProducto(1);

        return productoAdicionalRepository.save(productoAdicional);
    }

    @Override
    public String eliminarProductoAdicional(Integer productoId, Integer adicionalId) {
        try {
            Optional<ProductoAdicional> relacion = productoAdicionalRepository
                    .findByProductoIdAndAdicionalId(productoId, adicionalId);
            
            if (relacion.isPresent()) {
                productoAdicionalRepository.delete(relacion.get());
                return "SUCCESS";
            } else {
                return "Relación producto-adicional no encontrada";
            }
        } catch (Exception e) {
            return "No se puede eliminar la relación. Error: " + e.getMessage();
        }
    }
}