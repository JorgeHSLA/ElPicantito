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
        return adicionalRepository.findByDisponibleTrueAndProductosIsEmpty();
    }

    @Override
    public List<String> asignarAdicionales(Integer productoId, List<Integer> adicionalesIds) {
        try {
            Optional<Producto> producto = this.getProductoById(productoId);
            
            if (producto.isPresent()) {
                for (Integer adicionalId : adicionalesIds) {
                    Optional<Adicional> adicional = this.getAdicionalById(adicionalId);
                    if (adicional.isPresent()) {
                        if (!adicional.get().getProductos().contains(producto.get())) {
                            adicional.get().getProductos().add(producto.get());
                            this.saveAdicional(adicional.get());
                        }
                    }
                }
                return List.of("1", "Adicionales asignados correctamente");
            } else {
                return List.of("0", "Producto no encontrado");
            }
        } catch (Exception e) {
            return List.of("0", "Error interno del servidor");
        }
    }

    @Override
    public void updateAdicional(Integer productoId, Adicional adicional) {
        this.saveAdicional(adicional);
    }

    @Override
    public void asociarAdicionalAProductos(Integer adicionalId, List<Integer> productosIds) {
        try {
            Optional<Adicional> adicional = this.getAdicionalById(adicionalId);
            if (adicional.isPresent()) {
                adicional.get().getProductos().clear();
                
                if (productosIds != null) {
                    for (Integer productoId : productosIds) {
                        Optional<Producto> producto = this.getProductoById(productoId);
                        if (producto.isPresent()) {
                            adicional.get().getProductos().add(producto.get());
                            System.out.println("Asociando adicional " + adicional.get().getNombre() + 
                                             " con producto " + producto.get().getNombre());
                        }
                    }
                }                
                Adicional savedAdicional = adicionalRepository.save(adicional.get());
                System.out.println("Adicional guardado con " + savedAdicional.getProductos().size() + " productos asociados");
            }
        } catch (Exception e) {
            System.err.println("Error en asociarAdicionalAProductos: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void desasociarAdicionalDeProducto(Integer adicionalId, Integer productoId) {
        Optional<Adicional> adicional = this.getAdicionalById(adicionalId);
        Optional<Producto> producto = this.getProductoById(productoId);
        
        if (adicional.isPresent() && producto.isPresent()) {
            adicional.get().getProductos().remove(producto.get());
            this.saveAdicional(adicional.get());
        }
    }

    @Override
    public List<Adicional> getAdicionalesDisponiblesParaProducto(Integer productoId) {
        return adicionalRepository.findAvailableForProduct(productoId);
    }
}
